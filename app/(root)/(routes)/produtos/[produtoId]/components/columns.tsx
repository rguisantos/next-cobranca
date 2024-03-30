'use client'

import { ColumnDef } from "@tanstack/react-table"


export type Column = {
  id: string,
  data: string,
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
    accessorKey: "valor",
    header: "Valor",
  },
];