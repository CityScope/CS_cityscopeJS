import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";

export default function GetGITdate() {
    const [gitMeta, setGitMeta] = useState({
        author: "",
        branch: "",
        date: "",
        sha: "",
        link: "",
    });

    const URL =
        "https://api.github.com/repos/CityScope/CS_cityscopeJS/branches/master";

    const fetchGitHub = () =>
        fetch(URL)
            .then((response) => {
                response.json().then((json) => {
                    setGitMeta({
                        author: json.commit.commit.author.name,
                        date: json.commit.commit.author.date,
                        sha: json.commit.sha,
                    });
                });
            })
            .catch((error) => {
                console.log(error);
            });
    // run only once
    useEffect(() => {
        fetchGitHub();
    }, []);

    const gitMetaComp = (
        <>
            <Typography variant="caption">
                <h2>CityScopeJS Development Tracking</h2>
                <h4>Last Commit</h4>
                <div>Author: {JSON.parse(JSON.stringify(gitMeta.author))}</div>
                <div>Date: {JSON.parse(JSON.stringify(gitMeta.date))}</div>
                <div>Hash: {JSON.parse(JSON.stringify(gitMeta.sha))}</div>
            </Typography>
        </>
    );

    return gitMetaComp;
}
