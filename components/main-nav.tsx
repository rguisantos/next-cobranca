'use client';

import Link from "next/link"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/`,
      label: 'Visão Geral',
      active: pathname === `/`,
    },
    {
      href: `/clientes`,
      label: 'Clientes',
      active: pathname === `/clientes`,
    },
    {
      href: `/produtos`,
      label: 'Produtos',
      active: pathname === `/produtos`,
    },
    {
      href: `/usuarios`,
      label: 'Usuários',
      active: pathname === `/usuarios`,
    },
    {
      href: `/rotas`,
      label: 'Rotas',
      active: pathname === `/rotas`,
    },
    {
      href: `/acessonarota`,
      label: 'Acessos',
      active: pathname === `/acessonarota`,
    },
    {
      href: `/locacoes`,
      label: 'Locações',
      active: pathname === `/locacoes`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};