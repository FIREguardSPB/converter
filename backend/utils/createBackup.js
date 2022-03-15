const {promises: fs} = require("fs")
const path = require("path")
const isPkg = process.hasOwnProperty('pkg')
const pkgPath = path.join(process.execPath, '..', '/data', '/mongodb')
const notPkgPath = path.join(__dirname, '..', '..', '..', '/data', '/mongodb')
const pathSource = isPkg ? pkgPath : notPkgPath
const copyDir = require('./copyDir.js')
module.exports = async function createBackup(pathDestination, flag) {
  console.log(pathSource, "=====>>> Папка базы данных")
  console.log(pathDestination, '====> Папка с бэкапами')
  try {
    if (flag)  if (flag) {
      return new Promise(async (resolve, reject) => {
        await fs.readdir(pathDestination, (err, content) => {
          if (err) resolve([])
          else {resolve(content)}
        })
      })
    }
    if (!flag) {
      await copyDir(pathSource, pathDestination)
    }
  } catch (e) {
    if (e.hasOwnProperty('message') && e.message.includes('resource busy or locked')) {
      console.log('some trouble')
    } else {
      console.log(e.message, '<<<======= ERROR MESSAGE')
    }
  }
}


