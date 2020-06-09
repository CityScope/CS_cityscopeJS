import React from "react";
import { WithProvider } from "./withProvider.stories";
import VisContainer from "../components/vis/visContainer";
export default { title: "VisContainer", component: VisContainer };

export const defaultView = () => (
    <WithProvider>
        <VisContainer />
    </WithProvider>
);
