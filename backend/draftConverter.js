const mongoose = require('mongoose')
const localDbConnect = 'mongodb://localhost:27016/va-catalog'
const getDocuments = require('./utils/getDocuments.js')
const createBackup = require('./utils/createBackup')
const convertedError = require('./utils/convertedError')
const path = require("path")
const isPkg = process.hasOwnProperty('pkg')
const pkgPath = path.join(process.execPath, '..')
const notPkgPath = path.join(__dirname, '..', '..')
const pathDestinationFirst = path.join(isPkg ? pkgPath : notPkgPath, '/data', '/backupBDBeforeConverting')
const pathDestinationEnd = path.join(isPkg ? pkgPath : notPkgPath, '/data', '/backupBDAfterConverting')
const pkgPathDB = path.join(process.execPath, '..', '/data', '/mongodb')
const notPkgPathDB = path.join(__dirname, '..', '..', '/data', '/mongodb')
const processStatus = require('./utils/processStatus')
const startServerMongo = require('./utils/startServerMongo')
const convertData = require('./utils/convertData.js')
const getDataFromJsonFile = require("./utils/readFile");
const copyDir = require("./utils/copyDir");
const fileReader = require("./utils/fileReader.js");
module.exports = async function startConv() {
  try {
    console.log('-=-=-=-=ok0ld')
    //проверка на наличие запущенных версий модуля
    return processStatus('VIAR_Module').then(async (onActive) => {
      if (!onActive) {
        console.log('not active')
        //backup BD
        // const resultFirstBackup = await createBackup(pathDestinationFirst, 1)
        // if (!resultFirstBackup.length || resultFirstBackup.includes('ENOENT: no such file or directory,')) {
        //   console.log('Создаем папку для первичного бэкапа и записываем туда копии')
        //   await copyDir(isPkg ? pkgPathDB : notPkgPathDB, pathDestinationFirst)
        // }
        // if (resultFirstBackup.length) {
        //   console.log('Уже есть папка бэкапов с файлами')
        // }
        // Запуск сервера с базой
        await startServerMongo()
        return new Promise((resolve, reject) => {
          //соединение с базой
          console.log('try connect to db')
          const conn = mongoose.createConnection(localDbConnect, {
            useUnifiedTopology: true,
            useNewUrlParser: true
          }, (err, connect) => {
            if (connect.on) {
              console.log('connect to DB OK')
            }
            if (err || !connect.on) {
              console.log(err, 'ERROR');
            }
          })
          console.log('try converting')
          conn.on('open', async function (err, result) {
            if (err) {
              console.log("ошибка соединения", err.message)
              reject({errMsg: `"ошибка соединения" ${err.message}`, 'statusConvert': 500})
            }
            //получаем данные структуры из файла конвертации
            // const structureFromConvertFile = await getDataFromJsonFile('', 'convert')
            // //получаем данные по коллекциям из файла
            // const collectionsDataFromConvertFileCollections = await getDataFromJsonFile('', 'collections_convert')
            //получаем список имен коллекций в базе из которых нужно получить данные
  
  
            // const dataFromConvertFile = await getDataFromJsonFile('', 'convert')
            // const listCollections =
            // dataFromConvertFile.hasOwnProperty('models') ? dataFromConvertFile.models.reduce((arr, collection) => {
            //   if (collection.hasOwnProperty('source_db')) {
            //     arr.push({[collection.old_id]: collection.source_db});
            //   }
            //   return arr
            // }, []) : []
            
            
            if (global.hasOwnProperty('listCollection') && global.hasOwnProperty('dataForSaveToFile')){}
            //данные для записи в metas
            // const dataFromConvertFile = await getDataFromJsonFile('', 'metas')
            const dataFromConvertFile = global.hasOwnProperty('dataForSaveToFile') ? global.dataForSaveToFile : await getDataFromJsonFile('', 'convert')
            
              const listCollection = global.hasOwnProperty('listCollections') ? global.listCollections : []
              //   structureFromConvertFile.hasOwnProperty('models') ? structureFromConvertFile.models.reduce((arr, collection) => {
              //   if (collection.hasOwnProperty('source_db')) {
              //     arr.push({[collection.old_id]: collection.source_db});
              //   }
              //   return arr
              // }, []).reduce((arr, el) => {
              //   arr.push(el[Object.keys(el)[0]]);
              //   return arr;
              // }, []) : []
            
            console.log(listCollection, 'Имена коллекций в базе')
 
            let flagSuccess = false
// 1-stage: get notes from move_journals
            let moveJournalsData = await getDocuments('move_journals', conn)
            console.log(moveJournalsData[0], 'журнал - 1ый элемент')
//2-stage: DB backup if !move_journals
//             if (!moveJournalsData.length) {
//               await createBackup(pathDestinationFirst)
//             }
//3-stage //
// //4-stage: получение документов из всех коллекций
            let listDocuments = []
            for (let collection of listCollection) {
              let nameCollection = collection[Object.keys(collection)[0]]
              if (nameCollection && (nameCollection !== 'move_journals' || 'metas')) {
                listDocuments.push(...await getDocuments(nameCollection, conn))
              }
            }
            //проверка на необходимость конвертации
            console.log(await convertedError(moveJournalsData, listDocuments), 'Проверка необходимости конвертации (да/нет)')
            if (!await convertedError(moveJournalsData, listDocuments)) {
              console.log('no errors and not need convert')
              resolve({
                errMsg: "База уже конвертирована без ошибок и не требует повторной конвертации",
                statusConvert: 500
              })
            } else {
              const moveJournalsDataAgain = []
              const dataForConvertAgain = {
                moveJournalsDataAgain,
                dataFromConvertFile,
                conn,
                flagSuccess,
                resolve,
                pathDestinationEnd,
                listCollection
              }
              //если конвертация проводилась ранее при потере соединения во время конвертации
              if ( (moveJournalsData.length && (moveJournalsData.length !== listDocuments.length)) || (moveJournalsData.length && moveJournalsData.length && listDocuments && !listDocuments.length)) {
                console.log('Ранее некорректное конвертирование')
                await conn.db.collection('metas').drop()
                await conn.db.collection('move_journals').drop()
                await convertData(dataForConvertAgain)
                // await renameAndCopyCollection(collectionsDataFromConvertFileCollections, conn)
              } else {
                //первичная конвертация или проверка и исправление ошибок возникших при конвертации ранее
                //5-stage: check notes and convert
                const dataForConvert = {
                  moveJournalsData,
                  dataFromConvertFile,
                  conn,
                  flagSuccess,
                  resolve,
                  reject,
                  pathDestinationEnd,
                  listCollection
                }
                console.log('Процесс начался')
                console.log(global.collectionsDataFromConvertFileCollections, 'global.collectionsDataFromConvertFileCollections')
                await convertData(dataForConvert, global.collectionsDataFromConvertFileCollections)
              }
            }
            reject({errMsg: 'Ошибка конвертации', status: false})
          })
        })
      } else {
        return {errMsg: 'Модуль VIAR активен! Закройте, пожалуйста, модуль и попробуйте снова', statusConvert: 500}
      }
      
    })
    
  } catch (e) {
    return {errMsg: e.message, statusConvert: 500}
  }
}