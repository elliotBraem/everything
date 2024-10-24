import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: HomePage
});

export default function HomePage() {
  const { me } = useAccount();
  const navigate = Route.useNavigate();

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
    </div>
  );
}
