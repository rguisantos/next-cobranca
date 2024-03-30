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
import Loading from "../loading";


export const Client: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([] as Column[]);
  
  useEffect(() =>{
    fetchWrapper.get('/api/clientes').then(data =>{
      setList(data);
      setLoading(false);
    })
  },[]);
  
  if(loading)
    return (
      <Loading />
    )
  
  const formattedList: Column[] = list.map(item => ({
    id: item.id,
    nome: item.nome,
    cpf: item.cpf,
    rg: item.rg || "", // Ensure rg is of type string
    telefone: item.telefone || "", // Ensure telefone is of type string
    endereco: item.endereco || "", // Ensure endereco is of type string
    cidade: item.cidade || "", // Ensure cidade is of type string
    estado: item.estado || "", // Ensure estado is of type string
  }));
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Clientes (${list.length})`} description="Gerencie os Clientes" />
        <Button onClick={() => router.push(`/clientes/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>
      <Separator />
      {!loading && <DataTable searchKey="nome" columns={columns} data={formattedList} />}
    </>
  );
};