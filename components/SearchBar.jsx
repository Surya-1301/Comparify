import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useLocation } from '../context/LocationContext';
import ProviderChip from './ProviderChip';

export default function SearchBar({ placeholder = 'Search for products to compare prices' }) {
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { location } = useLocation();
  const timerRef = useRef(null);
  const acRef = useRef(null);
  const inputRef = useRef(null);

  function submit(e) {
    e && e.preventDefault();
    const query = (q || '').trim();
    router.push(query ? `/comparisons?q=${encodeURIComponent(query)}` : '/comparisons');
  }

  useEffect(() => {
    // Debounced live search calling /api/compare?q=...
    if (timerRef.current) clearTimeout(timerRef.current);
    if (acRef.current) acRef.current.abort();
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      acRef.current = new AbortController();
      try {
        const qs = location?.id ? `?q=${encodeURIComponent(q)}&location=${encodeURIComponent(location.id)}` : `?q=${encodeURIComponent(q)}`;
        const res = await fetch(`/api/compare${qs}`, { signal: acRef.current.signal });
        const json = await res.json();
        if (json.ok && json.results && json.results.length) {
          setSuggestions(json.results);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('compare fetch error', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (acRef.current) acRef.current.abort();
    };
  }, [q, location?.id]);

  function chooseResult(r) {
    // navigate to comparisons with q and optionally show provider
    router.push(`/comparisons?q=${encodeURIComponent(r.title)}`);
  }

  return (
    <div className="mx-auto max-w-4xl w-full px-4 relative">
      <form onSubmit={submit} className="">
        <div className="w-full flex items-center bg-[#0b2133] border border-white/6 rounded-full px-4 py-3 shadow-sm">
          <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"></path></svg>
          <input
            ref={inputRef}
            aria-label="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 outline-none"
          />
          <button type="submit" className="ml-3 inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full">
            Search
          </button>
        </div>
      </form>

      { (suggestions && suggestions.length > 0) && (
        <div className="absolute left-4 right-4 mt-2 bg-[#071026] border border-white/6 rounded-lg shadow-lg z-40">
          {suggestions.map((r) => (
            <div key={r.id} onClick={() => chooseResult(r)} className="px-4 py-3 hover:bg-white/6 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-100">{r.title}</div>
                <div className="text-xs text-gray-400">{r.providers.length} providers</div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {r.providers.slice(0,6).map(p => (
                  <div key={p.provider} className="col-span-1">
                    <ProviderChip provider={p.provider} minutes={p.minutes} price={p.price} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="px-4 py-3 border-t border-white/6">
            <button onClick={() => router.push(`/comparisons?q=${encodeURIComponent(q)}`)} className="text-sm text-indigo-400">See all results for "{q}"</button>
          </div>
        </div>
      )}
    </div>
  );
}
