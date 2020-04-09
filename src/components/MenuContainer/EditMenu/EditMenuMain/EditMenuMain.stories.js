import React from "react";
import { WithProvider } from "../../../../stories/withProvider.stories";
import EditMenuMain from "./index";

export default {
    title: "EditMenuMain",
    component: EditMenuMain
};

export const DefaultView = () => (
    <WithProvider>
        <EditMenuMain></EditMenuMain>
    </WithProvider>
);
