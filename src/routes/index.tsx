import { InventoryBrowser } from "@/components/inventory/browser";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/lib/providers/jazz";
import { Inventory, ListOfThings } from "@/lib/schema";
import { createFileRoute } from "@tanstack/react-router";
import { Group, ID } from "jazz-tools";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage
});

export default function HomePage() {
  const { me } = useAccount();

  const [inventoryId, setInventoryId] = useState<ID<Inventory> | undefined>(
    (window.location.search?.replace("?inventory=", "") || undefined) as
      | ID<Inventory>
      | undefined
  );

  const createInventory = () => {
    const group = Group.create({ owner: me });
    group.addMember("everyone", "writer");
    const newInventory = Inventory.create(
      {
        name: "My first inventory",
        things: ListOfThings.create([], { owner: group })
      },
      { owner: group }
    );
    setInventoryId(newInventory.id);
    window.history.pushState({}, "", `?inventory=${newInventory.id}`);
  };

  if (inventoryId) {
    return <InventoryBrowser inventoryId={inventoryId} />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl py-12">
          <Button onClick={createInventory}>create inventory</Button>
        </div>
      </div>
    );
  }
}
