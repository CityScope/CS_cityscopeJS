import React, { useContext } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import LayersIcon from "@material-ui/icons/Layers";
import { AppContext } from "./provider";
import HomeIcon from "@material-ui/icons/Home";
import GitHubIcon from "@material-ui/icons/GitHub";
import CloudQueueIcon from "@material-ui/icons/CloudQueue";

function MainListItems() {
    const { setContentUrl } = useContext(AppContext);
    const changeContentUrl = url => {
        setContentUrl(url);
    };
    return (
        <div>
            <ListItem
                button
                onClick={() => {
                    changeContentUrl("home.md");
                }}
            >
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="CityScopeJS" />
            </ListItem>
        </div>
    );
}

function TechnologyListItems() {
    const { setContentUrl } = useContext(AppContext);
    const changeContentUrl = url => {
        setContentUrl(url);
    };
    return (
        <div>
            <ListSubheader inset>Docs</ListSubheader>

            <ListItem
                button
                onClick={() => {
                    changeContentUrl("arch.md");
                }}
            >
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Architecture" />
            </ListItem>

            <ListItem
                button
                onClick={() => {
                    changeContentUrl("schema.md");
                }}
            >
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Data Standards" />
            </ListItem>

            <ListSubheader inset>Links</ListSubheader>

            <ListItem
                button
                onClick={() =>
                    window.open(
                        "https://github.com/CityScope/CS_cityscopeJS",
                        "_blank"
                    )
                }
            >
                <ListItemIcon>
                    <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary="CityScopeJS GitHub" />
            </ListItem>

            <ListItem
                button
                onClick={() =>
                    window.open("https://cityio.media.mit.edu", "_blank")
                }
            >
                <ListItemIcon>
                    <CloudQueueIcon />
                </ListItemIcon>
                <ListItemText primary="cityIO" />
            </ListItem>
        </div>
    );
}

export { MainListItems, TechnologyListItems };
