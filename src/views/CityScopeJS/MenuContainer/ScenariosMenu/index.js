import { useEffect, useState } from "react";
import settings from "../../../../settings/settings.json";
import { Typography, ListItem, Button, List } from "@mui/material";
import { useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";

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
  // set historical states to be displayed in the menu
  const [historicalHashes, setHistoricalHashes] = useState([]);
  // get cityIO data from redux store
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  // get cityio name from redux store
  const cityIOtableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  const fetchJSON = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  };
  const getTablePrevCommitHash = async (id) =>
    await fetchJSON(`${cityIObaseURL}commit/${id}/`).then((c) => {
      return { parent: c.parent, meta: c };
    });

  const postScenarios = async (tableName, data) => {
    const response = await fetch(
      `${cityIObaseURL}table/${tableName}/scenarios/`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }
    );
    let json_data;
    try {
      json_data = await response.json();
    } catch (error) {
      return "wasn't a json data";
    }
    return json_data;
  };

  const getTableID = async (tableName) =>
    await fetchJSON(`${cityIObaseURL}table/${tableName}/meta/id/`);

  async function getLastState() {
    await getTableID(cityIOtableName)
      .then((id) => getTablePrevCommitHash(id))
      .then((prevCommitHash) => {
        console.log(prevCommitHash);
        let undoButton = (
          <Button
            size="small"
            key={"past_commit_button"}
            variant="outlined"
            onClick={() => {}}
          >
            <Typography>Undo</Typography>

            <Typography variant="caption">
              {prevCommitHash.meta.timestamp}
            </Typography>
          </Button>
        );
        // for (let i = 0; i < 10; i++) {
        //   tempHash = await getTablePrevCommitHash(tempHash).then((c) => {
        //    return c.parent;
        //   });
        //   console.log("tempHash", tempHash);
        //   historicalHashes.push(
        //     <Button
        //       size="small"
        //       key={"past_commit_button_" + i}
        //       variant="outlined"
        //       onClick={() => {}}
        //     >
        //       <Typography variant="caption">
        //         {tempHash.substring(0, 10) + `...`}
        //       </Typography>
        //     </Button>
        //   );
        // }
        setHistoricalHashes(undoButton);
      });
  }

  const handleSaveThisState = () => {
    getTableID(cityIOtableName).then((id) => {
      const newScenario = {
        name: `${id}`,
        hash: id,
        description: "this is ${id} description",
      };
      const tempArr = cityIOdata.scenarios ? [...cityIOdata.scenarios] : [];

      tempArr.push(newScenario);
      postScenarios(cityIOtableName, tempArr);
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
    postScenarios(cityIOtableName, tempArr);
  };

  useEffect(() => {
    getLastState();

    if (!cityIOdata.scenarios) return;
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
              onClick={() => {}}
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

    setScenariosButtonsList(scenariosButtons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata]);

  return (
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
  );
}
