const startConv = require("../draftConverter");

module.exports = async function converting(req, res) {
  try {
    console.log('Контролллер на конвертацию')
    const cards = await startConv()
    res.status(200).json(cards)
  } catch
    (e) {
    res.status(500).json({e})
  }
}


