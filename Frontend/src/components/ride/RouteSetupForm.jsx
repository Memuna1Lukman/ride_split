import LocationSearchInput from "./LocationSearchInput";

export default function RouteSetupForm({ pickup, dropoff, onPickupSelect, onDropoffSelect, onPickupUnconfirmedChange, onDropoffUnconfirmedChange }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <LocationSearchInput
        key={pickup?.label ?? "pickup"}
        label="Pickup"
        placeholder="Search a city, landmark, or address in Ghana"
        value={pickup}
        onSelect={onPickupSelect}
        onUnconfirmedChange={onPickupUnconfirmedChange}
      />
      <LocationSearchInput
        key={dropoff?.label ?? "dropoff"}
        label="Destination"
        placeholder="Where are you going?"
        value={dropoff}
        onSelect={onDropoffSelect}
        onUnconfirmedChange={onDropoffUnconfirmedChange}
      />
    </section>
  );
}
