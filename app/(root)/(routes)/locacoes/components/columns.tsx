'use client'

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  produto: string;
  cliente: string;
  rota: string;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "produto",
    header: "Produto",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
  },
  {
    accessorKey: "rota",
    header: "Rota",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];