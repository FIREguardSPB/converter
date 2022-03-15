// const getListCollection = require('../utils/getListCollectionFromConfig')
const processStatus = require('../utils/processStatus')
const startServerMongo = require('../utils/startServerMongo')
// const getDocuments = require('../utils/getDocuments')
// const getRusNameCollections = require('../utils/readFile')
const getDataFromJsonFile = require('../utils/readFile')
const mongoose = require('mongoose')
const localDbConnect = 'mongodb://localhost:27016/va-catalog'
// const cutterSymbols = require('./cutterSymbols.js')
// const path = require("path");
// const isPkg = process.hasOwnProperty('pkg')
// const pkgPath = path.join(process.execPath, '..')
// const notPkgPath = path.join(__dirname, '..', '..', '..')
// const pathModels = path.join(isPkg ? pkgPath : notPkgPath)
// const pathToConfigFiles = path.join(pathModels, 'config', 'models')
// const pathToNewConfigFiles = path.join(pathModels, 'newconfig', 'models')
// const pathToCollectionsFiles = path.join(pathModels, 'config', 'collections')
// const pathToNewCollectionsFiles = path.join(pathModels, 'newconfig', 'collections')
// const getDataFromFileData = require('./getDataFromFileModelsData')
const createJsonFile = require('./createJsonFile')
// const prepareDataForJson = require('./prepareDataForJson')
// const checkMatchNameCollectionFromCollectionTable = require('./checkMatchNameCollectionFromCollectionTable')
// const dataComparison = require('./dataComparison')
// const getDocsFromCollection = require('../service/getDocsFromCollection')
const getDocumentsFromDB = require('./getDocumentsFromDB')
const modifyDataForSaveToDB = require('./modifyDataForSaveToDB')
const fileReader = require("./fileReader");
const deleteFile = require("./deleteFile.js")

