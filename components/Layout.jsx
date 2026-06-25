
import React from 'react';
import Head from 'next/head';
import Header from './Header';
import SearchBar from './SearchBar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#071026] text-gray-100 antialiased">
      <Head><title>Compare Everything!</title></Head>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="pt-3">
          <SearchBar />
        </div>
        <div className="mt-6">{children}</div>
      </main>
      <footer aria-hidden className="mt-20">
        <div className="max-w-6xl mx-auto px-6">© {new Date().getFullYear()} Compare Everything!</div>
      </footer>

      {/* Bottom nav (mobile-style) */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-50">
        <div className="bg-[#07162a]/90 border border-white/6 rounded-2xl px-3 py-2 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <a href="#" className="flex-1 text-center px-4 py-5 rounded-lg ring-2 ring-transparent hover:bg-white/2">
              <svg className="mx-auto h-6 w-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4m13-4l2 4M6 21a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2z"></path></svg>
              <div className="mt-1 text-sm font-medium text-sky-400">Groceries</div>
            </a>

            <a href="#" className="flex-1 text-center px-4 py-5 rounded-lg hover:bg-white/2">
              <svg className="mx-auto h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h2l1 2h12l1-2h2M7 21h10M5 7h14"></path></svg>
              <div className="mt-1 text-sm font-medium text-gray-300">Cabs</div>
            </a>

            <a href="#" className="flex-1 text-center px-4 py-5 rounded-lg hover:bg-white/2">
              <svg className="mx-auto h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div className="mt-1 text-sm font-medium text-gray-300">Settings</div>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
