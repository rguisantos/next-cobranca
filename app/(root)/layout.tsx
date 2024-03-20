import { redirect } from 'next/navigation';
import { auth, clerkClient } from '@clerk/nextjs';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <>
      {children}
    </>
  );
};
