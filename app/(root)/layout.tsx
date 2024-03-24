// import { redirect } from 'next/navigation';
// import { auth } from '@clerk/nextjs';

import Navbar from '@/components/navbar'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
