import React from "react";
import { WithProvider } from "../../../../stories/withProvider.stories";
import TypeMenuContainer from "./index";

export default {
    title: "TypeMenuContainer",
    component: TypeMenuContainer
};

export const DefaultView = () => (
    <WithProvider>
        <TypeMenuContainer></TypeMenuContainer>
    </WithProvider>
);
