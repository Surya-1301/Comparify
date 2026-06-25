import { scrapeAll } from '../../lib/scrapers';

// Simple compare API: returns provider prices & minutes for a given query and location.
// Currently mocked using lib/scrapers; later this can use product-specific scraping.
export default async function handler(req, res) {
  const q = (req.query.q || '').trim();
  const location = req.query.location || 'default';
  if (!q) return res.status(200).json({ ok: true, query: q, results: [] });

  try {
    const data = await scrapeAll(location);

    // Build a simple results array: one item for this query with provider data
    const providers = Object.keys(data).map(key => ({
      provider: key,
      minutes: data[key].minutes,
      price: data[key].price
    }));

    const results = [
      {
        id: q.toLowerCase().replace(/\s+/g, '_'),
        title: q,
        providers
      }
    ];

    res.status(200).json({ ok: true, query: q, location, results });
  } catch (err) {
    console.error('compare api error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
}
