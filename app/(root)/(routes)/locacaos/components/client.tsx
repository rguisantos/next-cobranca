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
    fetchWrapper.get('/api/locacaos').then(data =>{
      setList(data);
      setLoading(false);
    })
  },[]);
  
  
  const formattedList: Column[] = list.map(item => ({
    ...item,
    id: item.id,
    plaqueta: item.plaqueta,
    cliente: item.cliente,
    rota: item.rota,
  }));
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Locações (${list.length})`} description="Gerencie as Locações" />
        <Button onClick={() => router.push(`/locacaos/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>
      <Separator />
      {!loading && <DataTable searchKey="nome" columns={columns} data={formattedList} />}
    </>
  );
};