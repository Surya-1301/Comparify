
import React from 'react';
import fs from 'fs';
import path from 'path';
import Layout from '../../components/Layout';
import { ComparisonTable } from '../../components/ComparisonTable';

export default function ComparisonPage({ comparison }) {
  if (!comparison) return <div className="p-8">Not found</div>;
  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold">{comparison.title}</h1>
        <p className="mt-2 text-gray-600">{comparison.shortDescription}</p>
        <div className="mt-6">
          <ComparisonTable tools={comparison.tools} comparisonTable={comparison.comparisonTable} />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const dataPath = path.join(process.cwd(), 'data', 'comparisons.json');
  const file = fs.readFileSync(dataPath, 'utf8');
  const items = JSON.parse(file);
  const paths = items.map(it => ({ params: { slug: it.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const dataPath = path.join(process.cwd(), 'data', 'comparisons.json');
  const file = fs.readFileSync(dataPath, 'utf8');
  const items = JSON.parse(file);
  const comparison = items.find(it => it.slug === params.slug) || null;
  return { props: { comparison } };
}
