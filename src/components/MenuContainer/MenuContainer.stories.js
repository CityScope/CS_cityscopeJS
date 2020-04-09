import React from "react";
import { WithProvider } from "../../stories/withProvider.stories";
import MenuContainer from ".";

export default { title: "MenuContainer", component: MenuContainer };

export const defaultView = () => (
    <WithProvider>
        <MenuContainer></MenuContainer>
    </WithProvider>
);
