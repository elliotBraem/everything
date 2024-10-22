import { Account, co, CoList, CoMap, Group, Profile } from "jazz-tools";

export class Thing extends CoMap {
  data = co.string;
  type = co.string;
  inventory = co.ref(Inventory);
  deleted = co.boolean;
}

export class ThingList extends CoList.Of(co.ref(Thing)) {}

export class Inventory extends CoMap {
  name = co.string;
  things = co.ref(ThingList);
}

export class InventoryList extends CoList.Of(co.ref(Inventory)) {}

export class UserAccountRoot extends CoMap {
  inventories = co.ref(InventoryList);
}

export class UserAccount extends Account {
  profile = co.ref(Profile);
  root = co.ref(UserAccountRoot);

  migrate(this: UserAccount, creationProps?: { name: string }) {
    super.migrate(creationProps);
    if (!this._refs.root) {
      const group = Group.create({ owner: this });
      const firstInventory = Inventory.create(
        {
          name: "Default",
          things: ThingList.create([], { owner: group })
        },
        { owner: group }
      );

      firstInventory.things?.push(
        Thing.create(
          {
            data: "random data",
            type: "string",
            inventory: firstInventory,
            deleted: false
          },
          { owner: group }
        )
      );

      this.root = UserAccountRoot.create(
        {
          inventories: InventoryList.create([firstInventory], {
            owner: this
          })
        },
        { owner: this }
      );
    }
  }
}
