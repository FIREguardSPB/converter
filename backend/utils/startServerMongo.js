const path = require('path')

const isPkg = process.hasOwnProperty('pkg')
const pkgPath = path.join(process.execPath, '..')
const notPkgPath = path.join(__dirname, '..', '..', '..')
const filePath = path.join(isPkg ? pkgPath : notPkgPath, 'dist', 'mongodb', 'bin', 'mongod.exe')
const pathToDb = path.join(isPkg ? pkgPath : notPkgPath, 'data', 'mongodb')
const fileReader = require('./fileReader.js')
const {execFile} = require('child_process');
const rootPath = path.join(isPkg ? pkgPath : notPkgPath)

module.exports = async function startServerMongo() {
    const dataFromEnv = await fileReader()
    const pathToDBMongoFromEnv = dataFromEnv ? dataFromEnv.split('\n').find(el => el.includes('DATABASE_DATA_PATH')).split('=')[1].trim() : false
    const checkedPathToDBMongo = pathToDBMongoFromEnv ? pathToDBMongoFromEnv.includes('.') ? path.join(rootPath, pathToDBMongoFromEnv) : pathToDBMongoFromEnv : false
    console.log('Путь к базе из .env ====>>>> ', pathToDBMongoFromEnv)
    const args = ["--port", "27016", "--bind_ip", "127.0.0.1", "--dbpath", `${pathToDBMongoFromEnv ? checkedPathToDBMongo : pathToDb}`]
    return await new Promise((resolve, reject) => {
        const startServer = execFile(filePath, args, {
            cwd: process.cwd(),
            encoding: 'utf8',
            node: '--unhandled-rejections=strict'
        })
        if (!startServer.pid) {
            console.log('Ошибка запуска сервера')
            reject(false)
        } else {
            resolve(startServer)
        }
    });
}
