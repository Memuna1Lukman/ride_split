import { useEffect, useRef, useState } from 'react'
import RideMap from '../components/map/RideMap'
import { getDrivingRoute } from '../services/mapService'
import { createRide } from '../services/rideApi'
import { useAuth } from '../features/auth/AuthContext'
import RouteSetupForm from '../components/ride/RouteSetupForm'
import Spinner from '../components/ui/Spinner'

export default function RideRequestPage() {
    const { user } = useAuth();
    const [pickup,setPickup]= useState(null);
    const [dropoff,setDropoff]= useState(null);
    const [route,setRoute] = useState(null);
    const [selectionMode, setSelectionMode] = useState("pickup");
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [error, setError] = useState("");
    const [rideType, setRideType] = useState("shared");
    const [isCreatingRide, setIsCreatingRide] = useState(false);
    const [creationError, setCreationError] = useState("");
    const [createdRide, setCreatedRide] = useState(null);
    const routeRequestId = useRef(0);

    function invalidateRoute() {
        routeRequestId.current += 1;
        setRoute(null);
        setIsLoadingRoute(false);
    }

    function handleMapSubmit(location){
        setError("");
        setCreationError("");
        setCreatedRide(null);
        if(selectionMode === "pickup"){
            invalidateRoute();
            setPickup({...location,label:"Selected Pickup"});
            setDropoff(null);
            setSelectionMode("drop-off");
            return
        }
        if (selectionMode === "drop-off") {
            invalidateRoute();
            setDropoff({ ...location, label: "Selected destination" });
            setSelectionMode(null);
        }
    }

    function selectPickup(location) {
        setError("");
        setCreationError("");
        setCreatedRide(null);
        invalidateRoute();
        setPickup(location);
        setDropoff(null);
        setSelectionMode("drop-off");
    }

    function selectDropoff(location) {
        setError("");
        setCreationError("");
        setCreatedRide(null);
        invalidateRoute();
        setDropoff(location);
        setSelectionMode(null);
    }

    useEffect(() => {
        const requestId = ++routeRequestId.current;
        if (!pickup || !dropoff) return undefined;

        async function loadRoute(){
            try{
                setIsLoadingRoute(true);
                const nextRoute = await getDrivingRoute(pickup,dropoff);
                if (requestId === routeRequestId.current) setRoute(nextRoute);
            }catch(routeError){
                if (requestId === routeRequestId.current) setError(routeError.message);
            }finally{
                if (requestId === routeRequestId.current) setIsLoadingRoute(false);
            }
        }
        loadRoute();
        return () => {
            if (requestId === routeRequestId.current) routeRequestId.current += 1;
        };
    }, [pickup, dropoff]);
    const canCreateRide = pickup && dropoff && route && !isLoadingRoute;

    async function handleCreateRide() {
        if (!canCreateRide || isCreatingRide) return;

        setCreationError("");
        setCreatedRide(null);
        setIsCreatingRide(true);
        try {
            const nextRide = await createRide({ pickup, dropoff, rideType });
            setCreatedRide(nextRide);
        } catch (rideError) {
            setCreationError(rideError.message);
        } finally {
            setIsCreatingRide(false);
        }
    }
  return (
    <main className="mx-auto max-w-6xl p-6">
        <p className="mb-2 text-sm font-semibold text-lime-700">Welcome, {user.full_name}</p>
        <h1 className="mb-2 text-3xl font-bold">Request a ride</h1>
        <p className="mb-6 text-neutral-600">
          Search for a place in Ghana or select your pickup and destination directly on the map.
        </p>

        <div className="mb-6">
          <RouteSetupForm
            pickup={pickup}
            dropoff={dropoff}
            onPickupSelect={selectPickup}
            onDropoffSelect={selectDropoff}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <RideMap
            pickup={pickup}
            dropoff={dropoff}
            route={route}
            selectionMode={selectionMode}
            onMapClick={handleMapSubmit}
            focusLocation={dropoff ?? pickup}
          />

          <aside className="rounded-2xl border p-5">
            <p><strong>Pickup:</strong> {pickup ? "Selected" : "Not selected"}</p>
            <p className="mt-3">
              <strong>Destination:</strong> {dropoff ? "Selected" : "Not selected"}
            </p>

            {route && (
              <p className="mt-3">
                <strong>Distance:</strong>{" "}
                {(route.distanceMeters / 1000).toFixed(1)} km
              </p>
            )}

            {isLoadingRoute && <p className="mt-4 flex items-center gap-2 text-sm text-neutral-600"><Spinner label="Finding driving route" />Finding driving route…</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}

            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-semibold text-neutral-800">Ride type</legend>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-100 p-1">
                {[
                  { value: "solo", label: "Solo ride", description: "Just for you" },
                  { value: "shared", label: "Shared ride", description: "Ride with others" },
                ].map((option) => {
                  const isSelected = rideType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setRideType(option.value)}
                      className={`rounded-lg px-3 py-2.5 text-left transition ${
                        isSelected
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      <span className="block text-sm font-bold">{option.label}</span>
                      <span className="mt-0.5 block text-xs">{option.description}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={handleCreateRide}
              disabled={!canCreateRide || isCreatingRide}
              className="mt-6 w-full rounded-lg bg-lime-400 px-4 py-3 font-bold text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingRide ? 'Creating ride…' : `Create ${rideType} ride`}
            </button>

            {creationError && <p role="alert" className="mt-3 text-sm text-red-600">{creationError}</p>}
            {createdRide && <p role="status" className="mt-3 text-sm text-lime-700">Your {rideType} ride has been created.</p>}

            <button
              type="button"
              onClick={() => {
                setPickup(null);
                setDropoff(null);
                invalidateRoute();
                setError("");
                setCreationError("");
                setCreatedRide(null);
                setSelectionMode("pickup");
              }}
              className="mt-3 w-full text-sm text-neutral-600"
            >
              Reset locations
            </button>
          </aside>
        </div>
    </main>
  )
}
