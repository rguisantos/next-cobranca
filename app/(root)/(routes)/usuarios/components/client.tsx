"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Usuários (${data.length})`} description="Gerencie os Usuários" />
        <Button onClick={() => router.push(`/usuarios/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nome" columns={columns} data={data} />
    </>
  );
};