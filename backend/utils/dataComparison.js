module.exports = function dataComparison(oldData, newData) {
  const result = {models: []}
  oldData.models.forEach((oldModel) => {
    //сравнение моделей
    const modelsData = newData.models.find((newModel) => {
      if (oldModel.name.trim() === newModel.name.trim()) {
        return newModel
      }
    })
    if (
      modelsData
    ) {
      //сравнение полей в схожих моделях
      if (oldModel.hasOwnProperty('fields')) {
        const {fields: oldFields} = oldModel
        const {fields: newFields} = modelsData
        // delete oldModel.fields
        oldModel.fields = []
        oldFields.forEach((oldField) => {
          const fieldSData = newFields.find((newField) => {
            if (oldField.name.trim() === newField.name.trim()) {
              return newField
            }
          })
          if (fieldSData) {
            oldModel.fields.push({
              old_id: oldField.id,
              old_name: oldField.name,
              new_id: fieldSData.id,
              new_name: fieldSData.name,
              type: oldField.type,
              matched: true,
            })
          } else {
            oldModel.fields.push(
              {
                old_id: oldField.id,
                old_name: oldField.name,
                new_id: '',
                new_name: '',
                type: oldField.type,
                matched: false,
                fields: []
              }
            )
          }
        })
      }
      result.models.push({
        old_id: oldModel.id,
        old_name: oldModel.name,
        new_name: modelsData.name,
        new_id: modelsData.id,
        matched: true,
        fields: oldModel.fields
      })
    } else {
      result.models.push({old_id: oldModel.id, old_name: oldModel.name, matched: false})
    }
  })
  return result
}