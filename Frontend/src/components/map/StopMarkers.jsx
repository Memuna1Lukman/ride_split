import { Marker } from "react-map-gl/mapbox";

function Pin({ color, label }) {
  return (
    <div
      title={label}
      className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-lg'
      style={{backgroundColor:color}}
    >
       {label === "Pickup"? "P":"D"}
    </div>
  )
}

export default function StopMarkers({ pickup, dropoff }) {
    return(
        <>
          {pickup &&(
            <Marker
              longitude={pickup.longitude}
              latitude={pickup.latitude}
              anchor='bottom'
            >
                <Pin color="#16a34a" label="Pickup" />
            </Marker>
          )}
          {dropoff && (
            <Marker
              longitude={dropoff.longitude}
              latitude={dropoff.latitude}
              anchor='bottom'
            >
                <Pin color="#dc2626" label="Drop-off" />

            </Marker>
          )}
        </>
    )
}
