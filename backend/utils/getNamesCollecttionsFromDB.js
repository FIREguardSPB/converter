const mongoose = require("mongoose");
module.exports = async function getNamesCollectionsFromDB  (localDbConnect){
  const namesCollectionsFromDb = await new Promise((resolve, reject) => {
    try {
      const conn = mongoose.createConnection(localDbConnect, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }, (err) => {
        if (err) {
          resolve('off')
        }
      })
      conn.on('open', async function () {
        const namesCollections = await new Promise((resolve, reject) => {
          conn.db.listCollections().toArray(function (err, names) {
            resolve(names)
          })
        })
        resolve(namesCollections.reduce((arr, collection) => {
          arr.push(collection.name);
          return arr
        }, []))
        reject(new Error('Нет соединения с базой'))
      })
    } catch (e) {
      throw {errMsg: "ошибка соединения", 'statusConvert': 500}
    }
  })
}