
import React, { useState } from 'react';

export default function AdminForm({ initial = {}, onSaved }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    slug: initial.slug || '',
    shortDescription: initial.shortDescription || '',
    tools: initial.tools || [],
    comparisonTable: initial.comparisonTable || [],
  });
  const [loading, setLoading] = useState(false);

  const updateField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  async function save() {
    setLoading(true);
    try {
      const method = initial.id ? 'PUT' : 'POST';
      const url = initial.id ? `/api/comparisons/${initial.id}` : '/api/comparisons';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      onSaved?.(data);
    } catch (err) {
      alert(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <label className="block">Title
        <input value={form.title} onChange={e => updateField('title', e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
      </label>

      <label className="block mt-4">Slug
        <input value={form.slug} onChange={e => updateField('slug', e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
      </label>

      <label className="block mt-4">Short Description
        <textarea value={form.shortDescription} onChange={e => updateField('shortDescription', e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
      </label>

      <label className="block mt-4">Tools (JSON)
        <textarea value={JSON.stringify(form.tools, null, 2)} onChange={e => { try { updateField('tools', JSON.parse(e.target.value || '[]')) } catch{} }} className="mt-1 w-full border px-3 py-2 rounded h-28" />
      </label>

      <label className="block mt-4">Comparison table (JSON)
        <textarea value={JSON.stringify(form.comparisonTable, null, 2)} onChange={e => { try { updateField('comparisonTable', JSON.parse(e.target.value || '[]')) } catch{} }} className="mt-1 w-full border px-3 py-2 rounded h-36" />
      </label>

      <div className="mt-4 flex gap-3">
        <button onClick={save} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}
