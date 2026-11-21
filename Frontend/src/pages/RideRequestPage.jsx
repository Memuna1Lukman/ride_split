import { useEffect, useRef, useState } from 'react'
import RideMap from '../components/map/RideMap'
import { getDrivingRoute } from '../services/mapService'
import { createRide } from '../services/rideApi'
import { useAuth } from '../features/auth/AuthContext'
import { useNavigate } from 'react-router'
import RouteSetupForm from '../components/ride/RouteSetupForm'
import Spinner from '../components/ui/Spinner'
import Header from '../components/layout/Header'
import { CarFront, CheckCircle2, Circle, MapPin, Navigation, RotateCcw, Route } from 'lucide-react'

export default function RideRequestPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
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
    const [submittedRideType, setSubmittedRideType] = useState("");
    const [submissionDraftId, setSubmissionDraftId] = useState(null);
    const [activeDraftId, setActiveDraftId] = useState(0);
    const [pickupHasUnconfirmedEdits, setPickupHasUnconfirmedEdits] = useState(false);
    const [dropoffHasUnconfirmedEdits, setDropoffHasUnconfirmedEdits] = useState(false);
    const routeRequestId = useRef(0);
    const idempotencyKey = useRef(null);

    function startNewDraft() {
        setActiveDraftId((currentDraftId) => currentDraftId + 1);
        idempotencyKey.current = null;
    }

    function clearCurrentDraftFeedback() {
        if (submissionDraftId === activeDraftId) {
            setCreationError("");
            setCreatedRide(null);
            setSubmittedRideType("");
            setSubmissionDraftId(null);
        }
    }

    function invalidateRoute() {
        routeRequestId.current += 1;
        setRoute(null);
        setIsLoadingRoute(false);
    }

    function handleMapSubmit(location){
        startNewDraft();
        setError("");
        clearCurrentDraftFeedback();
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
        startNewDraft();
        setError("");
        clearCurrentDraftFeedback();
        invalidateRoute();
        setPickup(location);
        setDropoff(null);
        setSelectionMode("drop-off");
    }

    function selectDropoff(location) {
        startNewDraft();
        setError("");
        clearCurrentDraftFeedback();
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
    const canCreateRide = pickup && dropoff && route && !isLoadingRoute && !pickupHasUnconfirmedEdits && !dropoffHasUnconfirmedEdits;

    async function handleCreateRide() {
        if (!canCreateRide || isCreatingRide) return;

        const submittedDraft = activeDraftId;
        const submittedType = rideType;
        const submissionKey = idempotencyKey.current ?? crypto.randomUUID();
        idempotencyKey.current = submissionKey;
        setCreationError("");
        setCreatedRide(null);
        setSubmissionDraftId(submittedDraft);
        setSubmittedRideType(submittedType);
        setIsCreatingRide(true);
        try {
            const nextRide = await createRide({ pickup, dropoff, rideType: submittedType, idempotencyKey: submissionKey });
            setCreatedRide(nextRide);
            navigate(`/rides/${nextRide.id}`);
        } catch (rideError) {
            setCreationError(rideError.message);
        } finally {
            setIsCreatingRide(false);
        }
    }
  const routeDistance = route ? `${(route.distanceMeters / 1000).toFixed(1)} km` : '—';
  const routeStatus = isLoadingRoute
    ? 'Finding the best driving route…'
    : route
      ? 'Route ready to review'
      : selectionMode === 'drop-off'
        ? 'Choose your destination next'
        : 'Choose your pickup to begin';

  return (
    <div className="min-h-screen bg-neutral-950 text-white lg:flex">
      <Header variant="sidebar" prop1='City Ride' prop2='My invitations' prop3='Notification' prop4='Safety' prop6='Driver mode' />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-lime-200">Welcome back, {user?.full_name || 'there'}</p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Request a ride</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
              Choose your route, then decide whether to travel solo or share the fare.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-300 sm:self-auto">
            <Route className="size-4 text-lime-200" aria-hidden="true" />
            <span>{routeStatus}</span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6" aria-label="Plan your route">
            <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-4 shadow-2xl shadow-black/20 sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-lime-200/20 bg-lime-200/10">
                  <Navigation className="size-5 text-lime-200" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Your route</h2>
                  <p className="mt-0.5 text-sm text-neutral-400">Search for an address or pick each stop directly on the map.</p>
                </div>
              </div>
              <RouteSetupForm
                pickup={pickup}
                dropoff={dropoff}
                onPickupSelect={selectPickup}
                onDropoffSelect={selectDropoff}
                onPickupUnconfirmedChange={setPickupHasUnconfirmedEdits}
                onDropoffUnconfirmedChange={setDropoffHasUnconfirmedEdits}
              />
            </section>

            <section className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/70 p-2 shadow-2xl shadow-black/20 sm:p-3">
              <RideMap
                pickup={pickup}
                dropoff={dropoff}
                route={route}
                selectionMode={selectionMode}
                onMapClick={handleMapSubmit}
                focusLocation={dropoff ?? pickup}
              />
            </section>
          </section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20 xl:sticky xl:top-6 sm:p-6" aria-label="Ride summary">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-lime-200 text-neutral-950">
                <CarFront className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Ride summary</h2>
                <p className="text-sm text-neutral-400">Review before requesting</p>
              </div>
            </div>

            <div className="space-y-4 py-5">
              {[
                { label: 'Pickup', location: pickup, icon: Circle, iconClass: 'text-lime-200' },
                { label: 'Destination', location: dropoff, icon: MapPin, iconClass: 'text-rose-300' },
              ].map(({ label, location, icon: Icon, iconClass }) => (
                <div key={label} className="flex gap-3">
                  <Icon className={`mt-0.5 size-4 shrink-0 ${iconClass}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</p>
                    <p className="mt-1 truncate text-sm font-medium text-neutral-200">{location?.label || 'Not selected'}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                <span className="text-sm text-neutral-400">Distance</span>
                <span className="text-sm font-semibold text-white">{routeDistance}</span>
              </div>
            </div>

            {isLoadingRoute && <p className="mb-4 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-neutral-300"><Spinner label="Finding driving route" />Finding driving route…</p>}
            {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-white">Ride type</legend>
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/25 p-1.5">
                {[
                  { value: 'solo', label: 'Solo', description: 'Just for you' },
                  { value: 'shared', label: 'Shared', description: 'Split the fare' },
                ].map((option) => {
                  const isSelected = rideType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        if (option.value !== rideType) {
                          startNewDraft();
                          clearCurrentDraftFeedback();
                          setRideType(option.value);
                        }
                      }}
                      className={`rounded-xl px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 ${isSelected ? 'bg-lime-200 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className="mt-0.5 block text-xs opacity-75">{option.description}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={handleCreateRide}
              disabled={!canCreateRide || isCreatingRide}
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-lime-200 px-4 py-3 text-sm font-bold text-neutral-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isCreatingRide ? 'Creating ride…' : `Request ${rideType} ride`}
            </button>

            {creationError && <p role="alert" className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{submissionDraftId === activeDraftId ? creationError : `Previous request: ${creationError}`}</p>}
            {createdRide && <p role="status" className="mt-3 flex gap-2 rounded-xl border border-lime-200/20 bg-lime-200/10 px-3 py-2.5 text-sm text-lime-100"><CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{submissionDraftId === activeDraftId ? 'Your' : 'Your previous'} {submittedRideType} ride has been created.</p>}

            <button
              type="button"
              onClick={() => {
                startNewDraft();
                setPickup(null);
                setDropoff(null);
                invalidateRoute();
                setError('');
                setPickupHasUnconfirmedEdits(false);
                setDropoffHasUnconfirmedEdits(false);
                setSelectionMode('pickup');
              }}
              className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset locations
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}
