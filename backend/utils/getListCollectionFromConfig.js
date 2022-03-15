const fs = require('fs')
const path = require('path')
const isPkg = process.hasOwnProperty('pkg')
const pkgPath = path.join(process.execPath, '..')
const notPkgPath = path.join(__dirname, '..', '..', '..')
const pathModels = path.join(isPkg ? pkgPath : notPkgPath)
const pathToConfigFiles = path.join(pathModels, 'config', 'models')

//polyfill for replaceAll because node 10 is not supported it
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(str, newStr){
    
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr);
    }
    
    // If a string
    return this.replace(new RegExp(str, 'g'), newStr);
    
  };
}

module.exports = async function getListCollectionFromConfig(flag){
  try {
    const result = []
    const modResult = []
    const fileNames = fs.readdirSync(pathToConfigFiles)
    fileNames.forEach(file => {
      const isFile = file.split('.')
      if (isFile[1] === 'json') {
        const finishResult = flag ? isFile[0] : isFile[0].replaceAll(new RegExp(/[^ a-zа-яё\d]+/gm), '')
        // console.log(finishResult)
        modResult.push(finishResult)
        result.push(isFile[0])
      }
    });
    console.log(modResult)
    //    /(?i)[^А-ЯЁA-Z0-9]/gm
    // const modifiedResult = result.replace("/(?i)[^А-ЯЁA-Z0-9]/gm", '')
    // console.log(modifiedResult, 'REEEEEGGGGGEXPPPPP')
    // console.log(result)
    return result
    // result.replaceAll(/(?i)[^А-ЯЁA-Z0-9]/gm, '')
    // new RegExp.replace(result, "(?i)[^А-ЯЁA-Z0-9]", "")
  }
  catch (e) {
    console.log(e)
    throw {
      errMsg: "Конфигурационный файл или коллекции для конвертации не обнаружены. Убедитесь что конвертер запущен из корня папки модуля.",
      statusConvert: 500
    }
  }
}