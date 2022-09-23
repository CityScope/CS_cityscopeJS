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
  Grid,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { postToCityIO, getModule, getTableID } from "../../../../utils/utils";

export default function ScenariosMenu() {
  const [scenariosButtonsList, setScenariosButtonsList] = useState([]);
  const [scenarioToRestore, setScenariosToRestore] = useState();
  const [saveDialogState, setSaveDialogState] = useState(false);
  const [loadDialogState, setLoadDialogState] = useState(false);
  const [scenarioTextInput, setScenarioTextInput] = useState({
    name: "",
    description: "",
  });
  // get cityIO data from redux store
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  // get cityio name from redux store
  const cityIOtableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  const handleSaveThisState = () => {
    handleClose();
    getTableID(cityIOtableName).then((id) => {
      const newScenario = {
        // ! to be updated from dynamic ui element
        name: scenarioTextInput.name || `${id}`,
        hash: id,
        description:
          scenarioTextInput.description || `no description for ${id} yet.`,
      };
      const tempArr = cityIOdata.scenarios ? [...cityIOdata.scenarios] : [];
      tempArr.push(newScenario);
      postToCityIO(tempArr, cityIOtableName, `/scenarios/`);
    });
  };

  const handleClose = () => {
    setLoadDialogState(false);
    setSaveDialogState(false);
  };

  const handleOpenDialog = (scenario) => {
    // store to state the scenario to be restored
    setScenariosToRestore(scenario);
    // open dialog
    setLoadDialogState(true);
  };

  const handleRestoreThisState = async () => {
    if (!scenarioToRestore) return;
    await getModule(scenarioToRestore.hash)
      .then((module) => {
        postToCityIO(module, cityIOtableName, `/GEOGRIDDATA/`);
      })
      .finally(() => {
        handleClose();
      });
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
      tempArr.splice(index, 1);
    }
    // post the new array to the server
    postToCityIO(tempArr, cityIOtableName, `/scenarios/`);
  };

  const createScenariosButtons = () => {
    const scenariosButtons = cityIOdata.scenarios.map((scenario, i) => {
      return (
        <ListItem key={`scenario_grid_item_${i}`}>
          <Tooltip
            key={"scenario_tt_" + i}
            arrow
            placement="right"
            title={scenario.description || `No description`}
          >
            <Button
              key={"scenario_button_" + i}
              fullWidth
              size="small"
              variant="outlined"
              onClick={() => handleOpenDialog(scenario)}
            >
              <List>
                <ListItem>
                  <Typography>
                    {scenario.name.substring(0, 12) + `...`}
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
            size="small"
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

  useEffect(() => {
    // check if there are any scenarios in the cityIOdata
    if (!cityIOdata.scenarios) return;
    const scenariosButtons = createScenariosButtons();
    setScenariosButtonsList(scenariosButtons);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata]);

  return (
    <Grid sx={{ flexGrow: 1 }} container>
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
    </Grid>
  );
}
