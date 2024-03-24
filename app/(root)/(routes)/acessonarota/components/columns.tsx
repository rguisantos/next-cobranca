"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  usuarioId: string;
  rotaId: string;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "usuarioId",
    header: "ID do Usuário",
  },
  {
    accessorKey: "rotaId",
    header: "ID da Rota",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];