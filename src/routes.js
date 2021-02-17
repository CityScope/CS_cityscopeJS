import React from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import NotFoundView from "./views/Errors/NotFoundView";
import GridEditor from "./views/GridEditor";
import CityScopeJS from "./views/CityScopeJS";
import SplashScreen from "./views/SplashScreen";

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/home", element: <SplashScreen /> },
            { path: "CS_cityscopeJS", element: <SplashScreen /> },

            { path: "/", element: <CityScopeJS /> },
            { path: "/editor", element: <GridEditor /> },
            { path: "*", element: <Navigate to="/404" /> },
            { path: "404", element: <NotFoundView /> },
        ],
    },
];

export default routes;
