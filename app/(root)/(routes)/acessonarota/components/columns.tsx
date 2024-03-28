'use client'

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  usuarioId: string;
  rotaId: string;
  usuario: string;
  rota: string;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "usuario",
    header: "Usuário",
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