// const {promises: fs} = require("fs");
const fs = require("fs");
const path = require("path");
module.exports = async function copyDir(pathSource, pathDestination) {
  await fs.mkdir(pathDestination, {recursive: true}, (err) => {
    if (err) {
      console.log(err)
    }
  });
  let entries = await new Promise(async (resolve, reject) => {
    await fs.readdir(pathSource, {withFileTypes: true}, (err, result) => {
      if (err) {
        reject(err)
      }
      if (result) {
        resolve(result)
      }
    });
  })
  await Promise.all(entries.map(async (entry) => {
    let srcPath = path.join(pathSource, entry.name);
    let destPath = path.join(pathDestination, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      try {
        await new Promise(async (resolve, reject) => {
          await fs.copyFile(srcPath, destPath, (err, result) => {
            if (err) reject(new Error('Проблема при копировании файла бэкапа - не критично для конвертации'))
            else {
              resolve(result)
            }
          })
        })
      } catch (e) {
        if (e.hasOwnProperty('message') && e.message.includes('resource busy or locked')) {
          console.log('some trouble')
        } else {
          console.log(e.message, '<<<======= ERROR MESSAGE')
        }
      }
    }
    
  }))
  // for (let entry of entries) {
  //   let srcPath = path.join(pathSource, entry.name);
  //   let destPath = path.join(pathDestination, entry.name);
  //   if (entry.isDirectory()) {
  //     await copyDir(srcPath, destPath)
  //   } else {
  //     try {
  //       return await new Promise(async (resolve, reject) => {
  //         await fs.copyFile(srcPath, destPath, (err, result) => {
  //           if (err) reject(new Error('Проблема при копировании'))
  //           else {
  //             resolve(result)
  //           }
  //         })
  //       })
  //     } catch (e) {
  //       if (e.hasOwnProperty('message') && e.message.includes('resource busy or locked')) {
  //         console.log('some trouble')
  //       } else {
  //         console.log(e.message, '<<<======= ERROR MESSAGE')
  //       }
  //     }
  //   }
  // }
}