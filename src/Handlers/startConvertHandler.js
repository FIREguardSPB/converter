import {getProcessConvert} from "../Utils/getProcessConvert";
import {startConvert} from "../Utils/startConvert";

export const startConvertHandler = async (states) => {
  try {
    console.log('КНОПКА СРАБОТАЛА!!!')
    const {
      setStatusConvert,
      setStartConvertStatus,
      setVisibleModal,
      setErrorMsg,
      setConvertProcess,
      prepareInfo,
      convertProcess,
      setLoaderUse,
      setResultFetch
    } = states
    setStatusConvert(false)
    setStartConvertStatus(false)
    setVisibleModal(false)
    setErrorMsg(null)
    await startConvert(setLoaderUse, setErrorMsg, setResultFetch, setVisibleModal, setStatusConvert, setStartConvertStatus)
    await getProcessConvert(setConvertProcess, prepareInfo?.countItemsForSave, convertProcess)
  }
  catch (e) {
    console.log(e)
  }
  
}