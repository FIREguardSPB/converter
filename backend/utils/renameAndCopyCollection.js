module.exports = async function renameAndCopyCollection(data, conn) {
  return await new Promise(async (resolve, reject) => {
    const {collections} = data
    const resultRenaming = await Promise.all(collections.map(async (collection) => {
      // console.log(collection?.old_id, '=-=-==-=-=-==------------->>>> collection for rename')
      await new Promise(async (resolve, reject) => {
        const rename = await conn.db.collection(collection.old_id).find().forEach((d) => {
          d.name = d.name.toString()
          conn.db.collection(collection.new_id).insertOne(d, (err, result) => {
            // d.name = d.name.toString()
            if (err && err.message.includes('duplicate key error collection')) {
              console.log(`Запись с _id ${d._id} уже существует в коллекции "${collection.new_id}" и поэтому не может быть записана повторно`)
            } else {
              console.log(err)
            }
            if (result) {
              resolve(result)
            }
          });
        });
        resolve(rename)
      })
    }))
    resolve(resultRenaming)
  })
}