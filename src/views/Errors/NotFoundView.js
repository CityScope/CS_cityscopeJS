import React from "react";
import { Box, Container, Typography, makeStyles } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
}));

const NotFoundView = () => {
  const classes = useStyles();

  return (
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography align="center" color="textPrimary" variant="h1">
            404
          </Typography>
          <Typography align="center" color="textPrimary" variant="h5">
            The page you are looking for isn’t here
          </Typography>
        </Container>
      </Box>
    
  );
};

export default NotFoundView;
