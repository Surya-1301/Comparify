import React from 'react';

const PROVIDER_STYLES = {
  Blinkit: 'bg-yellow-400 text-gray-900',
  Instamart: 'bg-orange-500 text-white',
  Zepto: 'bg-purple-600 text-white',
  JioMart: 'bg-sky-400 text-white',
  Flipkart: 'bg-pink-500 text-white',
  BigBasket: 'bg-lime-400 text-gray-900',
  Swiggy: 'bg-red-500 text-white',
  Default: 'bg-gray-700 text-white'
};

export default function ProviderChip({ provider = 'Provider', minutes, price }) {
  const style = PROVIDER_STYLES[provider] || PROVIDER_STYLES.Default;

  return (
    <div className={`rounded-2xl p-4 text-center ${style}`}>
      <div className="font-semibold text-lg leading-none">{provider}</div>
      <div className="mt-2 text-sm opacity-90">{minutes ? `${minutes} mins · ${price}` : (price || 'Unavailable')}</div>
    </div>
  );
}
