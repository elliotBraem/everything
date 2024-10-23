import InviteModal from "@/components/invite-modal";
import { MintModal } from "@/components/mint-modal";
import NewItemModal, { ThingFormValues } from "@/components/new-item-modal";
import { columns } from "@/components/things/columns";
import { DataTable } from "@/components/things/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createInventory,
  createItem,
  deleteInventory,
  getInventories,
  getThings,
  getThingsByInventory,
  updateItem
} from "@/lib/inventory";
import { useAccount } from "@/lib/providers/jazz";
import { Inventory, Thing } from "@/lib/schema";
import { createFileRoute } from "@tanstack/react-router";
import { CoMapInit, Group, ID } from "jazz-tools";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/inventory")({
  component: InventoryPage
});

export default function InventoryPage() {
  const { me } = useAccount();

  const [inventoryId, setInventoryId] = useState<ID<Inventory> | undefined>(
    (window.location.search?.replace("?inventory=", "") || undefined) as
      | ID<Inventory>
      | undefined
  );

  const things = getThings(me);

  useEffect(() => {
    if (!inventoryId) return;

    // addSharedInventory(inventoryId, me).then(() => {
    //   navigate("/vault");
    // });

    // We want to trigger this only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inventories = getInventories(me);

  const [selectedInventory, setSelectedInventory] = useState<
    Inventory | undefined
  >();
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isMintItemModalOpen, setIsMintItemModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isNewInventoryInputVisible, setIsNewInventoryInputVisible] =
    useState(false);
  const [newInventoryName, setNewInventoryName] = useState("");
  const [editingItem, setEditingItem] = useState<Thing | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredThings = getThingsByInventory(me, selectedInventory);

  const handleSaveNewItem = async (newItem: ThingFormValues) => {
    try {
      createItem(newItem as CoMapInit<Thing>);
    } catch (err: any) {
      setError("Failed to save new item. Please try again.");
      throw new Error(err);
    }
  };

  const handleUpdateItem = async (updatedItem: ThingFormValues) => {
    if (!editingItem) return;
    try {
      updateItem(editingItem, updatedItem);
      setEditingItem(null);
    } catch (err: any) {
      setError("Failed to update item. Please try again.");
      throw new Error(err);
    }
  };

  // const handleDeleteItem = async (item: Thing) => {
  //   try {
  //     deleteItem(item);
  //   } catch (err) {
  //     setError("Failed to delete item. Please try again.");
  //   }
  // };

  const handleCreateInventory = async () => {
    if (newInventoryName) {
      try {
        const newInventory = createInventory(newInventoryName, me);
        setNewInventoryName("");
        setIsNewInventoryInputVisible(false);
        setSelectedInventory(newInventory);
      } catch (err) {
        setError("Failed to create inventory. Please try again.");
      }
    }
  };

  const handleDeleteInventory = async () => {
    try {
      deleteInventory(selectedInventory, me);
    } catch (err) {
      setError("Failed to create inventory. Please try again.");
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     logOut();
  //   } catch (err) {
  //     setError("Failed to logout. Please try again.");
  //   }
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container flex items-center justify-between">
        {/* <Button onClick={handleLogout} variant="secondary">
          Logout
        </Button> */}
      </div>
      {/* {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* REPLACE WITH TABS */}
        <div className="flex flex-wrap gap-2">
          <Button
            key={"Inventory-all"}
            onClick={() => setSelectedInventory(undefined)}
            variant={!selectedInventory ? "default" : "secondary"}
          >
            All
          </Button>
          {inventories?.map((inventory) => (
            <Button
              key={inventory.id}
              onClick={() => setSelectedInventory(inventory)}
              variant={
                selectedInventory?.name === inventory?.name
                  ? "default"
                  : "secondary"
              }
            >
              {inventory?.name}
            </Button>
          ))}
          {isNewInventoryInputVisible ? (
            <div className="flex gap-2">
              <Input
                type="text"
                value={newInventoryName}
                onChange={(e) => setNewInventoryName(e.target.value)}
              />
              <Button onClick={handleCreateInventory}>Save</Button>
            </div>
          ) : (
            <Button onClick={() => setIsNewInventoryInputVisible(true)}>
              New Inventory
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsNewItemModalOpen(true)}
            disabled={
              !selectedInventory ||
              (selectedInventory._owner.castAs(Group).myRole() !== "admin" &&
                selectedInventory._owner.castAs(Group).myRole() !== "writer")
            }
          >
            New Item
          </Button>
          <Button onClick={() => setIsMintItemModalOpen(true)}>
            Mint Item
          </Button>
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            disabled={
              !selectedInventory ||
              (selectedInventory._owner.castAs(Group).myRole() !== "admin" &&
                selectedInventory._owner.castAs(Group).myRole() !== "writer")
            }
          >
            Share Inventory
          </Button>
          <Button onClick={handleDeleteInventory} disabled={!selectedInventory}>
            Delete Inventory
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={filteredThings} />
      </div>
      {inventories ? (
        <NewItemModal
          isOpen={isNewItemModalOpen || !!editingItem}
          onClose={() => {
            setIsNewItemModalOpen(false);
            setEditingItem(null);
          }}
          onSave={editingItem ? handleUpdateItem : handleSaveNewItem}
          inventories={inventories}
          selectedInventory={selectedInventory}
          initialValues={
            editingItem && editingItem.inventory
              ? { ...editingItem }
              : undefined
          }
        />
      ) : null}

      {inventories ? (
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          selectedInventory={selectedInventory}
        />
      ) : null}
      <MintModal
        isOpen={isMintItemModalOpen}
        onClose={() => setIsMintItemModalOpen(false)}
      />
    </div>
  );
}
