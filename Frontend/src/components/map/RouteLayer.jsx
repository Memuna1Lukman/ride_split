import { Layer,Source } from "react-map-gl/mapbox";

export default function RouteLayer({ route }) {
    if (!route?.geometry?.coordinates?.length){
        return null;
    }

  return (
    <Source id="ride-route" type="geojson" data={route.geometry}>
        <Layer
          id="ride-route-line"
          type="line"
          paint={{
            "line-color":"#2563eb",
            "line-width":6,
            "line-opacity":0.85
          }}
          layout={{
            "line-cap":"round",
            "line-join":"round"
          }}
        />
    </Source>
  )
}
