module.exports = async function getDocumentsFromDB(listCollections, conn) {
  return await new Promise((resolve, reject) => {
    try {
      conn.on('open', async function () {
        const resultDocuments = await Promise.all(listCollections.map(async (collection) => {
          const oldId = [Object.keys(collection)[0]][0]
          const nameCollection = collection[oldId]
          if (nameCollection !== 'move_journals' || 'metas') {
            return await new Promise((resolve, reject) => {
              conn.db.collection(nameCollection).find()
                .toArray((err, result) => {
                result.forEach((el) => {el.src_collection = nameCollection})
                resolve({[oldId]: result})
              })
            })
          }
        }))
        resolve(resultDocuments)
        reject(new Error('Нет соединения с базой'))
      })
    } catch (e) {
      throw {errMsg: "ошибка соединения", 'statusConvert': 500}
    }
  })
}