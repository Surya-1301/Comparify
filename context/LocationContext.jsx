import React, { createContext, useContext, useEffect, useState } from 'react';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const defaultLocation = { name: 'Connaught Place, Delhi', id: 'connaught', lat: 28.6329, lon: 77.1845, pincode: '110001' };
  const [location, setLocation] = useState(defaultLocation);

  // On first mount: restore saved location, otherwise try GPS auto-detect
  useEffect(() => {
    let hasLocal = false;
    try {
      const raw = localStorage.getItem('cf_location');
      if (raw) {
        setLocation(JSON.parse(raw));
        hasLocal = true;
      }
    } catch (e) {}

    if (!hasLocal && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const res = await fetch(`/api/locations/reverse?lat=${lat}&lon=${lon}`);
            const json = await res.json();
            if (json.ok) {
              setLocation({
                id: `coords_${lat.toFixed(4)}_${lon.toFixed(4)}`,
                name: json.name || 'Current location',
                lat,
                lon,
                pincode: json.pincode || null,
                city: json.city || null,
                state: json.state || null,
              });
            }
          } catch (_) {}
        },
        () => {} // silently ignore if user denies
      );
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cf_location', JSON.stringify(location));
    } catch (e) {
      // no-op if storage not available
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}

export default LocationContext;
