'use client'

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  plaqueta: string;
  cliente: string;
  rota: string;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "plaqueta",
    header: "Plaqueta",
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