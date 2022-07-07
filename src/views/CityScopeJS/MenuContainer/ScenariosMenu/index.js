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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { postToCityIO, getModule, getTableID } from "../../../../utils/utils";

/** data structure for scenario list
[
  {
    name: "Scenario 1",
    hash: "dfglkadfgkjn435rtegf",
    description: "this is a description",
  },
  {
    name: "Scenario 2",
    hash: "dfglkadfgfjn435rtegf",
    description: "this is yet another a description",
  },
];
 */

export default function ScenariosMenu() {
  const [scenariosButtonsList, setScenariosButtonsList] = useState([]);
  const [dialogOpenState, setDialogOpenState] = useState(false);
  const [scenarioToRestore, setScenariosToRestore] = useState();
  // get cityIO data from redux store
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  // get cityio name from redux store
  const cityIOtableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  const handleSaveThisState = () => {
    getTableID(cityIOtableName).then((id) => {
      const newScenario = {
        // ! to be updated from dynamic ui element
        name: `${id}`,
        hash: id,
        description: `this is ${id} description`,
      };
      const tempArr = cityIOdata.scenarios ? [...cityIOdata.scenarios] : [];
      tempArr.push(newScenario);
      postToCityIO(tempArr, cityIOtableName, `/scenarios/`);
    });
  };

  const handleClose = () => {
    setDialogOpenState(false);
  };

  const handleOpenDialog = (scenario) => {
    // store to state the scenario to be restored
    setScenariosToRestore(scenario);
    // open dialog
    setDialogOpenState(true);
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
        <ListItem key={`scenario_li_${i}`}>
          <Tooltip
            key={"scenario_tt_" + i}
            arrow
            placement="right"
            title={scenario.description || `No description`}
          >
            <Button
              size="small"
              key={"scenario_button_" + i}
              variant="outlined"
              onClick={() => handleOpenDialog(scenario)}
            >
              <Typography variant="caption">
                {scenario.name.substring(0, 10) + `...`}
              </Typography>
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
    <>
      <Dialog open={dialogOpenState} onClose={handleClose}>
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
      {/*  */}
      <List>
        <ListItem>
          <Badge
            badgeContent={
              (cityIOdata.scenarios && cityIOdata.scenarios.length) || 0
            }
            color="primary"
          >
            <Button
              key={"save_state_button"}
              variant="outlined"
              onClick={handleSaveThisState}
            >
              <Typography variant="caption">Save This Scenario</Typography>
            </Button>
          </Badge>
        </ListItem>
        <List sx={{ width: "100%" }}>{scenariosButtonsList}</List>
      </List>
    </>
  );
}
