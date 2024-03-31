'use client';

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, Column } from "./columns";
import moment from "moment";

export const PagamentosClient: React.FC<{
  total: number,
  estornos: number,
  pagamentos: {
      id: string,
      valor: number,
      estornado: boolean,
      jaTemCobranca: boolean,
      data: Date
  }[]
}> = (
  pagamentos
) => {

  const formattedList: Column[] = pagamentos.pagamentos.map(item => ({
    id: item.id,
    data: (moment(item.data)).format('DD/MM/YYYY HH:mm:ss'),
    estornado: item.estornado ? "Estornado" : "",
    jaTemCobranca: item.jaTemCobranca ? "Já tem Cobrança" : "",
    valor: item.valor.toString(),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Pagamentos (${formattedList.length})`} description="Abaixo estão os Pagamentos" />
      </div>
      <Separator />
      <DataTable searchKey="data" columns={columns} data={formattedList} />
    </>
  );
};
