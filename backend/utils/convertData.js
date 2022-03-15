const checkAndConvert = require("./checkAndConvert.js");
const processStatus = require("./processStatus.js");
const createBackup = require("./createBackup.js");
const renameAndCopyCollection = require('./renameAndCopyCollection.js')
module.exports = async function convertData(data, collectionsDataFromConvertFileCollections) {
  let {
    moveJournalsData,
    dataFromConvertFile,
    conn,
    flagSuccess,
    resolve,
    pathDestinationEnd,
    listCollection,
    reject
  } = data
  try {
    const successConvert = await checkAndConvert(moveJournalsData, dataFromConvertFile, conn)
    console.log(successConvert, 'success converted')
    if (collectionsDataFromConvertFileCollections && collectionsDataFromConvertFileCollections.hasOwnProperty('collections')){
      const copyCollections = await renameAndCopyCollection(collectionsDataFromConvertFileCollections, conn)
      console.log(copyCollections, 'copyCollections')
    }
  
    if (successConvert) {
      flagSuccess = true
      console.log(flagSuccess, 'Статус конвертации - успешно')
      await processStatus('mongod', 'kill')
      await createBackup(pathDestinationEnd)
      resolve({successConvert, listCollection, dataFromConvertFile, statusConvert: 200})
    }
  } catch (e) {
    console.log(e)
  }
}