'use client';

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, Column } from "./columns";

interface ClientProps {
  data: Column[];
}

export const Client: React.FC<ClientProps> = ({

  data
}) => {

  const router = useRouter();
  const pathname = usePathname();
  const routes = [
    {
      href: `/tipoprodutos`,
      label: 'Tipo de Produtos',
      active: pathname === `/tipoprodutos`,
    },
    {
      href: `/tamanhoprodutos`,
      label: 'Tamanho de Produtos',
      active: pathname === `/tamanhoprodutos`,
    },
    {
      href: `/corprodutos`,
      label: 'Cores de Produtos',
      active: pathname === `/corprodutos`,
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Produtos (${data.length})`} description="Gerencie os Produtos" />
        <nav
          className="flex gap-4"
        >
          {routes.map((route) => (
            <Button>
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
            </Button>
          ))}
        </nav>

        <Button onClick={() => router.push(`/produtos/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="plaqueta" columns={columns} data={data} />
    </>
  );
};
