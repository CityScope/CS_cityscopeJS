import React from "react";
import { WithProvider } from "../../stories/withProvider.stories";
import Menu from "./menu";

export default { title: "Menu", component: Menu };

export const defaultView = () => (
    <WithProvider>
        <Menu></Menu>
    </WithProvider>
);
