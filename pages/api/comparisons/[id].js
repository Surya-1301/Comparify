
import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('comparisons');

  if (req.method === 'GET') {
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ id: doc._id.toString(), ...doc });
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const allowed = (process.env.ADMIN_USERS || '').split(',').map(s => s.trim());
  if (!allowed.includes(session.user.email)) return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'PUT') {
    try {
      const payload = req.body;
      if (payload.publishedAt) payload.publishedAt = new Date(payload.publishedAt);
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: payload });
      const updated = await collection.findOne({ _id: new ObjectId(id) });
      return res.status(200).json({ id: updated._id.toString(), ...updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).end('Method Not Allowed');
}
