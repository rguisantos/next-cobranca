'use client'

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  nome: string;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];