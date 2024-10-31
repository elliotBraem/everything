import { DataTable } from "@/components/common/data-table";
import { ConfirmationModal } from "@/components/confirmation-modal";
import InviteModal from "@/components/invite-modal";
import { columns } from "@/components/thing/columns";
import { Button } from "@/components/ui/button";
import { useModalStack } from "@/hooks/use-modal-stack";
import {
  deleteInventory,
  getInventory,
  getThingsByInventory2
} from "@/lib/inventory";
import { useAccount } from "@/lib/providers/jazz";
import { Inventory } from "@/lib/schema";
import { createFileRoute } from "@tanstack/react-router";
import { Group, ID } from "jazz-tools";

export const Route = createFileRoute("/_layout/_auth/inventory/$inventoryId")({
  component: InventoryPage
});

// TODO:
// parameter type checking for inventoryId so no need to cast?

export default function InventoryPage() {
  const { me } = useAccount();
  const { inventoryId } = Route.useParams();
  const inventory = getInventory(inventoryId as ID<Inventory>);
  const filteredThings = inventory ? getThingsByInventory2(inventory) : [];
  const { openModal, closeModal } = useModalStack();
  const navigate = Route.useNavigate();

  const handleShareInventory = () => {
    openModal(
      InviteModal,
      {
        selectedInventory: inventory
      },
      {
        title: "Share Inventory"
      }
    );
  };

  const handleDeleteInventory = () => {
    openModal(
      ConfirmationModal,
      {
        onConfirm: async () => {
          try {
            deleteInventory(inventoryId as ID<Inventory>, me);
            closeModal();
            navigate({
              to: "/inventory"
            });
          } catch (err) {
            console.error("Failed to delete inventory. Please try again.", err);
            // setError("Failed to create inventory. Please try again.");
          }
        }
      },
      {
        title: "Confirmation",
        description: "Are you sure you want to delete this inventory?"
      }
    );
  };

  return (
    <>
      <div className="flex gap-2 mb-2">
        <Button
          onClick={handleShareInventory}
          disabled={
            !inventory ||
            (inventory._owner.castAs(Group).myRole() !== "admin" &&
              inventory._owner.castAs(Group).myRole() !== "writer")
          }
        >
          Share Inventory
        </Button>
        <Button onClick={handleDeleteInventory} disabled={!inventoryId}>
          Delete Inventory
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={filteredThings} />
      </div>
    </>
  );
}
