//добавление поля fields с данными для корректного исходного отображения

export const checkerExistFields = (data, setStateData) => {
  const copyData = Object.assign({}, data)
  const {models, newModels, oldModels} = copyData
  let flag = false;
  console.log(models)
  models?.forEach(model => {
    if (!model.hasOwnProperty('fields')) {
      flag = true
      const resultModel = oldModels.find(oldModel => oldModel?.name === model?.old_name ? oldModel : null)
      resultModel?.fields?.sort().forEach((field) => {
        field.old_id = field.id;
        field.old_name = field.name;
        delete field.id;
        delete field.name;
        field.new_id = 'none';
        field.new_name = 'none';
        field.matched = 'none'
      })
      model.new_id = 'none'
      model.new_name = 'none'
      model.fields = resultModel.fields
    }
  })
  console.log(copyData)
  if (flag) {
    setStateData(copyData)
  }
}