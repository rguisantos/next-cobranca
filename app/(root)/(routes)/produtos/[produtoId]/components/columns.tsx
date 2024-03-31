'use client'

import { ColumnDef } from "@tanstack/react-table"


export type Column = {
  id: string,
  data: string,
  jaTemCobranca:string,
  estornado: string,
  valor: string
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "data",
    header: "Data",
  },
  {
    accessorKey: "estornado",
    header: "Estornado",
  },
  {
    accessorKey: "jaTemCobranca",
    header: "Já tem Cobrança?",
  },
  {
    accessorKey: "valor",
    header: "Valor",
  },
];