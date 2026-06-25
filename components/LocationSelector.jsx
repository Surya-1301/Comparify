import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../context/LocationContext';

const DEFAULT_LOCATIONS = [
  // Delhi NCR
  { id: 'connaught', name: 'Connaught Place, Delhi', lat: 28.6329, lon: 77.1845, pincode: '110001' },
  { id: 'lajpat', name: 'Lajpat Nagar, Delhi', lat: 28.5644, lon: 77.2512, pincode: '110024' },
  { id: 'rohini', name: 'Rohini, Delhi', lat: 28.7499, lon: 77.0599, pincode: '110085' },
  { id: 'dwarka', name: 'Dwarka, Delhi', lat: 28.5921, lon: 77.0460, pincode: '110075' },
  { id: 'gurgaon', name: 'Gurgaon, Haryana', lat: 28.4595, lon: 77.0266, pincode: '122001' },
  { id: 'noida', name: 'Noida, UP', lat: 28.5355, lon: 77.3910, pincode: '201301' },
  // Major metros
  { id: 'mumbai', name: 'Mumbai, Maharashtra', lat: 19.0760, lon: 72.8777, pincode: '400001' },
  { id: 'andheri', name: 'Andheri, Mumbai', lat: 19.1136, lon: 72.8697, pincode: '400053' },
  { id: 'bangalore', name: 'Bengaluru, Karnataka', lat: 12.9716, lon: 77.5946, pincode: '560001' },
  { id: 'koramangala', name: 'Koramangala, Bengaluru', lat: 12.9352, lon: 77.6245, pincode: '560034' },
  { id: 'hyderabad', name: 'Hyderabad, Telangana', lat: 17.3850, lon: 78.4867, pincode: '500001' },
  { id: 'banjara', name: 'Banjara Hills, Hyderabad', lat: 17.4156, lon: 78.4480, pincode: '500034' },
  { id: 'chennai', name: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707, pincode: '600001' },
  { id: 'kolkata', name: 'Kolkata, West Bengal', lat: 22.5726, lon: 88.3639, pincode: '700001' },
  { id: 'pune', name: 'Pune, Maharashtra', lat: 18.5204, lon: 73.8567, pincode: '411001' },
  { id: 'ahmedabad', name: 'Ahmedabad, Gujarat', lat: 23.0225, lon: 72.5714, pincode: '380001' },
  { id: 'jaipur', name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873, pincode: '302001' },
  { id: 'lucknow', name: 'Lucknow, UP', lat: 26.8467, lon: 80.9462, pincode: '226001' },
];

async function fetchPincode(lat, lon) {
  try {
    const res = await fetch(`/api/locations/reverse?lat=${lat}&lon=${lon}`);
    const json = await res.json();
    if (json.ok) return json;
  } catch (_) {}
  return null;
}

export default function LocationSelector() {
  const { location, setLocation } = useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const timerRef = useRef(null);
  const acRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (acRef.current) acRef.current.abort();

    if (!search || search.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    timerRef.current = setTimeout(async () => {
      acRef.current = new AbortController();
      try {
        const res = await fetch(
          `/api/locations/search?q=${encodeURIComponent(search)}`,
          { signal: acRef.current.signal }
        );
        const json = await res.json();
        setResults(json.ok && json.results ? json.results : []);
      } catch (err) {
        if (err.name !== 'AbortError') setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (acRef.current) acRef.current.abort();
    };
  }, [search]);

  async function pick(loc) {
    // If the location has no pincode, reverse-geocode to get one
    if (!loc.pincode && loc.lat && loc.lon) {
      const geo = await fetchPincode(loc.lat, loc.lon);
      if (geo) {
        loc = { ...loc, pincode: geo.pincode, city: geo.city, state: geo.state };
        if (!loc.name || loc.name === 'Current location') loc = { ...loc, name: geo.name };
      }
    }
    setLocation(loc);
    setOpen(false);
    setSearch('');
  }

  function useGeolocation() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        let loc = {
          id: `coords_${lat.toFixed(4)}_${lon.toFixed(4)}`,
          name: 'Current location',
          lat,
          lon,
          pincode: null,
        };
        // Reverse geocode to get pincode + area name
        const geo = await fetchPincode(lat, lon);
        if (geo) {
          loc = { ...loc, pincode: geo.pincode, city: geo.city, state: geo.state, name: geo.name || loc.name };
        }
        setLocation(loc);
        setGeoLoading(false);
        setOpen(false);
        setSearch('');
      },
      (err) => {
        setGeoError(err.message || 'Unable to fetch location');
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  const filtered = search.length === 0
    ? DEFAULT_LOCATIONS
    : results;

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/6 text-sm text-gray-200">
        <svg className="h-4 w-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21s8-4.5 8-10a8 8 0 10-16 0c0 5.5 8 10 8 10z"/>
        </svg>
        <span className="font-medium">{location?.name || 'Select area'}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-[#071026] border border-white/6 rounded-lg shadow-lg py-2 z-50">
          <div className="px-3 py-2">
            <input
              type="text"
              placeholder="Search any city or area in India…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/6 rounded-md px-2 py-1 text-sm text-gray-100 placeholder-gray-400 outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {searching && <div className="px-3 py-2 text-xs text-gray-400">Searching…</div>}
            {!searching && search.length > 0 && search.length < 2 && (
              <div className="px-3 py-2 text-xs text-gray-400">Type at least 2 characters</div>
            )}
            {!searching && search.length >= 2 && results.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400">No locations found</div>
            )}
            {!searching && filtered.map(l => (
              <button
                key={l.id}
                onClick={() => pick(l)}
                className="w-full text-left px-3 py-2 hover:bg-white/5 text-sm text-gray-100"
              >
                {l.name}
              </button>
            ))}
          </div>
          <div className="border-t border-white/6 mt-1 pt-1 px-2">
            <button onClick={useGeolocation} disabled={geoLoading} className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-sm text-gray-200">
              <svg className="h-4 w-4 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span>{geoLoading ? 'Getting location…' : 'Use current location'}</span>
            </button>
            {geoError && <div className="px-3 py-2 text-xs text-red-300">{geoError}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
