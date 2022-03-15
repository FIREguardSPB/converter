const timeInfo = require('../utils/timeInfo')
// const path = require("path")
module.exports = async function checkAndConvert(moveJournalsData, listDocuments, conn) {
  let flagSuccess = false
  try {
    if (moveJournalsData.length) {
      let count = 0
      let startTime = new Date()
      for (let moveJournalItem of moveJournalsData) {
        count++
        timeInfo(startTime, count, moveJournalsData.length)
        for (let src_rec of listDocuments) {
          if (moveJournalItem.move_obj_id.toString() === src_rec.id_prev.toString()) {
            if (!moveJournalItem.move_finished) {
              const deletedItem = await conn.db.collection('metas').deleteOne({id_prev: src_rec.id_prev})
              console.log('delete')
              if (deletedItem) {
                const savedItem = await conn.db.collection('metas').save(src_rec)
                if (savedItem) {
                  if (count === moveJournalsData.length) {
                    flagSuccess = true
                  }
                  await conn.db.collection('move_journals').updateOne({
                    move_obj_id: src_rec.id_prev,
                    src_collection: src_rec.src_collection
                  }, {
                    $set: {
                      move_obj_id: src_rec.id_prev,
                      src_collection: src_rec.src_collection,
                      move_finished: true
                    }
                  })
                  console.log('UPDATE')
                } else {
                  await conn.db.collection('move_journals').updateOne({
                    move_obj_id: src_rec.id_prev,
                    src_collection: src_rec.src_collection
                  }, {
                    $set: {
                      move_obj_id: src_rec.id_prev,
                      src_collection: src_rec.src_collection,
                      move_finished: false
                    }
                  })
                  console.log('DOCUMENT NOT UPDATED')
                }
              }
            }
          }
        }
      }
    }
    if (!moveJournalsData.length) {
      let count = 0
      for (let document of listDocuments) {
        count++
        const firstSavedItem = await conn.db.collection('metas').save(document)
        if (firstSavedItem) {
          if (count === listDocuments.length) {
            flagSuccess = true
          }
          await conn.db.collection('move_journals').save({
            move_obj_id: document.id_prev,
            src_collection: document.src_collection,
            move_startedAt: new Date().toLocaleString(),
            move_finished: true
          })
        } else {
          await conn.db.collection('move_journals').save({
            move_obj_id: document.id_prev,
            src_collection: document.src_collection,
            move_startedAt: new Date().toLocaleString(),
            move_finished: false
          })
        }
      }
    }
  } catch (e) {
    return false
  }
  if (flagSuccess) {
    return true
  } else {
    return false
  }
}