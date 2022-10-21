import { BitmapLayer, TileLayer } from "deck.gl";
import { mapSettings } from "../../../../settings/settings";

export default function TileMapLayer() {
  const mapStyle = mapSettings.map.mapStyles.Dark;
  return new TileLayer({
    // visible: TUIobject?.MAP_STYLE?.active,
    data:
      `https://api.mapbox.com/styles/v1/relnox/${mapStyle}/tiles/256/{z}/{x}/{y}?access_token=` +
      process.env.REACT_APP_MAPBOX_TOKEN +
      "&attribution=false&logo=false&fresh=true",
    minZoom: 0,
    maxZoom: 21,
    tileSize: 256,
    id: "OSM",
    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });
}
