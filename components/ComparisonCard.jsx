
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ComparisonCard({ item }) {
  return (
    <motion.article layout whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{item.shortDescription}</p>
          <div className="mt-4 flex gap-3">
            <Link href={`/comparisons/${item.slug}`} className="px-3 py-2 rounded-md border">View</Link>
            <Link href={`/comparisons/${item.slug}#recommend`} className="px-3 py-2 rounded-md bg-indigo-600 text-white">Get recommendation</Link>
          </div>
        </div>
        <div className="w-36 flex flex-col items-end gap-2 text-right">
          <div className="text-xs text-gray-400">Tools</div>
          <div className="flex items-center gap-2">
            {item.tools && item.tools.slice(0,3).map(t => <img key={t.id} src={t.logo} alt={t.name} className="w-8 h-8 rounded-md object-contain bg-white" />)}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
