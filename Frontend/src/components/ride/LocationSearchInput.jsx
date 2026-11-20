import { useEffect, useState } from "react";
import { searchGhanaPlaces } from "../../services/mapService";
import EmptyState from "../ui/EmptyState";
import Input from "../ui/Input";
import Spinner from "../ui/Spinner";

export default function LocationSearchInput({ label, placeholder, value, onSelect, onUnconfirmedChange }) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const shouldSearch = query.trim().length >= 2 && query !== value?.label;

  useEffect(() => {
    onUnconfirmedChange?.(query !== (value?.label ?? ""));
  }, [onUnconfirmedChange, query, value?.label]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!shouldSearch) return undefined;

    let isCurrent = true;
    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setError("");
        const results = await searchGhanaPlaces(trimmedQuery);
        if (isCurrent) {
          setSuggestions(results);
          setHasSearched(true);
        }
      } catch (searchError) {
        if (isCurrent) setError(searchError.message);
      } finally {
        if (isCurrent) setIsSearching(false);
      }
    }, 300);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [query, shouldSearch]);

  function chooseSuggestion(suggestion) {
    try {
      setError("");
      onSelect(suggestion);
      setQuery(suggestion.label);
      setSuggestions([]);
    } catch (selectionError) {
      setError(selectionError.message);
    }
  }

  return (
    <div className="relative">
      <Input
        label={label}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setHasSearched(false);
          setSuggestions([]);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="[&_label]:text-neutral-300"
        inputClassName="border-white/10 bg-black/20 px-3 text-white placeholder-neutral-500 focus:border-lime-200 focus:ring-2 focus:ring-lime-200/25"
      />
      {isSearching && <span className="absolute right-3 top-9 text-neutral-400"><Spinner label="Searching locations" /></span>}
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}

      {shouldSearch && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 py-1 shadow-xl shadow-black/30">
          {suggestions.map((suggestion) => (
            <li key={suggestion.mapbox_id}>
              <button
                type="button"
                onClick={() => chooseSuggestion(suggestion)}
                className="w-full px-3 py-2.5 text-left text-sm hover:bg-white/5 focus:bg-white/5 focus:outline-none"
              >
                <span className="block font-semibold text-white">{suggestion.name}</span>
                <span className="block text-xs text-neutral-400">
                  {suggestion.full_address || suggestion.place_formatted}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {shouldSearch && hasSearched && !isSearching && !error && suggestions.length === 0 && (
        <div className="absolute z-20 mt-1 w-full">
          <EmptyState compact title="No locations found" description="Try a nearby landmark, city, or a more specific address." />
        </div>
      )}
    </div>
  );
}
