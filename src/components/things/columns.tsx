import { useModalStack } from "@/hooks/use-modal-stack";
import { deleteItem } from "@/lib/inventory";
import { Thing } from "@/lib/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Group } from "jazz-tools";
import { MoreHorizontal } from "lucide-react";
import { EditThing } from "../thing/edit";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { useSheetStack } from "@/hooks/use-sheet-stack";

// We can't really know
export const columns: ColumnDef<unknown>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "type",
    header: "Type"
  },
  {
    accessorKey: "data",
    header: "Data"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const thing = row.original as Thing;
      const { openSheet } = useSheetStack();

      const handleEditClick = () => {
        openSheet(EditThing, { thing });
      };

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
              onClick={handleEditClick}
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
