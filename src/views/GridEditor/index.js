import EditorMap from "./EditorMap/EditorMap";
import EditorMenu from "./EditorMenu";
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

export default function GridEditor() {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Editor">
            <Container maxWidth={false}>
                <>
                    <Grid container spacing={5}>
                        <Grid item xs={12} l={6} md={6} xl={4}>
                            <Card
                                elevation={15}
                                style={{
                                    maxHeight: "85vh",
                                    overflow: "auto",
                                }}
                            >
                                <CardContent>
                                    <EditorMenu />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} l={6} md={6} xl={8}>
                            <Card
                                elevation={15}
                                style={{
                                    height: "85vh",
                                    width: "100%",
                                    position: "relative",
                                }}
                            >
                                <CardContent>
                                    <EditorMap />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            </Container>
        </Page>
    );
}
