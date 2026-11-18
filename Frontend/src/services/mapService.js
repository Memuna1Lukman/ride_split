// Mapbox Search Box and Directions API calls.
const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function requireToken() {
    if (!token) {
        throw new Error("Add VITE_MAPBOX_ACCESS_TOKEN to Frontend/.env before using map search.");
    }
}

function newSearchSessionToken() {
    return crypto.randomUUID();
}

export { newSearchSessionToken };

export async function suggestGhanaPlaces(query, sessionToken) {
    requireToken();

    const url = new URL("https://api.mapbox.com/search/searchbox/v1/suggest");
    url.search = new URLSearchParams({
        q: query,
        country: "GH",
        language: "en",
        limit: "5",
        session_token: sessionToken,
        access_token: token,
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not search places. Please try again.");

    const data = await response.json();
    return data.suggestions ?? [];
}

export async function retrieveGhanaPlace(mapboxId, sessionToken) {
    requireToken();

    const url = new URL(`https://api.mapbox.com/search/searchbox/v1/retrieve/${encodeURIComponent(mapboxId)}`);
    url.search = new URLSearchParams({
        session_token: sessionToken,
        access_token: token,
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not select that place. Please try again.");

    const data = await response.json();
    const feature = data.features?.[0];
    if (!feature) throw new Error("That place did not include a usable location.");

    const [longitude, latitude] = feature.geometry.coordinates;
    const properties = feature.properties ?? {};

    return {
        label: properties.full_address || properties.name || "Selected location",
        latitude,
        longitude,
    };
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
