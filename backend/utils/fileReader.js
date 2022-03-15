const path = require('path')
const fs = require('fs')
const isPkg = process.hasOwnProperty('pkg')
const pkgPath = path.join(process.execPath, '..')
const notPkgPath = path.join(__dirname, '..', '..', '..')
const rootPath = path.join(isPkg ? pkgPath : notPkgPath)

module.exports = async function fileReader(fileName) {
  return await new Promise((resolve, reject) => {
    console.log(path.join(rootPath, fileName ? fileName : '.env'))
    fs.readFile(path.join(rootPath, fileName ? fileName : '.env'), 'utf-8',(err, result) => {
      if(err){
        resolve(false)
      }
      if (!err) {
        if (fileName === 'vr'){resolve(true)}
        resolve(result)
      }
    })
  })
}

// (async () => {
//  const res = (await fileReader()).split('\n').find(el => el.includes('DATABASE_DATA_PATH')).split('=')[1]
// console.log(res)
//
//
// })()

