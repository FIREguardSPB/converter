import React, {useState} from 'react';
import {Content, StartButton} from "../UIcomponents";
import {startConvertHandler} from "../../Handlers/startConvertHandler";

const ModelCard = ({data, state}) => {
  const {countItemsForSave} = data
  const [visibleButton, setVisibleButton] = useState(true)
  const {resultFetch, statusConvert} = state
  const styleContent = {"text-align": "center", "color": "red", "margin-top": "50px"}
  const infoContent = () => <Content style={styleContent}>
    {visibleButton && countItemsForSave ? <>Подготовлено к конвертации <b>{countItemsForSave}</b> записей. <br/>
      Указанное количество записей - это абсолютно все найденные записи в базе, в том числе, считающиеся удаленными.
    </> : null}
    {!countItemsForSave ? <>В базе не найдено ни одной записи</> : null}
    {!statusConvert ? null : <b style={{'color': "green"}}>Конвертация успешно завершена. Количество конвертированных
      записей: {countItemsForSave}</b>}
  </Content>
  
  const convertButton = () => visibleButton ?
    <StartButton style={{"margin-top": "40px", 'color': 'white'}} onClick={(e) => {
      e.preventDefault();
      startConvertHandler(state).then(() => console.log('Обработчик кнопки отработал'))
      setVisibleButton(false)
    }}>
      Выполнить конвертацию
    </StartButton> : null
  return (<>
    {infoContent()}
    {!countItemsForSave ? null : convertButton()}
  </>);
};

export default ModelCard;