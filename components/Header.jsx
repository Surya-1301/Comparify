
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LocationSelector from './LocationSelector';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-transparent/10 backdrop-blur border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" strokeLinecap="round" />
            </svg>
          </div>
          <Link href="/" className="font-semibold text-lg text-white">Compare Everything!</Link>
        </motion.div>
        <div className="flex items-center gap-6">
          <LocationSelector />
          <a href="#features" className="hidden md:block hover:text-indigo-300 text-gray-300">Features</a>
          <Link href="/comparisons" className="hidden md:block hover:text-indigo-300 text-gray-300">Comparisons</Link>
          <Link href="/about" className="hidden md:block hover:text-indigo-300 text-gray-300">About</Link>
        </div>
      </nav>
    </header>
  );
}
