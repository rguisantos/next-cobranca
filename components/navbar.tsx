'use client'
// import { UserButton, auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenuUser } from "./dropdown-menu-user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export const Navbar: React.FC = () => {
  const [usuario, setUsuario] = useState<{ nome: string } | null>(null);
  const router = useRouter();
  useEffect(() => {
    const user = () => {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('user')!) as { nome : string };
      }
      return null;
    }

    const currentUser = user();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUsuario(currentUser);
    }
  }, []);

  const onClickLogout = () => { 
    router.push('/login');
  }
  return usuario ? ( 
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <DropdownMenuUser usuario={usuario} onClickLogout={onClickLogout}>
            <Avatar>
              <AvatarFallback>{usuario.nome.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuUser>
        </div>
      </div>
    </div>
  ) : null;
};
 
export default Navbar;
