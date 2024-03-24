"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  nome: String;
  cpf: String;
  rg: String;
  telefone: String;
  endereco: String;
  cidade: String;
  estado: String;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "rg",
    header: "RG",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
  },
  {
    accessorKey: "endereco",
    header: "Endereço",
  },
  {
    accessorKey: "cidade",
    header: "Cidade",
  },
  {
    accessorKey: "estado",
    header: "Estado",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];