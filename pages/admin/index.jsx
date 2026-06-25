
import React from 'react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AdminPage({ comparisons }) {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin — Comparisons</h1>
          <Link href="/admin/new" className="px-3 py-2 bg-indigo-600 text-white rounded">New Comparison</Link>
        </div>

        <div className="mt-6 space-y-4">
          {comparisons.map(c => (
            <div key={c.id} className="bg-white p-4 rounded shadow-sm flex justify-between items-center">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-gray-500">{c.slug}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/edit/${c.id}`} className="px-3 py-2 border rounded">Edit</Link>
                <button onClick={async () => { if (!confirm('Delete this comparison?')) return; const res = await fetch(`/api/comparisons/${c.id}`, { method: 'DELETE' }); if (res.ok) window.location.reload(); }} className="px-3 py-2 bg-red-50 text-red-600 border rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) return { redirect: { destination: '/api/auth/signin', permanent: false } };
  const allowed = (process.env.ADMIN_USERS || '').split(',').map(s => s.trim());
  if (!allowed.includes(session.user.email)) return { redirect: { destination: '/', permanent: false } };

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/comparisons`);
  const comparisons = await res.json();
  return { props: { comparisons } };
}
