import MenuContainer from "./MenuContainer";
import MapContainer from "./DeckglMap";
import { useSelector } from "react-redux";

// import VisContainer from './VisContainer'
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Container,
} from "@material-ui/core";
import Page from "../../layouts/Page";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function CSjsMain() {
  const classes = useStyles();

  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  const menuIsPopulated = useSelector(
    (state) => state.menuState.menuIsPopulated
  );

  return (
    <Page className={classes.root} title="CitySCopeJS">
      <Container maxWidth={null}>
        <Grid container spacing={2}>
          <Grid item xs={6} l={2} md={4} xl={2} container>
            <Grid item container direction="column">
              <Card
                elevation={15}
                style={{
                  maxHeight: "85vh",
                  overflow: "auto",
                }}
              >
                <CardContent>{cityIOisDone && <MenuContainer />}</CardContent>
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
              {menuIsPopulated && <MapContainer />}
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
                {/* <VisContainer cityIOdata={cityIOdata} /> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
