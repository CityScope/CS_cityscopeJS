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
