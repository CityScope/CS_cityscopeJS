import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useSelector } from "react-redux";
import { useState } from 'react';
import useWebSocket from "react-use-websocket"

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CoreModuleSelector() {
  
    const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
    const [selectedModules, setSelectedModules] = useState([]);

    const WS_URL = "ws://localhost:8080/interface"
    const { sendJsonMessage } = useWebSocket(
      WS_URL,
      {
        share: true,
        shouldReconnect: () => true,
      },
    )
    
    let mod = []
    if (cityIOdata.core_modules){
      mod = [...cityIOdata.core_modules]
    }

    return (

    <>
    <Autocomplete
      multiple
      id="core-modules-selector"
      options={mod.sort((a, b) => -b.moduleType.localeCompare(a.moduleType))}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      groupBy={(option) => option.moduleType}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Module Selector" placeholder="Indicator..." />
      )}
      onChange={(event, newValue) => {

        //call modules
        let toRequest = newValue.filter(x => !selectedModules.includes(x));
        if(toRequest.length>0){
          sendJsonMessage({
            type: "REQUEST_MODULE",
            content: {modules: toRequest.map(module=>module.moduleId)},
          })  
        }

        //call modules
        let toRemove = selectedModules.filter(x => !newValue.includes(x));
        if(toRemove.length>0){
          sendJsonMessage({
            type: "REQUEST_MODULE_REMOVAL",
            content: {modules: toRemove.map(module=>module.moduleId)},
          })  
        }

        setSelectedModules(selected => newValue);
        console.log(selectedModules);
      }}
  />
  </>
  );
}
