const {faker} = require('@faker-js/faker');
const mongoose = require("mongoose");
const startServerMongo = require('./startServerMongo')
const randomName = faker.name.findName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
const randomCard = faker.helpers.createCard();
const localDbConnect = 'mongodb://localhost:27016/va-catalog'
const conn = mongoose.createConnection(localDbConnect, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}, (err, connect) => {
  if (connect.on) {
    console.log('connect to DB OK')
  }
})

const organization = faker.company.companyName()

const dataForSeeed = {
  // organization,
  // judicialPlot: 'ObjectID',
  volume : Math.random(),
  indx : Math.random(),
  defendant : faker.name.findName(),
  dismissals_date : faker.date.past(3, "2020"),
  name : faker.commerce.productName(),
  date :faker.date.past(),
  number_document : Math.random(),
  note : null,
  pagesNumbers : Math.random(),
  pagesCount : Math.random(),
  attachments: {
    name: "%date | year%", bucket: "administrative-cases"
  }
}
const arrData = () => {
  const result = []
  for (let i = 0; i <= 20000; i++) {
    result.push({
      // organization,
      // judicialPlot: 'ObjectID',
      volume : Math.random(),
      indx : Math.random(),
      defendant : faker.name.findName(),
      dismissals_date : faker.date.past(3, "2020"),
      name : faker.commerce.productName(),
      date :faker.date.past(),
      number_document : Math.random(),
      note : null,
      pagesNumbers : Math.random(),
      pagesCount : Math.random(),
      attachments: {
        name: "%date | year%", bucket: "administrative-cases"
      }
    })
  }
  return result
}
const seeder = async () => {
  await startServerMongo()
  return new Promise((resolve) => {
    conn.on('open', async function (err, result) {
      if (err) {
        console.log("ошибка соединения", err.message)
        throw {errMsg: `"ошибка соединения" ${err.message}`, 'statusConvert': 500}
      }
      const resultSeeders = await Promise.all(
        arrData().map(async (el) => {
          await conn.db.collection('administrativecases').save(el)
        })
      )
      console.log(resultSeeders)
      if (resultSeeders)
      {resolve(resultSeeders)}
    })
  })
}
seeder().then(() => console.log('OK'))
// console.log(arrData())