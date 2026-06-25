
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ComparisonTable({ tools = [], comparisonTable = [] }) {
  const rowVariants = { hidden: { opacity: 0, y: 8 }, visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.04 } }) };
  return (
    <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
      <table className="min-w-full table-fixed">
        <thead className="bg-white sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left font-medium w-56">Feature</th>
            {tools.map(t => (
              <th key={t.id} className="px-4 py-3 text-left font-medium">
                <div className="flex items-center gap-2">
                  {t.logo && <img src={t.logo} alt="" className="w-6 h-6 object-contain" />}
                  <a href={t.website} target="_blank" rel="noreferrer" className="underline">{t.name}</a>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {comparisonTable.map((row, idx) => (
              <motion.tr key={row.feature} custom={idx} initial="hidden" animate="visible" variants={rowVariants} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-4 align-top font-medium w-56">{row.feature}</td>
                {row.values.map((val, i) => <td key={i} className="px-4 py-4 align-top">{val}</td>)}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
