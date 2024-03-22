"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  tipoProduto: string;
  plaqueta: number;
  contadorRelogio: number;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "tipoProduto",
    header: "Tipo",
  },
  {
    accessorKey: "plaqueta",
    header: "Plaqueta",
  },
  {
    accessorKey: "contadorRelogio",
    header: "Contador",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
