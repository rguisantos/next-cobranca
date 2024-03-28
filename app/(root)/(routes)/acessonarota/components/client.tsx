'use client';

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, Column } from "./columns";
import { useEffect, useState } from "react";
import { fetchWrapper } from "@/helpers/fetch-wrapper";

export const Client: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([] as Column[]);

  useEffect(() =>{
    fetchWrapper.get('/api/acessonarota').then(data =>{
      setList(data.map((item:any) => {
        return {
          ...item,
          rota: item.rota.nome,
          usuario: item.usuario.nome
        }
      }
        ));
      setLoading(false);
    })
  },[]);

  const formattedList: Column[] = list.map(item => ({
    ...item,
    id: item.id,
    rotaId: item.rotaId,
    usuarioId: item.usuarioId,
    rota: item.rota,
    usuario: item.usuario,
  }));

  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Acessos a Rota (${list.length})`} description="Gerencie os Acessos a Rota" />
        <Button onClick={() => router.push(`/acessonarota/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>
      <Separator />
      {!loading && <DataTable searchKey="id" columns={columns} data={formattedList} />}
    </>
  );
};