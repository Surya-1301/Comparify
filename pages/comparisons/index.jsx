import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProviderChip from '../../components/ProviderChip';
import ProviderBadge from '../../components/ProviderBadge';
import { useLocation } from '../../context/LocationContext';

export default function ComparisonsPage() {
  const router = useRouter();
  const { q } = router.query;
  const { location } = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    async function load() {
      if (!q || String(q).trim().length === 0) {
        setResults([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const qs = location?.id ? `?q=${encodeURIComponent(q)}&location=${encodeURIComponent(location.id)}` : `?q=${encodeURIComponent(q)}`;
        const res = await fetch(`/api/compare${qs}`, { signal: controller.signal });
        const json = await res.json();
        if (!mounted) return;
        if (json.ok) {
          setResults(json.results || []);
        } else {
          setError(json.error || 'Unknown error');
        }
      } catch (err) {
        if (err.name !== 'AbortError') setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; controller.abort(); };
  }, [q, location?.id]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Search results</h1>
        <div className="mt-2 text-sm text-gray-400">Query: <span className="font-medium text-gray-200">{q || '—'}</span></div>

        <div className="mt-6">
          {loading && <div className="text-sm text-gray-400">Loading...</div>}
          {error && <div className="text-sm text-red-400">{error}</div>}

          {!loading && results.length === 0 && !error && (
            <div className="text-gray-400">No results. Try a different search term.</div>
          )}

          <div className="mt-4 space-y-6">
            {results.map(r => (
              <div key={r.id} className="bg-white/5 p-4 rounded-2xl">
                <div className="md:flex md:items-start md:justify-between">
                  <div className="md:flex md:gap-4 md:items-center w-full">
                    <div className="w-28 h-28 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                      {r.image ? (
                        // image URL available
                        <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                      )}
                    </div>

                    <div className="mt-3 md:mt-0">
                      <div className="flex items-start gap-3">
                        <h3 className="text-xl font-semibold">{r.title}</h3>
                        <button className="ml-auto md:ml-6 inline-flex items-center gap-2 bg-white/6 text-white text-sm font-medium px-3 py-2 rounded-md">+ Compare</button>
                      </div>
                      <div className="mt-2 text-sm text-gray-400">{r.subtitle || ''}</div>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 md:w-40 md:flex md:flex-col md:items-end">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{r.bestPrice || '—'}</div>
                      <div className="text-xs text-gray-400">{r.bestPerUnit || ''}</div>
                    </div>
                    <div className="mt-3 hidden md:block">
                      <a href={`/comparisons/${r.id}`} className="inline-flex items-center text-sm text-indigo-300">Open <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h6m0 0v6m0-6L10 20"></path></svg></a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/6 pt-4 space-y-3">
                  {r.providers.map((p, idx) => (
                    <div key={`${p.provider}-${idx}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ProviderBadge provider={p.provider} />
                        <div>
                          <div className="text-sm font-medium text-gray-100">{p.variant || p.title || ''}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {p.inStock === false ? <span className="text-red-300">OUT OF STOCK</span> : (p.weight || '')}
                            {p.cheapest ? <span className="ml-2 inline-flex items-center bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">CHEAPEST</span> : null}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold">{p.price || '—'}</div>
                        <div className="text-xs text-gray-400">{p.perUnit || ''}</div>
                        {p.superPrice ? <div className="mt-1 text-xs bg-purple-600 text-white inline-block px-2 py-1 rounded">Super : {p.superPrice}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
