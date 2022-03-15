const ps = require('current-processes');
const terminate = require('terminate')
module.exports = async function processStatus(nameProcess, action) {
  try {
    if (action === 'kill') {
      return new Promise(async (resolve, reject) => {
        ps.get(async function (err, processes) {
          
          if (err) {
            reject(err.message)
          } else {
            const targets = []
            for (let process of processes) {
              if (process.name === `${nameProcess}`)
                targets.push(process.pid)
            }
            console.log(targets)
            for (const process of targets) {
              console.log('Убиваем процесс', process);
              // kill(process)
             await terminate(process, function (err) {
                if (err) { // you will get an error if you did not supply a valid process.pid
                  console.log("Oopsy: " + err); // handle errors in your preferred way.
                }
                else {
                  console.log('процесс убит'); // terminating the Processes succeeded.
                }
              });
            }
          }
          const checker = await new Promise((resolve, reject) => {
              ps.get(async function (err, processes) {
                const findResult = await processes.find((el) => el.name === `${nameProcess}`)
                if (err) {
                  reject(err.message)}
                if (findResult) {
                  resolve(true)
                } else {
                  
                  resolve(false)
                  console.log(findResult, '========> none active process')
                }
              })
            }
          );
          return checker
        });
        resolve(true)
      })
    } else {
      const resFind = await new Promise((resolve, reject) => {
          ps.get(async function (err, processes) {
            const findResult = await processes.find((el) => el.name === `${nameProcess}`)
            if (err) {
              reject(err.message)}
            if (findResult) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        }
      )
      console.log(resFind)
      return resFind
    }
  } catch (e) {
    console.log(e.message)
  }
}