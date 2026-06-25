
import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db();
      const items = await db.collection('comparisons')
        .find({})
        .sort({ publishedAt: -1 })
        .toArray();
      const normalized = items.map(d => ({ id: d._id.toString(), ...d }));
      return res.status(200).json(normalized);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to list comparisons' });
    }
  }

  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });
    const allowed = (process.env.ADMIN_USERS || '').split(',').map(s => s.trim());
    if (!allowed.includes(session.user.email)) return res.status(403).json({ error: 'Forbidden' });

    try {
      const payload = req.body;
      const client = await clientPromise;
      const db = client.db();
      payload.publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : new Date();
      const result = await db.collection('comparisons').insertOne(payload);
      return res.status(201).json({ id: result.insertedId.toString(), ...payload });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
}
