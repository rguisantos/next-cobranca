'use client';

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { fetchWrapper } from "@/helpers/fetch-wrapper";
import { columns, Column } from "./columns";

export const Client: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([] as Column[]);

  useEffect(() =>{
    fetchWrapper.get('/api/corprodutos').then(data =>{
      setList(data);
      setLoading(false);
    })
  },[]);


  const formattedList: Column[] = list.map(item => ({
    id: item.id,
    nome: item.nome,
  }));

  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Cores de Produtos (${list.length})`} description="Gerencie as cores de produtos" />
        <Button onClick={() => router.push(`/corprodutos/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>
      <Separator />
      {!loading && <DataTable searchKey="nome" columns={columns} data={formattedList} />}
    </>
  );
};