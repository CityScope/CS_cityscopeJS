# Geojson Layer

to post a geojson layer to table `test` using `curl`, follow this schema

```
curl -v -d '{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "stroke": "#555555",
        "stroke-width": 2,
        "stroke-opacity": 1,
        "fill": "#ff0000",
        "fill-opacity": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.08785152435301,
              42.36458476210186
            ],
            [
              -71.08394622802734,
              42.367073865050585
            ],
            [
              -71.07536315917967,
              42.3621114156308
            ],
            [
              -71.07175827026367,
              42.3640615623146
            ],
            [
              -71.07199430465698,
              42.36563114860502
            ],
            [
              -71.07624292373657,
              42.36989578604455
            ],
            [
              -71.08624219894409,
              42.37117987666218
            ],
            [
              -71.09549045562744,
              42.36528235504046
            ],
            [
              -71.08858108520508,
              42.36005021919292
            ],
            [
              -71.07965469360352,
              42.362460226799854
            ],
            [
              -71.08280897140503,
              42.365139666205934
            ],
            [
              -71.08785152435301,
              42.36458476210186
            ]
          ]
        ]
      }
    }
  ]
}' -H "Content-Type: application/json" https://cityio.media.mit.edu/api/table/test/geojson
```
