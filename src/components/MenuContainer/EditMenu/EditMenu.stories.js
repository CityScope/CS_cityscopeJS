import React from "react";
import { WithProvider } from "../../../stories/withProvider.stories";
import EditMenu from "./index";

export default {
    title: "EditMenu",
    component: EditMenu
};

export const DefaultView = () => (
    <WithProvider>
        <EditMenu></EditMenu>
    </WithProvider>
);
