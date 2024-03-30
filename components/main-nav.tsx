'use client';

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const routes: { title: string; href: string, childs?: { title: string; href: string; description: string }[] }[] = [
  {
    href: `/`,
    title: 'Início',
  },
  {
    href: `/clientes`,
    title: 'Clientes',
  },
  {
    href: `/produtos`,
    title: 'Produtos',
    childs:[
      {
        href: `/produtos`,
        title: 'Produtos',
        description: 'Gerencie os Produtos'
      },
      {
        href: `/tipoprodutos`,
        title: 'Tipos de Produto',
        description: 'Gerencie os Tipos de Produto'
      },
      {
        href: `/corprodutos`,
        title: 'Cores dos produtos',
        description: 'Gerencie as Cores dos produtos'
      },
      {
        href: `/tamanhoprodutos`,
        title: 'Tamanhos dos produtos',
        description: 'Gerencie os Tamanhos dos produtos'
      },
    ]
  },
  {
    href: `/usuarios`,
    title: 'Usuários',
    childs:[
      {
        href: `/usuarios`,
        title: 'Usuários',
        description: 'Gerencie os Usuários'
      },
      {
        href: `/acessonarota`,
        title: 'Acessos',
        description: 'Gerencie os Acessos'
      },
    ]
  },
  {
    href: `/rotas`,
    title: 'Rotas',
  },
  
  {
    href: `/locacoes`,
    title: 'Locações',
  },
]

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {routes.map((route) => {
          if (route.childs && route.childs.length > 0) {
            return (
              <NavigationMenuItem key={route.title}>
                <NavigationMenuTrigger>{route.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {route.childs?.map((child) => (
                      <ListItem
                        key={route.title + child.title}
                        title={child.title}
                        href={child.href}
                      >
                        {child.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>)
          }
          return (
            <NavigationMenuItem key={route.title}>
              <Link href={route.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {route.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>)
        }
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href!}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


export function MainNav2({
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