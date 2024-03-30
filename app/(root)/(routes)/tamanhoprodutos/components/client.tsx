'use client';

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchWrapper } from "@/helpers/fetch-wrapper";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, Column } from "./columns";
import Loading from "../loading";

export const Client: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([] as Column[]);

  useEffect(() =>{
    fetchWrapper.get('/api/tamanhoprodutos').then(data =>{
      setList(data);
      setLoading(false);
    })
  },[]);

  if(loading)
    return(
      <Loading />
    );


  const formattedList: Column[] = list.map(item => ({
    id: item.id,
    medida: item.medida, // Add the missing 'medida' property
  }));

  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Tamanho do Produto (${list.length})`} description="Gerencie as Medidas/Tamanho" />
        <Button onClick={() => router.push(`/tamanhoprodutos/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>
      <Separator />
      {!loading && <DataTable searchKey="nome" columns={columns} data={formattedList} />}
    </>
  );
};
