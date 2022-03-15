const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./route/apiRoutes.js');
const path = require('path');
const dotEnv = require("dotenv");
// const cors = require("cors");

dotEnv.config()
const app = express();
const PORT = process.env.PORT || 5000
// app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}))
// const process.execPath = path.resolve();
app.use(express.static(path.join(__dirname, 'build')))
app.use('/api', apiRouter)
const isPkg = process.hasOwnProperty('pkg')

const exec = require('child_process');

const host = 'http://localhost';
// const html = `file://build/index.html`;
const target = `${host}:${PORT}`;
const pathDest = isPkg ? path.join(process.execPath, '..') : path.join(__dirname, '..', '..')
// const notPkgPath = path.join(__dirname, '..', '..'
const filePath = path.join(pathDest, 'dist', 'chromium-gost-77.0.3865.90', 'chrome.exe')
const htmlFile = path.join(__dirname, '..', 'build', 'index.html')
// const pathToDb = path.join(pathDest, 'data', 'mongodb')
// const pathToLog = path.join('F:', 'other_module_folder', 'logs', 'mongo.log')
// const { spawn } = require('child_process');
// const args = [`--app=${html}?port=${PORT}&target=${target}`, "--start-maximized"]
function startAppView() {
  return new Promise((resolve) => {
    exec.execFile(filePath, [target, `--app=index.html?port=${PORT}&target=${target}`, "--start-maximized", "--disable-translate", "--incognito", "--disable-extensions", "--disable-plugins", "--disable-notifications"], {
      cwd: process.cwd(),
      encoding: 'utf8',
      node: '--unhandled-rejections=strict'
    }, (err) => {
      if (err) {
        console.log('Не найден chromium! Запуск должен производится из корневой папки модуля VIAR. Закройте данное окно и попробуйте запустить программу снова из корневой папки модуля.')
        resolve(new Error('Не найден chromium! Запуск должен производится из корневой папки модуля VIAR'));
      } else {
        resolve(true)
      }
    });
  })
}


async function startApp() {
  try {
    app.listen(PORT, () => {
      console.log(`server working on ${PORT} and current DIR =>> ${process.execPath}\n\nhttp://localhost:${PORT}/`);
    })
  } catch (e) {
    console.log(e)
  }
}

startApp()
startAppView()
// startAppView()
// module.exports = function pathDestGlobal(){return pathDest}
