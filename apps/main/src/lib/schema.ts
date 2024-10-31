import { RJSFSchema } from "@rjsf/utils";
import { Account, co, CoList, CoMap, Group, Profile } from "jazz-tools";

export class Thing extends CoMap {
  data = co.string;
  type = co.string;
  metadata = co.string;
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

// we could start with some things...
// they are all types
// Thing
// Type
// Inventory
// User
// Metadata

// On each update of the app, what if it grabbed the types and published the schema?
// posted it to Graph("root.allthethings.testnet").set("every.near/type/user")
// then, when you fork it, it will set to your account.
// it will pull from the bos.config.json
export const TypeSchema: RJSFSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Human-readable name for the type."
    },
    description: {
      type: "string",
      description: "Optional description of the type."
    },
    schema: {
      type: "string",
      description: "JSON schema that describes the data for this type."
    }
  },
  required: ["name", "description", "schema"],
  additionalProperties: false
};

export const ThingSchema: RJSFSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Unique identifier for the Thing."
    },
    type: {
      type: "string",
      description:
        "Reference to the Type schema ID defining this Thing's structure."
    },
    data: {
      type: "string",
      description: "Structured JSON following the schema defined by Type.",
      additionalProperties: true
    }
  },
  required: ["id", "type", "data"],
  additionalProperties: false
};

export class UserAccount extends Account {
  profile = co.ref(Profile);
  root = co.ref(UserAccountRoot);

  migrate(this: UserAccount, creationProps?: { name: string }) {
    super.migrate(creationProps);
    if (!this._refs.root) {
      const group = Group.create({ owner: this });
      const firstInventory = Inventory.create(
        {
          name: "Types",
          things: ThingList.create([], { owner: group })
        },
        { owner: group }
      );

      firstInventory.things?.push(
        Thing.create(
          {
            data: JSON.stringify(TypeSchema),
            type: "Type",
            metadata: JSON.stringify({}),
            inventory: firstInventory,
            deleted: false
          },
          { owner: group }
        ),
        Thing.create(
          {
            data: JSON.stringify(ThingSchema),
            type: "Thing",
            metadata: JSON.stringify({}),
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
