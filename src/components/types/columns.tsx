import { ColumnDef } from "@tanstack/react-table";

export const typesColumns: ColumnDef<unknown>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "accountId",
    header: "AccountId"
  },
  {
    accessorKey: "type",
    header: "Type"
  },
  {
    accessorKey: "key",
    header: "Key"
  }
];
