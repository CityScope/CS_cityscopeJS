import React from "react";
import { WithProvider } from "../../../../stories/withProvider.stories";
import TypeEditor from "./index";

export default {
    title: "TypeEditor",
    component: TypeEditor
};

export const DefaultView = () => (
    <WithProvider>
        <TypeEditor></TypeEditor>
    </WithProvider>
);
