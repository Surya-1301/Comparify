import { getMapplsKey } from '../../../lib/mappls';

export default async function handler(req, res) {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

  // Mappls reverse geocode (primary)
  const key = getMapplsKey();
  if (key) {
    try {
      const response = await fetch(
        `https://atlas.mappls.com/api/places/geocode?lat=${lat}&lng=${lon}`,
        { headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' } }
      );
      if (response.ok) {
        const json = await response.json();
        const r = (json.results || [])[0] || {};
        const name = r.formatted_address
          || [r.locality || r.subLocality, r.city || r.district].filter(Boolean).join(', ')
          || 'Current location';
        return res.status(200).json({
          ok: true,
          pincode: r.pincode || null,
          city: r.city || r.district || null,
          state: r.state || null,
          name,
        });
      }
    } catch (err) {
      console.error('Mappls reverse geocode error:', err);
    }
  }

  // Fallback: OpenStreetMap Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Comparify/1.0 (delivery-comparison-app)',
          'Accept-Language': 'en'
        }
      }
    );
    if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);

    const data = await response.json();
    const address = data.address || {};
    const pincode = address.postcode || null;
    const city = address.city || address.town || address.village || address.suburb || address.county || null;
    const state = address.state || null;
    const parts = (data.display_name || '').split(',');
    const name = parts.length > 1 ? `${parts[0].trim()}, ${parts[1].trim()}` : (parts[0] || 'Current location');

    return res.status(200).json({ ok: true, pincode, city, state, name });
  } catch (err) {
    console.error('Reverse geocode error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to reverse geocode' });
  }
}
