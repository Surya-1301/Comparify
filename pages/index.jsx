
import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ComparisonCard from '../components/ComparisonCard';
import comparisonsData from '../data/comparisons.json';

export default function Home() {
  return (
    <Layout>
      <Hero />
      {/* Popular comparisons removed per request */}
    </Layout>
  );
}
