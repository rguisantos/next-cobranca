"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  nome: String;
  senha: String;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "senha",
    header: "Senha",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];