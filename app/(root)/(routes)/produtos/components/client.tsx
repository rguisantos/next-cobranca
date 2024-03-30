'use client';

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { fetchWrapper } from "@/helpers/fetch-wrapper";
import { columns, Column } from "./columns";
import Loading from "../loading";

export const Client: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Column[]>([]);

  useEffect(() => {
    fetchWrapper.get('/api/produtos').then(data => {
      setList(data.map((item: any) =>  {
        return {
          id: item.id,
          plaqueta: item.plaqueta,
          tipoProduto: item.tipoProduto.nome,
          contadorRelogio: item.contadorRelogio,
          tamanhoProduto: item.tamanhoProduto.medida,
          corProduto: item.corProduto.nome,
        }
      }));
      setLoading(false);
    })
  }, []);

  if(loading)
    return(
      <Loading />
    );

  const formattedList: Column[] = list.map(item => ({
    id: item.id,
    plaqueta: item.plaqueta,
    tipoProduto: item.tipoProduto,
    contadorRelogio: item.contadorRelogio,
    tamanhoProduto: item.tamanhoProduto,
    corProduto: item.corProduto,
  }));

  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Produtos (${list.length})`} description="Gerencie os Produtos" />
        <Button onClick={() => router.push(`/produtos/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>
      <Separator />
      {!loading && <DataTable searchKey="plaqueta" columns={columns} data={formattedList} />}
    </>
  );
};
