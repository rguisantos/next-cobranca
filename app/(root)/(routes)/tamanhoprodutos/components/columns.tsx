'use client'

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Column = {
  id: string
  medida: string;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "medida",
    header: "Medida",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
