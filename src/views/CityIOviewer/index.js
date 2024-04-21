import CityIOlist from "./CityIOlist";
import SearchTablesList from "./SearchTablesList";
import { useState } from "react";
import { Typography, Link, Grid, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import CityIOdeckGLmap from "./CityIOdeckGLmap/index";

export default function CityIOviewer() {
  // get the list of tables from CityIOlist component and pass it to SearchTablesList component
  const [tablesList, getTablesList] = useState([]);
  return (
    <>
      {/* background color black */}

      <CityIOdeckGLmap cityIOdata={tablesList} />

      <Box sx={{ width: "100%", padding: 10 }}>
        <CityIOlist getTablesList={getTablesList} />

        <Grid container spacing={5} justifyContent="center">
          <Grid item xs={12} lg={4} zIndex={10}>
            <Typography variant="h1">MIT CityScope</Typography>
          </Grid>

          <Grid item xs={12} lg={4} zIndex={10}>
            {/* max width 50% on large screen */}

            <Typography variant="h4">
              MIT CityScope is an open-source urban modeling and simulation
              platform project developed by the City Science group at the MIT
              Media Lab
              {"  "}
              <Link href={"https://github.com/CityScope"} target={"blank"}>
                <GitHubIcon fontSize={"small"} />
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} lg={4} zIndex={10}>
            <SearchTablesList tablesList={tablesList} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
