import { DataTable } from "@/components/common/data-table";
import { columns } from "@/components/things/columns";
import { Button } from "@/components/ui/button";
import { getInventory, getThingsByInventory2 } from "@/lib/inventory";
import { Inventory } from "@/lib/schema";
import { createFileRoute } from "@tanstack/react-router";
import { ID } from "jazz-tools";

export const Route = createFileRoute("/_layout/inventory/$inventoryId")({
  component: InventoryPage
});

export default function InventoryPage() {
  const { inventoryId } = Route.useParams();
  const inventory = getInventory(inventoryId as ID<Inventory>);
  const filteredThings = inventory ? getThingsByInventory2(inventory) : [];

  return (
    <>
      <div className="flex gap-2">
        <Button
        // onClick={() => setIsInviteModalOpen(true)}
        // disabled={
        //   !selectedInventory ||
        //   (selectedInventory._owner.castAs(Group).myRole() !== "admin" &&
        //     selectedInventory._owner.castAs(Group).myRole() !== "writer")
        // }
        >
          Share Inventory
        </Button>
        <Button
        // onClick={handleDeleteInventory} disabled={!selectedInventory}
        >
          Delete Inventory
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={filteredThings} />
      </div>
    </>
  );
}
