
import React from 'react';
import Layout from '../../components/Layout';
import AdminForm from '../../components/AdminForm';
import { getSession } from 'next-auth/react';

export default function NewPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold">New Comparison</h1>
        <div className="mt-6">
          <AdminForm onSaved={(data) => { window.location.href = `/admin/edit/${data.id}` }} />
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
  return { props: {} };
}
