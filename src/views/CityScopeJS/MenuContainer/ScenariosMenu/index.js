import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  Button,
  List,
  Dialog,
  IconButton,
  Tooltip,
  Badge,
  TextField,
} from "@mui/material";
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import DeleteIcon from "@mui/icons-material/Delete";
import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import useWebSocket from "react-use-websocket"

export default function ScenariosMenu() {
  const [scenariosButtonsList, setScenariosButtonsList] = useState([]);
  const [scenariosBinButtonsList, setScenariosBinButtonsList] = useState([]);
  const [scenarioToRestore, setScenariosToRestore] = useState();
  const [saveDialogState, setSaveDialogState] = useState(false);
  const [loadDialogState, setLoadDialogState] = useState(false);
  const [binDialogState, setBinDialogState] = useState(false);
  const [scenarioTextInput, setScenarioTextInput] = useState({
    name: "",
    description: "",
  });
  // get cityIO data from redux store
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);

  const WS_URL = "ws://localhost:8080/interface"
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true,
    },
  )

  const handleSaveThisState = () => {
    handleClose();
      const newScenario = {
        // ! to be updated from dynamic ui element
        name: scenarioTextInput.name || `noname`,
        description:
          scenarioTextInput.description || `no description yet.`,
      }
      sendJsonMessage({
        type: "SAVE_SCENARIO",
        content: newScenario,
      })


  };

  const handleClose = () => {
    setLoadDialogState(false);
    setSaveDialogState(false);
    setBinDialogState(false);
  };

  const handleOpenDialog = (scenario) => {
    // store to state the scenario to be restored
    setScenariosToRestore(scenario);
    // open dialog
    setLoadDialogState(true);
  };

  const handleRestoreThisState = async () => {
    if (!scenarioToRestore) return;
    sendJsonMessage({
      type: "RESTORE_SCENARIO",
      content: {name: scenarioToRestore.name},
    })
    handleClose();  
  };

  const handleDeleteThisState = (scenario) => {
    // copy the scenarios array
    const tempArr = [...cityIOdata.scenarios];
    // find the clicked scenario in the array
    var scnToDelete = tempArr.filter((obj) => {
      return obj.hash === scenario.hash;
    });
    // find the index of the scenario to delete
    var index = tempArr.indexOf(scnToDelete[0]);
    if (index !== -1) {
      // remove the scenario from the array
      let scenarioToMod = tempArr[index]
      sendJsonMessage({
        type: "MODIFY_SCENARIO",
        content: {name: scenarioToMod.name, isInBin:true},
      })
    }
    handleClose()
  };

  const handleRestoreSce = (scenario) => {
    // copy the scenarios array
    const tempArr = [...cityIOdata.scenarios];
    // find the clicked scenario in the array
    var scnToDelete = tempArr.filter((obj) => {
      return obj.hash === scenario.hash;
    });
    // find the index of the scenario to delete
    var index = tempArr.indexOf(scnToDelete[0]);
    if (index !== -1) {
      // remove the scenario from the array
      let scenarioToMod = tempArr[index]
      sendJsonMessage({
        type: "MODIFY_SCENARIO",
        content: {name: scenarioToMod.name, isInBin:false},
      })
    }
    handleClose()
  };

  const createScenariosButtons = () => {
    const scenariosButtons = cityIOdata.scenarios.filter(x => !x.isInBin).map((scenario, i) => {
      return (
        <ListItem key={`scenario_grid_item_${i}`}>
          <Tooltip
            sx={{ width: "100%" }}
            key={"scenario_tt_" + i}
            arrow
            placement="right"
            title={scenario.description || `No description`}
          >
            <Button
              fullWidth={true}
              key={"scenario_button_" + i}
              sx={{ width: "100%" }}
              size="small"
              variant="outlined"
              onClick={() => handleOpenDialog(scenario)}
            >
              <List>
                <ListItem>
                  <Typography>
                    {scenario.name.substring(0, 15) + `...`}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="caption">
                    {scenario.description.substring(0, 20) + `...`}
                  </Typography>
                </ListItem>
              </List>
            </Button>
          </Tooltip>

          <IconButton
            key={"scenario_ib_" + i}
            onClick={(e) => {
              handleDeleteThisState(scenario);
            }}
            aria-label="delete"
            size="medium"
          >
            <DeleteIcon
              color="primary"
              key={"scenario_delicon_" + i}
              fontSize="inherit"
            />
          </IconButton>
        </ListItem>
      );
    });
    return scenariosButtons;
  };

  const createBinScenariosButtons = () => {
    const scenariosButtons = cityIOdata.scenarios.filter(x => x.isInBin).map((scenario, i) => {
      return (
        <ListItem key={`scenario_grid_item_${i}`}>
          <Tooltip
            sx={{ width: "100%" }}
            key={"scenario_tt_" + i}
            arrow
            placement="right"
            title={scenario.description || `No description`}
          >
            <Button
              fullWidth={true}
              key={"scenario_button_" + i}
              sx={{ width: "100%" }}
              size="small"
              variant="outlined"
              
            >
              <List>
                <ListItem>
                  <Typography>
                    {scenario.name.substring(0, 15) + `...`}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="caption">
                    {scenario.description.substring(0, 20) + `...`}
                  </Typography>
                </ListItem>
              </List>
            </Button>
          </Tooltip>

          <IconButton
            key={"scenario_ib_" + i}
            onClick={(e) => {
              handleRestoreSce(scenario);
            }}
            aria-label="delete"
            size="large"
          >
            <RestorePageOutlinedIcon
              color="primary"
              key={"scenario_resticon_" + i}
              fontSize="inherit"
            />
          </IconButton>
        </ListItem>
      );
    });
    return scenariosButtons;
  };

  useEffect(() => {
    // check if there are any scenarios in the cityIOdata
    if (!cityIOdata.scenarios) return;
    const scenariosButtons = createScenariosButtons();
    setScenariosButtonsList(scenariosButtons);
    const scenariosBinButtons = createBinScenariosButtons();
    setScenariosBinButtonsList(scenariosBinButtons);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata]);

  return (
    <>
      <Badge
        sx={{ width: "100%" }}
        badgeContent={
          (cityIOdata.scenarios && cityIOdata.scenarios.length) || 0
        }
        color="primary"
      >
        <Button
          fullWidth={true}
          key={"save_state_button"}
          variant="outlined"
          onClick={() => setSaveDialogState(true)}
        >
          <Typography>Save This Scenario</Typography>
        </Button>
        <Button onClick={() => setBinDialogState(true)}><DeleteSweepOutlinedIcon></DeleteSweepOutlinedIcon></Button>
      </Badge>

      <List>{scenariosButtonsList}</List>

      <Dialog open={saveDialogState} onClose={handleClose}>
        <DialogTitle id="save-dialog-title">{"Save this Scenario"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Give your scenario a name and a description to help you remember
            what it is about.
          </DialogContentText>
          <List>
            <ListItem>
              <TextField
                id="name-basic"
                label="Scenario Name"
                variant="outlined"
                fullWidth
                onChange={(e) =>
                  setScenarioTextInput({
                    ...scenarioTextInput,
                    name: e.target.value,
                  })
                }
              />
            </ListItem>
            <ListItem>
              <TextField
                id="desc-basic"
                label="Description (optional)"
                fullWidth
                variant="outlined"
                onChange={(e) =>
                  setScenarioTextInput({
                    ...scenarioTextInput,
                    description: e.target.value,
                  })
                }
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveThisState} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={loadDialogState} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {"Revert to saved scenario?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can revert to this saved scenario by clicking the button below.
            Reverting will delete all changes made since the last commit.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRestoreThisState} autoFocus>
            Revert
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={binDialogState} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {"Bin"}
        </DialogTitle>
        <DialogContentText id="alert-dialog-description" sx={{padding: 2}}>
            The scenarios in the bin will be permanently deleted after 15 days.
          </DialogContentText>
        <DialogContent>
          <List>{scenariosBinButtonsList}</List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
