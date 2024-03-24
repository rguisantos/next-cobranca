'use client'
// import { UserButton, auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenuUser } from "./dropdown-menu-user";
import { useRouter } from "next/navigation";

export const Navbar: React.FC = async () => {

  const user =  () => {
    return JSON.parse(localStorage.getItem('user')!) as { nome : string };
  }

  const router = useRouter();
  if (!user()) {
    router.push('/login');
    return;
  }

  const onClickLogout = () => { 
    router.push('/login');
  }
  return ( 
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <DropdownMenuUser usuario={user()} onClickLogout={onClickLogout}>
            <Avatar>
              <AvatarFallback>{user()?.nome.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuUser>
        </div>
      </div>
    </div>
  );
};
 
export default Navbar;
