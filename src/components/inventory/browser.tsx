import { useCoState } from "@/lib/providers/jazz";
import { Inventory, Thing } from "@/lib/schema";
import { ID } from "jazz-tools";
import InventoryItem from "./item";

export function InventoryBrowser({
  inventoryId
}: {
  inventoryId: ID<Inventory>;
}) {
  const inventory = useCoState(Inventory, inventoryId, { things: [{}] });
  const createAndAddThing = () => {
    inventory?.things?.push(
      Thing.create(
        {
          data: "hello",
          type: "string"
        },
        { owner: inventory._owner }
      )
    );
  };
  return inventory ? (
    <div>
      <h1>{inventory.name}</h1>
      <div className="border-b border-r">
        {inventory.things?.map(
          (thing) => thing && <InventoryItem key={thing.id} thing={thing} />
        )}
        <button onClick={createAndAddThing}>Create Thing</button>
      </div>
    </div>
  ) : (
    <div>Loading inventory...</div>
  );
}
