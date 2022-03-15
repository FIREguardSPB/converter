import './App.css';
import Loader from "react-loader-spinner";
import {useState, useEffect, useMemo} from "react";
import {getPrepareInfo} from "./Utils/getPrepareInfo"
import {
  Container,
  Href,
  InfoFooter,
  Footer,
  Content,
  HeaderText,
  LoaderWrapper,
  Header,
  Card
} from "./components/UIcomponents";
import ViewError from "./components/ViewError";
import ViewProcessInfo from "./components/ViewProcessInfo";
import {cancelHandler} from "./Handlers/cancelHandler";
import {startConvertHandler} from "./Handlers/startConvertHandler";
import ModelCard from "./components/ModelCard/ModelCard";


function App() {
  const [loaderUse, setLoaderUse] = useState(false)
  const [visibleModal, setVisibleModal] = useState(false)
  const [convertProcess, setConvertProcess] = useState(null)
  const [resultFetch, setResultFetch] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  const [prepareInfo, setPrepareInfo] = useState([])
  const [secondStage, setSecondStage] = useState(false)
  const [statusConvert, setStatusConvert] = useState(false)
  const [startConvertStatus, setStartConvertStatus] = useState(false)
  const [startStateListNamesByConfigs, setStartStateListNamesByConfigs] = useState(null)
  const loaderStyle = {"position": "fixed", 'margin-top': '140px', 'margin-left': '30px'}
  
  const states = {
    loaderUse,
    setLoaderUse,
    visibleModal,
    setVisibleModal,
    convertProcess,
    setConvertProcess,
    resultFetch,
    setResultFetch,
    errorMsg,
    setErrorMsg,
    prepareInfo,
    setPrepareInfo,
    statusConvert,
    setStatusConvert,
    startConvertStatus,
    setStartConvertStatus,
    secondStage,
    setSecondStage,
    startStateListNamesByConfigs,
    setStartStateListNamesByConfigs
  }
  console.log(errorMsg, '<< === Текст ошибки, если возникла')
  console.log(resultFetch)
  useEffect(() => {
      setLoaderUse(true)
      setVisibleModal(false)
      setErrorMsg(null)
      try {
        (async () => {
          setStatusConvert(false)
          setStartConvertStatus(false)
          await getPrepareInfo(setErrorMsg, setPrepareInfo, setLoaderUse, startStateListNamesByConfigs, setStartStateListNamesByConfigs)
        })()
      } catch (e) {
        setErrorMsg(e.message)
      }
    },
    [])
  // const onStart = async () => {
  //   await startConvertHandler(states)
  // }
  const onCancel = async () => {
    await cancelHandler(states)
  }
  console.log(statusConvert)
  console.log('PREPARE INFO', prepareInfo)
  return (
    <>
      <Container>
        <Header>
          <HeaderText>Конвертер базы</HeaderText></Header>
        <Content>
          <Card>
            {prepareInfo?.countItemsForSave ?
              <ModelCard data={prepareInfo} state={states} setPrepareInfo={setPrepareInfo}/> : null}
            {!statusConvert && startConvertStatus ?
              <ViewProcessInfo convertProcess={convertProcess} allQty={prepareInfo?.countItemsForSave}/> : null}
            {loaderUse ? <LoaderWrapper style={{"text-align": "center"}}>
              <p style={loaderStyle}>Подготовка... Сбор
                информации...</p>
              <Loader type="Puff"
                      color="#00BFFF"
                      height={300}
                      width={300}
              />
            </LoaderWrapper> : null
            }
            {errorMsg ? <ViewError errorMsg={errorMsg} onCancel={onCancel}/> : null}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </Card>
        </Content>
        <Footer>
          <InfoFooter>
            © 2009-2021
            <Href>
              <a href="https://viar-module.ru/" target="_blank">ВИАР ИТ</a>
            </Href>
          </InfoFooter>
        </Footer>
      </Container>
    </>
  );
}

export default App;
