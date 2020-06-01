import React from "react";
import { WithProvider } from "./withProvider.stories";
import MenuContainer from "../components/MenuContainer";

export default { title: "MenuContainer", component: MenuContainer };

export const defaultView = () => (
    <WithProvider>
        <MenuContainer></MenuContainer>
    </WithProvider>
);
