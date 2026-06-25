
import React, { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { motion } from 'framer-motion';

export default function Hero() {
  const defaultApps = [
    { id: 'blinkit', name: 'Blinkit', time: '—', price: '—', color: 'bg-yellow-400 text-yellow-900' },
    { id: 'instamart', name: 'Instamart', time: '—', price: '—', color: 'bg-orange-500 text-white' },
    { id: 'zepto', name: 'Zepto', time: '—', price: '—', color: 'bg-violet-700 text-white' },
    { id: 'jiomart', name: 'JioMart', time: '—', price: '—', color: 'bg-sky-500 text-white' },
    { id: 'flipkart', name: 'Flipkart', time: '—', price: '—', color: 'bg-pink-600 text-white' },
    { id: 'bigbasket', name: 'BigBasket', time: '—', price: '—', color: 'bg-lime-500 text-white' },
  ];

  const [apps, setApps] = useState(defaultApps);
  const [loading, setLoading] = useState(false);

  const { location } = useLocation();

  useEffect(() => {
    let mounted = true;
    let controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (location?.id) qs.set('location', location.id);
        if (location?.lat) qs.set('lat', String(location.lat));
        if (location?.lon) qs.set('lon', String(location.lon));
        if (location?.pincode) qs.set('pincode', String(location.pincode));
        const res = await fetch(`/api/prices?${qs}`, { signal: controller.signal });
        const json = await res.json();
        if (!mounted) return;
        if (json.ok && json.data) {
          const map = {
            zepto: 'zepto',
            blinkit: 'blinkit',
            bigbasket: 'bigbasket',
            swiggy: 'swiggy',
            instamart: 'instamart',
            jiomart: 'jiomart',
            flipkart: 'flipkart'
          };
          setApps(prev => prev.map(a => {
            const key = map[a.id];
            if (!key) return a;
            const d = json.data[key];
            if (!d) return a;
            return { ...a, time: d.minutes || a.time, price: d.price || a.price };
          }));
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('fetch prices error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      controller.abort();
      controller = new AbortController();
      load();
    }, 5 * 60 * 1000);

    return () => { mounted = false; controller.abort(); clearInterval(interval); };
  }, [location?.id]);

  return (
    <section className="flex flex-col items-center justify-center py-20">
      <div className="max-w-2xl w-full text-center">
        <div className="mx-auto w-40 h-40 rounded-full bg-gradient-to-tr from-slate-800/40 to-indigo-900/40 flex items-center justify-center mb-6">
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white opacity-90">
            <circle cx="10" cy="10" r="5" stroke="#d1d5db" strokeWidth="1.5" fill="#0ea5a4" />
            <path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold">Compare Everything!</h1>
        <p className="mt-2 text-gray-300">Find the best deals across</p>

        <div className="mt-8 grid grid-cols-3 gap-3 justify-center">
          {apps.map((a, idx) => {
            const timeVal = a.time;
            const timeText = (typeof timeVal === 'number') ? `${timeVal} mins` : (String(timeVal || '').includes('min') ? String(timeVal) : (timeVal && timeVal !== '—' ? `${timeVal} mins` : timeVal));
            return (
              <div key={a.name} className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl shadow-md ${a.color} ${idx === 6 ? 'opacity-80' : ''}`}>
                <div className="font-semibold text-sm">{a.name}</div>
                <div className="text-sm mt-1 font-medium">{timeText || '—'}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="inline-flex items-center gap-2 bg-white/6 border border-white/5 text-sm text-gray-200 py-2 px-4 rounded-full shadow">🚚 Delivery times for your area {loading ? '· updating…' : ''}</div>
        </div>
      </div>
    </section>
  );
}
