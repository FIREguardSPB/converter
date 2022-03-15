const namingConverter = require('./namingConverter.js')
const getDocsFromCollection = require('../service/getDocsFromCollection.js')
const cutterSymbols = require('../utils/cutterSymbols.js')
//получение всех данных из коллекции с приведением к новой структуре
module.exports = async function getDocuments(name, conn) {
  try {
    console.log(name, 'имяколлекции')
    console.log('функция получения длокументов из коллекции')
        const result = await getDocsFromCollection(name, conn)
          if(result.length) {
            console.log(result[0], 'RESULT GET DOCUMENTS')
            return result
          }
          else {return []}
  }
  catch (e) {
    return e
  }
}