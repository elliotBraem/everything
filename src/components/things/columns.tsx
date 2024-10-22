import { deleteItem, mintItem } from "@/lib/inventory";
import { Thing } from "@/lib/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Group } from "jazz-tools";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

// We can't really know
export const columns: ColumnDef<unknown>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "data",
    header: "Data"
  },
  {
    accessorKey: "type",
    header: "Type"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const thing = row.original as Thing;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(thing.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteItem(thing)}
            ></DropdownMenuItem>
            <DropdownMenuItem
              // onClick={() => setEditingItem(item)}
              disabled={
                thing._owner.castAs(Group).myRole() !== "admin" &&
                thing._owner.castAs(Group).myRole() !== "writer"
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteItem(thing)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
