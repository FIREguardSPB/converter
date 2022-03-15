export const createJsonFile = async (data) => {
  const dataSend = JSON.stringify({models : data})
  console.log(dataSend)
fetch('/api/createjson', {
  method: "POST",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: dataSend
})
  .then(result => {
    if (result.status === 500) {
      // setErrorMsg("Ошибка конвертации, проверьте соединение и запустите проверку еще раз");
      console.log('errror')
    } else {
      console.log(result.json())
    }
  })
}