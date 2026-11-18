import LocationSearchInput from "./LocationSearchInput";

export default function RouteSetupForm({ pickup, dropoff, onPickupSelect, onDropoffSelect }) {
  return (
    <section className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-2">
      <LocationSearchInput
        key={pickup?.label ?? "pickup"}
        label="Pickup"
        placeholder="Search a city, landmark, or address in Ghana"
        value={pickup}
        onSelect={onPickupSelect}
      />
      <LocationSearchInput
        key={dropoff?.label ?? "dropoff"}
        label="Destination"
        placeholder="Where are you going?"
        value={dropoff}
        onSelect={onDropoffSelect}
      />
    </section>
  );
}
