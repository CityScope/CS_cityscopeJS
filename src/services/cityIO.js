// export const getCityIO = URL =>
//     fetch(URL)
//         .then(response => response.json())
//         .then(result => {
//             return result;
//         })
//         .catch(e => {
//             console.log(e);
//             return e;
//         });

// const axios = require("axios");

import axios from "axios";

export const getCityIO = URL =>
    axios
        .get(URL)
        .then(response => {
            console.log("response:", response);
        })
        .catch(error => {
            if (error.response) {
                console.log("error.response:", "\n", error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log("error.request:", error.request);
            } else {
                console.log("misc error:", error.message);
            }
            console.log("request config:", error.config);
        });
