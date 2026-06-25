import { scrapeAll } from '../../lib/scrapers';

export default async function handler(req, res) {
  const { location: locationId, lat, lon, pincode } = req.query;
  const location = {
    id: locationId || 'default',
    lat: lat ? parseFloat(lat) : null,
    lon: lon ? parseFloat(lon) : null,
    pincode: pincode || null,
  };
  try {
    const data = await scrapeAll(location);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('price scrape error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
}
