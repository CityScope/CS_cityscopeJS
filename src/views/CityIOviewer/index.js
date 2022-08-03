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
      <CityIOdeckGLmap cityIOdata={tablesList} />

      <Box sx={{ width: "100%", padding: 5}}>
        <CityIOlist getTablesList={getTablesList} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchTablesList tablesList={tablesList} />
          </Grid>
          <Grid item xs={12} lg={6} zIndex={10}>
            <Typography variant="h1">MIT CityScope</Typography>
            <Typography variant="h4">
              MIT CityScope is an open-source urban modeling and simulation
              platform. CityScope allows users to examine different design
              alternatives, and observe their impact through multiple layers of
              urban analytics.
            </Typography>

            <Typography variant="h4">
              <Link href={"https://github.com/CityScope"} target={"blank"}>
                <GitHubIcon fontSize={"small"} /> Join the CityScope open-source
                development
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
