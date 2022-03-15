module.exports = function modifyDataForSaveToDB(data, dataFromConvertFile) {
  for (let collection of data) {
    const oldId = Object.keys(collection)[0]
    const dataFromCollection = collection[oldId]
      //получаем структуру соответствующую полученным данным по моделям
    const structureFromConvertFile = dataFromConvertFile.hasOwnProperty('models') ? dataFromConvertFile.models.find((el) => el.old_id === oldId) : {}
      //проходим по каждому объекту коллекции
    dataFromCollection.forEach((itemOfCollection) => {
//Поля в объекте коллекции
      const el_fields = Object.keys(itemOfCollection)
        //проходим по полям
      el_fields.forEach((fieldName) => {
        if (fieldName === '_id'){
          delete Object.assign(itemOfCollection, {id_prev: itemOfCollection[fieldName]})[fieldName]
          // itemOfCollection.id_prev = itemOfCollection._id;
          // delete itemOfCollection._id
          
        }
        //проходим по каждой структуре
       structureFromConvertFile.fields.forEach((structureObj) => {
          //если в какой-то структуре найдено значение поля по которому сейчас осуществляется проход
          if (structureObj.old_id === fieldName) {
            //какое действе при совпадении - меняем имя ключа на новый соответствующий значению в структуре путем удаления старого ключа и созданием нового
              // Object.assign(itemOfCollection, {[structureObj.new_id]: itemOfCollection[fieldName]})[fieldName]}
            delete Object.assign(itemOfCollection, {[structureObj.new_id]: itemOfCollection[fieldName]})[fieldName]}
        })
      })
        //запись поля configId с соответствующим значением
      itemOfCollection.configId = structureFromConvertFile.new_id
    })
  }
  return data
}