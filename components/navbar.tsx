import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ClinicaSwitcher from "@/components/clinica-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const clinicas = await prismadb.clinica.findMany({
    where: {
      userId,
    }
  });

  return ( 
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <ClinicaSwitcher items={clinicas} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
 
export default Navbar;
