# CityScopeJS

#### CityScope platform for the web

CityScopeJS is a modular, open-ended architecture for MIT CityScope project.

## Architecture

![CityScopeJS Architecture](DOCS/CityScopeJS_arch.png)

CityScopeJS includes several modules for building, testing and deploying an end-to-end CityScope platform. Each module is developed as a standalone part of the system with minimal dependency on others. Data flow between modules is achieved using [cityIO](https://cityio.media.mit.edu), which operates between the different modules.

![TUI](DOCS/CityScopeJS.jpg)

# CityScopeJS Frontend

This repo contains the web frontend interface for CityScope platform.

## Development

In the project directory, you can run: `npm start` Runs the app in the development mode.<br /> Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

-   In the project directory, you can run:
    ### `npm start`
    Runs the app in the development mode.<br />
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
-   Start by adding CityScope table name to the URL (in the form of: `...URL/?__yourTableName__`)
-   Look for other active tables in cityIO

# CityScopeJS Auxiliary Tools

CityScopeJS is being constantly developed through its frontend, backend and modules. These tools extend CityScopeJS:

-   CityScopeJS Scanner: https://github.com/CityScope/CS_CityScoPy
-   CityScopeJS Data Visualization and UI: https://github.com/CityScope/CS_CityScopeJS_UI

Not actively maintained:

-   CityScopeJS specific project modules: https://github.com/CityScope/CS_cityscopeJS_Modules
-   CityScopeJS generic tool for projecting websites, images or video slideshows on a physical table: https://github.com/CityScope/CS_CityScopeJS_Projection
