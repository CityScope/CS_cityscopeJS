import React, { useContext } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import LayersIcon from "@material-ui/icons/Layers";
import { AppContext } from "./provider";
import HomeIcon from "@material-ui/icons/Home";

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
            <ListSubheader inset>General</ListSubheader>

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
                    changeContentUrl("ecosystem.md");
                }}
            >
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="CityScope Ecosystem" />
            </ListItem>

            <ListSubheader inset>Usage & Dev</ListSubheader>

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

            <ListItem
                button
                onClick={() => {
                    changeContentUrl("dev.md");
                }}
            >
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Development" />
            </ListItem>
        </div>
    );
}

export { MainListItems, TechnologyListItems };
