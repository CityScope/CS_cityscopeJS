# CityScopeJS

#### CityScope platform for the web

CityScopeJS is a unified front-end for the [MIT CityScope](https://cityscope.media.mit.edu/) project, an [open-source](https://github.com/CityScope/CS_cityscopeJS) urban modeling and simulation platform. CityScopeJS allows users to test different design alternatives and observe their impact through multiple layers of urban analytics. CityScopeJS combines different urban analytics modules, such as traffic simulation, ABM, noise, storm-water, access.

![TUI](docs/figures/CityScopeJS.jpg)

###### Schematic view of CityScope TUI

## Quick Start

As of now, CityScopeJS is available for several projects:

To explore the app for a known CityScope project, add a CityScope project name to this page URL (for example, `__URL__/grasbrook` will run [CityScopeJS Grasbrook](https://cityscope.media.mit.edu/CS_cityscopeJS/grasbrook) project). You can also explore a list of active CityScope projects [here](https://cityio.media.mit.edu)

# CityScopeJS Architecture

CityScopeJS is a modular, open-ended architecture for MIT CityScope project.

![CityScopeJS Architecture](docs/figures/CityScopeJS_arch.png)

CityScopeJS includes several modules for building, testing and deploying an end-to-end CityScope platform. Each module is developed as a standalone part of the system with minimal dependency on others. Data flow between modules is achieved using [cityIO](https://cityio.media.mit.edu), which operates between the different modules.

# Development

CityScopeJS is being constantly developed through its frontend, backend and modules. This repo is subject to breaking changes.

In the project directory, you can run: `npm start` Runs the app in the development mode.<br /> Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Usage

-   Start by adding CityScope table name to the URL (in the form of: `...URL/?__yourTableName__`)
-   Look for other active tables in cityIO

### Mock cityIO API

Sometimes, cityIO service is down, or you'd like to stress-test things that might burden cityIO. To mock the API, install `json-server` https://github.com/typicode/json-server:

```
npm install -g json-server
```

and then go to the mocked cityIO API JSON file in `docs/mockAPI` and run:

```
json-server --watch mockAPI.json --port 3001
```

then, use this URL to run the app in the mocked server env:

```
http://localhost:3000/mockAPI
```

Note that the mocked API only holds minimal data for running the dev env, but not the full API.

### Hard-Reset cityIO `GEOGRIDDATA` field

**Note!** This feature involves permanent data loss.

If your dev created odd data for the grid, you can quickly reset it via:

```
`$ curl https://cityio.media.mit.edu/api/table/clear/__TABLE_NAME__/GEOGRIDDATA`
```

# CityScopeJS schema

This document illustrates the data format and standards for the deployment of a CityScopeJS instance. Being a WIP project, this is subject to change.

## Data Requirements

### `geogrid:geojson`

Minimal data for initiation is a valid GeoJson `FeatureCollection` of at least one `Polygon` feature.
Ideally, this field should be read once on init, due to its size and static state. User should not iterate over it.

```
{
  "type": "FeatureCollection",
  "properties": {
    "header": {},
    "interactive_mapping": {"1245":{"TUI":"1"},"1472":{"WEB":"1"}}
  },

  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
             __lat__,
              __long__
            ],
            [
             __lat__,
              __long__
            ],
            [
              __lat__,
              __long__
            ],
            [
             __lat__,
              __long__
            ],
            [
             __lat__,
              __long__
            ]
          ]
        ]
      }
    }...
  ]
}
```

**optional fields**

`interactive_mapping`: maps the grid cells that are interactable via the HCI/TUI CityScope interface or web/mobile UI. This allow mixing of different interactions without overwriting. Format

```
{
	"__feature_number__": {
		"TUI": "__TUI_CELL_NUMBER__"
	},
	"__feature_number__": {
		"WEB": "__WEB_INTERACTION_CELL_NUMBER__"
	}
}
```

### `geonet:geojson`

This file holds a single point for each grid cell. Each point is then evaluated as part of a network graph that is adjoined to the overall city network graph via a mobility service. This file will be self created in the app if no prior data exist on cityIO. Minimal data is a valid GeoJson `FeatureCollection` of at least 4 `Points` feature. Ideally, this field should be read once on init, due to its size and static state. User should not iterate over it.

# CityScopeJS Modules, Dependencies and Tools

## Analysis modules

Different analysis modules calculate various indicators on urban performance, such as noise, mobility, energy and others. These analysis modules are developed by experts in each evaluation field.

## CityScopeJS Interface

CityScopeJS is an online tool with a web or tangible user interface (TUI). Using the tool, users can input land uses, buildings, open spaces or transport routes, categorize them and enrich their description with details on usability, density and other parameters. This input forms the basis for calculating the various modules and indicators.

## CityScope Server

-   https://github.com/CityScope/CS_CityIO

## Analysis Modules for CityScopeJS

-   Urban Indicators module ("Radar"): https://github.com/CityScope/CS_Urban_Indicators
-   A web service providing mobility simulations for CityScope projects https://github.com/CityScope/CS_Mobility_Service
-   Noise Modeling for Grasbrook, Hamburg: https://github.com/CityScope/CSL_Hamburg_Noise
-   Agent Based Modeling https://github.com/CityScope/CS_Simulation_GAMA
-   Traffic Simulation module using DLR SUMO https://github.com/CityScope/CS_SUMOscope

## Tools for Tangible User Interfaces

-   CityScope Scanner: https://github.com/CityScope/CS_CityScoPy
-   CityScopeJS tool for projecting websites, images or video slideshows on a physical table: https://github.com/CityScope/CS_CityScopeJS_Projection

## Previous Versions of CityScopeJS

-   Multiple CSjs projects https://github.com/CityScope/CS_cityscopeJS_Modules
-   CityScope Project in Hamburg, DE: https://github.com/CityScope/CSL_Hamburg_Grasbrook
