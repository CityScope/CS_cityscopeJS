import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import styled from "styled-components";

export const StyledListItem = styled(ListItem)`
    margin-left: 0.2em;
    margin-right: 0.2em;
    border-radius: 50%;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.color};
    &:hover {
        background-color: ${props => props.color};
    }
`;

export const useStyles = makeStyles(theme => ({
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
        width: "80vw",
        height: "15vh",
        overflow: "auto"
    },
    list: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "12px",
        marginRight: "12px"
    },
    typeName: {
        color: "white",
        fontSize: "10px"
    }
}));
