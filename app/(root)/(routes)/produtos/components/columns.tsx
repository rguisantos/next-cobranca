"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string;
  tipoProduto: string;
  plaqueta: number;
  contadorRelogio: number;
  tamanhoProduto: string;
  corProduto: string;
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
    accessorKey: "tamanhoProduto",
    header: "Tamanho do Produto",
  },
  {
    accessorKey: "corProduto",
    header: "Cor do Produto",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];