import MenuContainer from "./MenuContainer";
import MapContainer from "./DeckglMap";

// import VisContainer from './VisContainer'
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Container,
} from "@material-ui/core";
import Page from "../../layouts/Page";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function CSjsMain(props) {
  const classes = useStyles();
  const { tableName, cityIOdata } = props;
  // state func to pass to the menu components
  // to get user interaction
  // and send  map object
  const [menuState, getMenuState] = useState();

  return (
    <Page className={classes.root} title="CitySCopeJS">
      <Container maxWidth={null}>
        <Grid container spacing={2}>
          <Grid item xs={12} l={2} md={4} xl={2} container>
            <Grid item container direction="column">
              <Card
                elevation={15}
                style={{
                  maxHeight: "85vh",
                  overflow: "auto",
                }}
              >
                <CardContent>
                  <MenuContainer
                    cityIOdata={cityIOdata}
                    tableName={tableName}
                    getMenuState={getMenuState}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid item xs={12} l={6} md={8} xl={8}>
            <Card
              elevation={15}
              style={{
                height: "85vh",
                width: "100%",
                position: "relative",
              }}
            >
              {menuState && (
                <MapContainer cityIOdata={cityIOdata} menuState={menuState} />
              )}
            </Card>
          </Grid>
          <Grid item xs={12} l={3} md={12} xl={2}>
            <Card
              elevation={15}
              style={{
                maxHeight: "85vh",
                overflow: "auto",
              }}
            >
              <CardContent>
                {JSON.stringify(menuState)}
                {/* <VisContainer cityIOdata={cityIOdata} /> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
