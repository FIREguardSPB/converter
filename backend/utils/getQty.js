const mongoose = require('mongoose')
const localDbConnect = 'mongodb://localhost:27016/va-catalog'
const startServerMongo = require('../utils/startServerMongo')
const processStatus = require("../utils/processStatus");
// const conn = mongoose.createConnection(localDbConnect, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true
// }, (err) => {
//   if (err) {
//     throw new Error(err)
//   }
// })
module.exports = async function getQty (nameCollection){
  console.log('qty foo work start')
  try {
    const onActiveMongo = await processStatus('mongod')
    // // await startServerMongo()
    if (!onActiveMongo) {
      const serverMongo = await startServerMongo()
	    if(serverMongo){
		    return await new Promise(async (resolve, reject) => {
			    try {
				    const conn = mongoose.createConnection(localDbConnect, {
					    useUnifiedTopology: true,
					    useNewUrlParser: true
				    }, (err) => {
					    if (err) {
						    throw new Error(err)
					    }
				    })
				    conn.on('open', async function () {
					    const count = await new Promise(async (resolve, reject) => {const res = await conn.db.collection('metas').countDocuments()
							resolve(res)
							})
					    resolve(count)
					    reject(new Error('Нет соединения с базой'))
				    })
				    // conn.close()
			    } catch (e) {
				    throw {errMsg: "ошибка соединения", 'statusConvert': 500}
			    }
		    })
				
				
	    }
    }
    if (onActiveMongo){
      return await new Promise((resolve, reject) => {
        try {
	        const conn = mongoose.createConnection(localDbConnect, {
		        useUnifiedTopology: true,
		        useNewUrlParser: true
	        }, (err) => {
		        if (err) {
			        throw new Error(err)
		        }
	        })
          conn.on('open', async function () {
            const count = await conn.db.collection('metas').countDocuments()
            console.log(count)
            resolve(count)
            reject(new Error('Нет соединения с базой'))
          })
          // conn.close()
        } catch (e) {
          throw {errMsg: "ошибка соединения", 'statusConvert': 500}
        }
      })
  }
  }
  catch (e) {
    console.log(e.message || e.errMsg)
    // return e.message
  }
}
