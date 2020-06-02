import React from "react";
import { WithProvider } from "./withProvider.stories";
import EditMenuMain from "../components/MenuContainer/EditMenu/EditMenuMain/_index";

export default { title: "EditMenuMain", component: EditMenuMain };

export const defaultView = () => (
    <WithProvider>
        <EditMenuMain></EditMenuMain>
    </WithProvider>
);
