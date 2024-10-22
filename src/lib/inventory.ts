import { ThingFormValues } from "@/components/new-item-modal";
import { CoMapInit, Group } from "jazz-tools";
import { useCoState } from "./providers/jazz";
import { Inventory, InventoryList, Thing, ThingList, UserAccount } from "./schema";

export const getThings = (me: UserAccount) => {
  return me.root?.inventories?.flatMap(
    (inventory) =>
      inventory?.things?.filter(
        (thing): thing is Exclude<typeof thing, null> => !!thing
      ) || []
  ) || [];
}

export const getThingsByInventory = (me: UserAccount, inventory: Inventory) => {
  const things = getThings(me);
  return inventory
  ? things?.filter(
      (item) => item?.inventory?.id === inventory.id && !item.deleted
    )
  : things?.filter((item) => !item?.deleted);
}

export const createItem = (item: CoMapInit<Thing>): Thing => {
  const thing = Thing.create(item, {
    owner: item.inventory!._owner,
  });
  thing.inventory?.things?.push(thing);
  return thing;
};

export const updateItem = (item: Thing, values: ThingFormValues): Thing => {
  item.applyDiff(values as Partial<CoMapInit<Thing>>);
  return item;
};

export const deleteItem = (item: Thing) => {
  const found = item.inventory?.things?.findIndex(
    (it) => {
      return it?.id === item.id
    }
  );
  if (found !== undefined && found > -1) item.inventory?.things?.splice(found, 1);
}

export const getInventories = (me: UserAccount) => {
  return useCoState(
    InventoryList,
    me.root?._refs.inventories?.id,
    [{ things: [{}] }]
  );
}

export const createInventory = (
  inventoryName: string,
  me: UserAccount
): Inventory => {
  const group = Group.create({ owner: me });
  const inventory = Inventory.create(
    { name: inventoryName, things: ThingList.create([], { owner: group }) },
    { owner: group }
  );
  me.root?.inventories?.push(inventory);
  return inventory;
};

export const deleteInventory = (
  inventory: Inventory,
  me: UserAccount
): void => {
  const inventoryIndex = me.root?.inventories?.findIndex(
    (it) => it?.id === inventory?.id
  );
  if (inventoryIndex !== undefined && inventoryIndex > -1)
    me.root?.inventories?.splice(inventoryIndex, 1);
}
