import { ThingFormValues } from "@/components/new-item-modal";
import { createInviteLink } from "jazz-react";
import {
  Account,
  CoMapInit,
  CoValue,
  CoValueClass,
  DepthsIn,
  Group,
  ID,
  subscribeToCoValue
} from "jazz-tools";
import { useCoState } from "./providers/jazz";
import {
  Inventory,
  InventoryList,
  Thing,
  ThingList,
  UserAccount
} from "./schema";

export const getThings = (me: UserAccount) => {
  return (
    me.root?.inventories?.flatMap(
      (inventory) =>
        inventory?.things?.filter(
          (thing): thing is Exclude<typeof thing, null> => !!thing
        ) || []
    ) || []
  );
};

export const getThing = (thingId: ID<Thing>) => {
  return useCoState(Thing, thingId)
}

export const getThingsByInventory = (me: UserAccount, inventory: Inventory) => {
  const things = getThings(me);
  return inventory
    ? things?.filter(
      (item) => item?.inventory?.id === inventory.id && !item.deleted
    )
    : things?.filter((item) => !item?.deleted);
};

export const getThingsByInventory2 = (inventory: Inventory) => {
  return inventory.things?.filter((item) => !item?.deleted);
};

export const getInventory = (inventoryId: ID<Inventory>) => {
  return useCoState(Inventory, inventoryId, { things: [{}] });
};

export const createItem = (item: CoMapInit<Thing>): Thing => {
  const thing = Thing.create(item, {
    owner: item.inventory!._owner
  });
  thing.inventory?.things?.push(thing);
  return thing;
};

export const updateItem = (item: Thing, values: ThingFormValues): Thing => {
  item.applyDiff(values as Partial<CoMapInit<Thing>>);
  return item;
};

export const deleteItem = (item: Thing) => {
  const found = item.inventory?.things?.findIndex((it) => {
    return it?.id === item.id;
  });
  if (found !== undefined && found > -1)
    item.inventory?.things?.splice(found, 1);
};

export const mintItem = (item: Thing) => { };

export const getInventories = (me: UserAccount) => {
  return useCoState(InventoryList, me.root?._refs.inventories?.id, [
    { things: [{}] }
  ]);
};

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
  inventoryId: ID<Inventory>,
  me: UserAccount
): void => {
  const inventoryIndex = me.root?.inventories?.findIndex(
    (it) => it?.id === inventoryId
  );
  if (inventoryIndex !== undefined && inventoryIndex > -1)
    me.root?.inventories?.splice(inventoryIndex, 1);
};

export const shareInventory = (
  inventory: Inventory,
  permission: "reader" | "writer" | "admin"
): string | undefined => {
  if (inventory._owner && inventory.id) {
    return createInviteLink(inventory, permission);
  }
  return undefined;
};

export function waitForCoValue<T extends CoValue>(
  coMap: CoValueClass<T>,
  valueId: ID<T>,
  account: Account,
  predicate: (value: T) => boolean,
  depth: DepthsIn<T>
) {
  return new Promise<T>((resolve) => {
    function subscribe() {
      const unsubscribe = subscribeToCoValue(
        coMap,
        valueId,
        account,
        depth,
        (value) => {
          if (predicate(value)) {
            resolve(value);
            unsubscribe();
          }
        },
        () => {
          unsubscribe();
          setTimeout(subscribe, 100);
        }
      );
    }

    subscribe();
  });
}

export async function addSharedInventory(
  sharedInventoryId: ID<Inventory>,
  me: UserAccount
) {
  const [sharedInventory, account] = await Promise.all([
    await waitForCoValue(Inventory, sharedInventoryId, me, Boolean, {}),
    await waitForCoValue(UserAccount, me.id, me, Boolean, {
      root: {
        inventories: []
      }
    })
  ]);

  if (!account.root?.inventories) return;

  const found = account.root.inventories.some(
    (f) => f?.id === sharedInventory.id
  );

  if (!found) {
    account.root.inventories.push(sharedInventory);
  }
}
