import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import settings from "../../../../settings/settings.json";
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
import { postToCityIO } from "../../../../utils/utils";

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
  const cityIObaseURL = settings.cityIO.baseURL;
  const [scenariosButtonsList, setScenariosButtonsList] = useState([]);
  const [dialogOpenState, setDialogOpenState] = useState(false);
  // set historical states to be displayed in the menu
  const [historicalHashes, setHistoricalHashes] = useState([]);
  // get cityIO data from redux store
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  // get cityio name from redux store
  const cityIOtableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  const handleClose = () => {
    setDialogOpenState(false);
  };

  const handleOpenDialog = () => {
    setDialogOpenState(true);
  };

  const fetchJSON = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  };
  const getTablePrevCommitHash = async (id) =>
    await fetchJSON(`${cityIObaseURL}commit/${id}/`).then((c) => {
      return { parent: c.parent, meta: c };
    });

  const getTableID = async (tableName) =>
    await fetchJSON(`${cityIObaseURL}table/${tableName}/meta/id/`);

  async function createUndoButton() {
    await getTableID(cityIOtableName)
      .then((id) => getTablePrevCommitHash(id))
      .then((prevCommitHash) => {
        let undoButton = (
          <Button
            size="small"
            key={"past_commit_button"}
            variant="outlined"
            onClick={() => {}}
          >
            <Typography variant="caption">
              Go back to Last commit: {prevCommitHash.meta.timestamp}
            </Typography>
          </Button>
        );

        setHistoricalHashes(undoButton);
      });
  }

  const handleSaveThisState = () => {
    getTableID(cityIOtableName).then((id) => {
      const newScenario = {
        name: `${id}`,
        hash: id,
        description: `this is ${id} description`,
      };
      const tempArr = cityIOdata.scenarios ? [...cityIOdata.scenarios] : [];

      tempArr.push(newScenario);
      postToCityIO(tempArr, cityIOtableName, `/scenarios/`);
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
    const scenariosButtons =cityIOdata.scenarios.map((scenario, i) => {
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
              onClick={() => handleOpenDialog()}
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
    return scenariosButtons
  };

  useEffect(() => {
    createUndoButton();

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
          <Button autoFocus>Revert</Button>
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
        {historicalHashes}
      </List>
    </>
  );
}
