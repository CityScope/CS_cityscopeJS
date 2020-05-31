import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import styled from "styled-components";

export const StyledListItem = styled(ListItem)`
    margin-left: 0.2em;
    margin-right: 0.2em;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.color};
    &:hover {
        background-color: ${(props) => props.color};

        -webkit-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.75);
        box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.75);
    }

    -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
`;

export const useStyles = makeStyles({
    root: {
        display: "flex",
        position: "absolute",
        paddingBottom: "10px",
        paddingTop: "10px",
        paddingLeft: "30px",
        paddingRight: "30px",
        left: "50%",
        bottom: "5%",
        transform: "translate(-50%, 0)",
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "50vw",
        height: "15vh",
        overflow: "auto",
        zIndex: 1,
    },
    list: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "12px",
        marginRight: "12px",
    },
    typeName: {
        color: "#FFF",
        fontSize: "10px",
    },
});
