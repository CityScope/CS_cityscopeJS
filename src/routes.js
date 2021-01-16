import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFoundView from "./views/NotFoundView";
import GridEditor from "./views/GridEditor";
import CityScopeJS from "./views/CityScopeJS";
import SplashScreen from "./views/SplashScreen";

const routes = [
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            { path: "/", element: <SplashScreen /> },
            { path: "/csjs", element: <CityScopeJS /> },
            { path: "/editor", element: <GridEditor /> },
            { path: "*", element: <Navigate to="/404" /> },
            { path: "404", element: <NotFoundView /> },
        ],
    },
];

export default routes;
