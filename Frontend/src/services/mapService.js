// Mapbox Geocoding v6 and Directions API calls.
const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
// This explicit deployment setting is the account-holder's confirmation that
// permanent Geocoding API storage is enabled for this Mapbox account.
const permanentGeocodingEnabled = import.meta.env.VITE_MAPBOX_PERMANENT_GEOCODING === "true";

function requireToken() {
    if (!token) {
        throw new Error("Add VITE_MAPBOX_ACCESS_TOKEN to Frontend/.env before using map search.");
    }
}

export async function searchGhanaPlaces(query) {
    requireToken();

    const url = new URL("https://api.mapbox.com/search/geocode/v6/forward");
    url.search = new URLSearchParams({
        q: query,
        country: "GH",
        language: "en",
        limit: "5",
        permanent: String(permanentGeocodingEnabled),
        access_token: token,
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not search places. Please try again.");

    const data = await response.json();
    return (data.features ?? []).flatMap((feature) => {
        const [longitude, latitude] = feature.geometry?.coordinates ?? [];
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
        const properties = feature.properties ?? {};
        const name = properties.name_preferred || properties.name || feature.name || "Selected location";
        const fullAddress = properties.full_address || feature.properties?.place_formatted || feature.place_formatted;
        return [{
            mapbox_id: properties.mapbox_id || feature.id,
            name,
            full_address: fullAddress,
            label: fullAddress || name,
            latitude,
            longitude,
            isPermanentGeocode: permanentGeocodingEnabled,
        }];
    });
}

export async function getDrivingRoute(pickup,dropoff){
    requireToken();
    const coordinates = [
        `${pickup.longitude},${pickup.latitude}`,
        `${dropoff.longitude},${dropoff.latitude}`
    ].join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}` +
      `?geometries=geojson&overview=full&access_token=${token}`;
    const response = await fetch(url);
    if (!response.ok){
        throw new Error("Could not calculate the route");
    }
    const data = await response.json();
    const route = data.routes?.[0];
    if (!route){
        throw new Error("No driving route was found");
    }
    return {
        geometry:route.geometry,
        distanceMeters:route.distance,
        durationSeconds:route.duration
    };
}
