"use client";

import { FormEvent, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import toast from "react-hot-toast";

import { AddressFormValues } from "@/lib/address";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LocationAddress = Pick<
  AddressFormValues,
  "address" | "city" | "state" | "pinCode" | "country" | "latitude" | "longitude"
>;

interface LocationPickerProps {
  onSelect: (address: Partial<LocationAddress>) => void;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

interface NominatimPlace {
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
}

const mapPlaceToAddress = (place: NominatimPlace): LocationAddress => {
  const parts = [
    place.address?.house_number,
    place.address?.road || place.address?.pedestrian,
    place.address?.neighbourhood || place.address?.suburb,
  ].filter(Boolean);

  return {
    address: parts.join(", ") || place.display_name,
    city: place.address?.city || place.address?.town || place.address?.village || "",
    state: place.address?.state || "",
    pinCode: place.address?.postcode || "",
    country: place.address?.country || "India",
    latitude: Number(place.lat),
    longitude: Number(place.lon),
  };
};

const reverseGeocode = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
  );

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  return (await response.json()) as NominatimPlace;
};

const LocationPicker = ({ onSelect }: LocationPickerProps) => {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<NominatimPlace[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Your browser does not support location detection");
      return;
    }

    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      toast.error("Current location requires HTTPS in this browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const place = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          onSelect(mapPlaceToAddress(place));
          toast.success("Address filled from your current location");
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          toast.error("We found your location but could not read the address");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied"
            : error.code === error.TIMEOUT
              ? "Location request timed out"
              : "Unable to get your current location";
        toast.error(message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Location search failed");
      }

      const results = (await response.json()) as NominatimPlace[];
      setPlaces(results);
      if (!results.length) {
        toast.error("No matching locations found");
      }
    } catch (error) {
      console.error("Location search failed:", error);
      toast.error("Unable to search locations right now");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border bg-gray-50 p-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="justify-start"
        >
          {isLocating ? <Loader2 className="animate-spin" /> : <MapPin />}
          Use My Current Location
        </Button>
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search location"
            className="bg-white"
          />
          <Button type="submit" variant="outline" disabled={isSearching} size="icon">
            {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="sr-only">Search location</span>
          </Button>
        </form>
      </div>

      {places.length > 0 && (
        <div className="space-y-2">
          {places.map((place) => (
            <button
              key={`${place.lat}-${place.lon}`}
              type="button"
              onClick={() => {
                onSelect(mapPlaceToAddress(place));
                setPlaces([]);
                setQuery(place.display_name);
                toast.success("Location selected");
              }}
              className="w-full rounded-md border bg-white p-2 text-left text-sm hover:border-shop_dark_green hover:text-shop_dark_green"
            >
              {place.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
