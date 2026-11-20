import { useEffect,useRef } from 'react'
import Map,{NavigationControl} from 'react-map-gl/mapbox'
import "mapbox-gl/dist/mapbox-gl.css";
import StopMarkers from './StopMarkers';
import RouteLayer from './RouteLayer';

const GHANA_VIEW = {
    longitude: -1.0232,
    latitude: 7.9465,
    zoom: 6.2,
  };

export default function RideMap({pickup,dropoff,route,selectionMode,onMapClick,focusLocation}) {
  const mapRef = useRef(null)
  useEffect(()=>{
    if (!pickup || !dropoff || !mapRef.current) return;
    mapRef.current.fitBounds(
      [
        [pickup.longitude,pickup.latitude],
        [dropoff.longitude,dropoff.latitude]
      ],
      {padding:80,duration:700}
    );

  },[pickup,dropoff]);

  useEffect(() => {
    if (!focusLocation || !mapRef.current || (pickup && dropoff)) return;
    mapRef.current.flyTo({
      center: [focusLocation.longitude, focusLocation.latitude],
      zoom: 14,
      duration: 900,
    });
  }, [focusLocation, pickup, dropoff]);

  function handleMapClick(event){
    onMapClick?.({
      latitude:event.lngLat.lat,
      longitude:event.lngLat.lng,
    });
  }

  return (
    <div className='relative h-112 overflow-hidden rounded-2xl border border-white/10 sm:h-125'>
      <Map
        ref={mapRef}
        initialViewState={GHANA_VIEW}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={handleMapClick}
        cursor={selectionMode ? "crosshair" : "grab"}
      >
        <NavigationControl position="top-right" />

        <RouteLayer route={route} />
        <StopMarkers pickup={pickup} dropoff={dropoff} />

      </Map>
        {selectionMode && (
          <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-white/10 bg-neutral-900/95 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-black/30">
            Click the map to choose your {selectionMode}
          </div>
        )}
    </div>
  )
}
