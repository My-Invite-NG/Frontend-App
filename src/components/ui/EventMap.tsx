"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";
import { useMemo } from "react";
import { GOOGLE_MAPS_LIBRARIES } from "@/lib/maps";

interface EventMapProps {
  lat?: number;
  lng?: number;
  locationName?: string;
  className?: string;
}

export default function EventMap({ lat, lng, locationName, className = "w-full h-48 md:h-64 rounded-xl" }: EventMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const center = useMemo(() => ({
    lat: lat || 37.7749, // Default to San Francisco
    lng: lng || -122.4194
  }), [lat, lng]);

  if (!isLoaded) {
      return (
          <div className={`${className} bg-gray-100 flex items-center justify-center border border-gray-200`}>
              <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm">Loading Map...</span>
              </div>
          </div>
      );
  }

  // If no coordinates provided yet
  if (!lat || !lng) {
     return (
        <div className={`${className} bg-gray-100 flex items-center justify-center border border-gray-200`}>
            <div className="flex flex-col items-center gap-2 text-gray-400">
                <MapPin className="w-6 h-6" />
                <span className="text-sm">Map Preview</span>
            </div>
        </div>
     );
  }

  return (
     <div className={`${className} overflow-hidden border border-gray-200 relative`}>
        <GoogleMap
            mapContainerClassName="w-full h-full"
            center={center}
            zoom={15}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
            }}
        >
            <MarkerF position={center} title={locationName} />
        </GoogleMap>
     </div>
  );
}
