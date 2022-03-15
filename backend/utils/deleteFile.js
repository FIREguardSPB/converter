const path = require('path')
const fs = require('fs')
const isPkg = process.hasOwnProperty('pkg')
const pkgPath = path.join(process.execPath, '..')
const notPkgPath = path.join(__dirname, '..', '..', '..')
const rootPath = path.join(isPkg ? pkgPath : notPkgPath)

module.exports = async function fileReader() {
  return await new Promise(async (resolve, reject) => {
    fs.unlink(path.join(rootPath, 'vr'), (err, result) => {
      if (err) {
        resolve(err)
      } else resolve(result)
    })
  })
}