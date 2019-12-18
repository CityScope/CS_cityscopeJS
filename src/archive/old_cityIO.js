import axios from "axios";

export const getCityIO = URL =>
    axios
        .get(URL)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            if (error.response) {
                console.log(
                    "error.response:",
                    "\n",
                    error.response.data,
                    "\n",
                    error.response.status,
                    "\n",
                    error.response.headers
                );
            } else if (error.request) {
                console.log("error.request:", error.request);
            } else {
                console.log("misc error:", error.message);
            }
            console.log("request config:", error.config);
        });