module.exports = async function getPrepareInfo(list) {
  try {
    const dataFromConvertFile = await getDataFromJsonFile('', 'convert')
    //получаем данные по коллекциям из файла
    console.log(dataFromConvertFile, '=-=-=-=-=-')
    const collectionsExistCheck = await getDataFromJsonFile('', 'collections_convert')
    const collectionsDataFromConvertFileCollections = !collectionsExistCheck || !collectionsExistCheck.hasOwnProperty('collections') ? [] : collectionsExistCheck
    console.log(collectionsDataFromConvertFileCollections, 'collectionsDataFromConvertFileCollections')
    //получаем список имен коллекций в базе из которых нужно получить данные
    // const listCollectionsFromConfig = list ? list : await getListCollection(pathToConfigFiles)
    // const listCollectionsFromNewConfig = await getListCollection(pathToNewConfigFiles)
    // // //получение списка имен МОДЕЛЕЙ старых и новых
    // // const listNameFileOldModels = await getListCollection(pathToConfigFiles, 1)
    // // const listNameFileNewModels = await getListCollection(pathToNewConfigFiles, 1)
    //
    // //получение списка имен КОЛЛЕКЦИЙ старых и новых
    // // const listNameFileOldCollections = await getListCollection(pathToCollectionsFiles, 1)
    // const listNameFileNewCollections = await getListCollection(pathToNewCollectionsFiles, 1)
    
    
    // console.log(listCollectionsFromConfig, listCollectionsFromNewConfig, list, notPkgPath, pkgPath, listNameFileNewCollections, 'СПИСОК КОЛЛЕКЦИЙ, ПОЛУЧЕННЫХ ИЗ КОНФИГ ФАЙЛОВ')
    if (!dataFromConvertFile || !dataFromConvertFile.hasOwnProperty('models')) {
      throw {
        errMsg: "Данные для конвертации не обнаружены. Убедитесь что конвертер запущен из корня папки модуля.",
        statusConvert: 500
      }
    }
    // !collectionsDataFromConvertFileCollections || !collectionsDataFromConvertFileCollections.hasOwnProperty('collections') ? collectionsDataFromConvertFileCollections =
    //получаем данные из файла конвертации
    // const dataFromConvertFile = await getDataFromJsonFile('', 'convert')
    // //получаем данные по коллекциям из файла
    // console.log(dataFromConvertFile, '=-=-=-=-=-')
    // const collectionsDataFromConvertFileCollections = await getDataFromJsonFile('', 'collections_convert')
    // //получаем список имен коллекций в базе из которых нужно получить данные
    const listCollections = dataFromConvertFile.hasOwnProperty('models') ? dataFromConvertFile.models.reduce((arr, collection) => {
      if (collection.hasOwnProperty('source_db')) {
        arr.push({[collection.old_id]: collection.source_db});
      }
      return arr
    }, []) : []
  
    if (!listCollections.length) {
      throw {
        errMsg: "Не обнаружены имена коллекций для подключения к ним в базе.",
        statusConvert: 500
      }
    }
    
    console.log(listCollections, 'LIST COLLECTIONS FOR CONNECT TO DB')
    
    //Проверка статуса модуля - запущен или нет.
    const onActiveModule = await processStatus('VIAR_Module')
    const onActiveMongo = await processStatus('mongod')
    console.log(onActiveModule, 'Запущен ли модуль VIAR? false ot true')
    if (onActiveModule) {
      throw {errMsg: "Закройте модуль VIAR!", statusConvert: 500}
    }
    if (onActiveMongo) {
      throw {
        errMsg: `Закройте сервер mongo! Или просто нажмите кнопку "Отмена" (конвертер сам завершит работу сервера mongo) и повторите снова`,
        statusConvert: 500
      }
    }
    if (!onActiveModule) {
      //запуск сервера монго
      const pidServer = startServerMongo()
      console.log(pidServer.pid, 'Номер процесса, запущенного сервера')
      //соединение с базой
      if (pidServer) {
        console.log("Сервер монго запущен")
        const conn =
          // await new Promise( (resolve, reject) => {
         mongoose.createConnection(localDbConnect, {
            useUnifiedTopology: true,
            useNewUrlParser: true
          }, (err, connection) => {
            if (err) {
              throw (new Error('Проблема с подключением к базе'))
            }
            // else {
            //   console.log('connection to db ok')}
            })
           
          // })
        // })
        const checkNeedDropCollection = await fileReader('vr')
        if (checkNeedDropCollection) {
          console.log('Найдена метка для удаления коллекций "metas" и "move_journals"', checkNeedDropCollection)
          conn.on('open', async function (err, result) {
            if (err) {
              console.log("ошибка соединения", err.message)
              throw ({errMsg: `"ошибка соединения" ${err.message}`, 'statusConvert': 500})
            }
            await conn.db.collection('metas').drop((err, result) => {
              if (err) console.log('Коллекция metas не найдена')
            })
            await conn.db.collection('move_journals').drop((err, result) => {
              if (err) console.log('Коллекция move_journals не найдена')
            })
          })
          await deleteFile()
        }
        //список всех документов из базы
        const documentsFromDB = await getDocumentsFromDB(listCollections, conn)
        console.log('Получение документов из базы')
        if(documentsFromDB.length){
          console.log("Получены документы из базы")}
        const modifyData = modifyDataForSaveToDB(documentsFromDB, dataFromConvertFile)
        const dataForSaveToFile = []
        modifyData.forEach(el => dataForSaveToFile.push(...el[Object.keys(el)[0]]))
        global.dataForSaveToFile = dataForSaveToFile
        global.listCollections = listCollections
        global.collectionsDataFromConvertFileCollections = collectionsDataFromConvertFileCollections
        //подготовка данных для записи в соответствии со структурой полученной для конвертации ранее
        await createJsonFile(dataForSaveToFile, 'final_result')
        // conn.close()
        console.log('DATA GETTED')
        const killed = await processStatus('mongod', 'kill')
        console.log(killed, 'статус убитого процесса')
        const namesCollection = listCollections.reduce((arr, el) => {
          if (el) {
            arr.push(el[Object.keys(el)[0]])
          }
          return arr;
        }, [])
        const countItemsForSave = dataForSaveToFile.length
        return {countItemsForSave, namesCollection, collectionsDataFromConvertFileCollections}
      }
    } else {
      throw {
        errMsg: "Модуль или сервер активны! Для корректной работы конвертора модуль и сервер должны быть выключены.",
        statusConvert: 500
      }
    }
  } catch
    (e) {
    console.log(e)
    return {statusConvert: 500, errMsg: e.errMsg}
  }
}


