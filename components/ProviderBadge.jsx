import React from 'react';

const BADGE_STYLES = {
  Blinkit: 'bg-yellow-400 text-gray-900',
  Instamart: 'bg-orange-500 text-white',
  Zepto: 'bg-purple-600 text-white',
  JioMart: 'bg-sky-400 text-white',
  Flipkart: 'bg-pink-500 text-white',
  BigBasket: 'bg-lime-400 text-gray-900',
  Swiggy: 'bg-red-500 text-white',
  Default: 'bg-gray-600 text-white'
};

export default function ProviderBadge({ provider = 'Provider' }) {
  const style = BADGE_STYLES[provider] || BADGE_STYLES.Default;
  return (
    <span className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold ${style}`}>
      {provider}
    </span>
  );
}
