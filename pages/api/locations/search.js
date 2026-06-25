import { getMapplsKey } from '../../../lib/mappls';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q || String(q).trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  // Mappls text search (primary)
  const key = getMapplsKey();
  if (key) {
    try {
      const response = await fetch(
        `https://atlas.mappls.com/api/places/textsearch/json?query=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' } }
      );
      if (response.ok) {
        const json = await response.json();
        const places = json.suggestedLocations || [];
        const results = places.slice(0, 8).map((place, idx) => ({
          id: `mappls_${place.eLoc || idx}`,
          name: [place.placeName, place.placeAddress].filter(Boolean).join(', '),
          lat: parseFloat(place.latitude),
          lon: parseFloat(place.longitude),
          pincode: place.pincode || null,
          city: place.city || null,
          state: place.state || null,
        }));
        return res.status(200).json({ ok: true, results });
      }
    } catch (err) {
      console.error('Mappls search error:', err);
    }
  }

  // Fallback: OpenStreetMap Nominatim (no API key needed)
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&countrycodes=in&limit=8`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Comparify/1.0 (delivery-comparison-app)',
        'Accept-Language': 'en'
      }
    });
    if (!response.ok) throw new Error(`Nominatim status ${response.status}`);

    const json = await response.json();
    const results = json.slice(0, 8).map((place, idx) => {
      const address = place.address || {};
      const parts = (place.display_name || '').split(',');
      const name = parts.length > 1
        ? `${parts[0].trim()}, ${parts[1].trim()}`
        : (parts[0] || 'Unknown');
      return {
        id: `nom_${idx}`,
        name,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        pincode: address.postcode || null,
        city: address.city || address.town || address.village || null,
        state: address.state || null
      };
    });
    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error('Nominatim search error:', err);
    return res.status(500).json({ ok: false, error: 'Location search failed' });
  }
}
