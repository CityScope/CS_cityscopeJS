# CityScopeJS

## CityScope platform for the web

This repo contains web-based frontend interface for CityScope platforms.

![alt text](DOCS/CityScopeJS.jpg)

## Development

- clone or download zip
- install node with `npm`
- install `parcelJS`
- `$ npm install`
- `$ npm tst`

## CS Hamburg Table Extents

```
top_left_lat = 53.53811
top_left_lon = 10.00630
rotation = 145.5 deg
nrows = 44 cells
ncols = 78 cells
cellSize = 16 meter
```

#### Projection system

#### DHDN / Gauss-Kruger zone 4

`Proj4`
: `+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs`

---

## auxiliary Tools

These tool are web modules for CityScope platform:

- CityScopeJS Scanner: https://github.com/CityScope/CS_cityscopeJS_Scanner
- CityScopeJS Data Visualization and UI: https://github.com/CityScope/CS_CityScopeJS_UI
- CityScopeJS specific project modules: https://github.com/CityScope/CS_cityscopeJS_Modules
- CityScopeJS generic tool for projecting websites, images or video slideshows on a physical table: https://github.com/CityScope/CS_CityScopeJS_Projection

## Architecture

CityScopeJS includes several modules for building, testing and deploying an end-to-end CityScope platform. Each module operates as a standalone part of the system and is not dependent on other parts. Data flow between modules is achieved using [cityIO](https://cityio.media.mit.edu), as server system that acts as an operator between the different modules.
