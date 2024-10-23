import { Inspect } from "@/components/inspect";
import { CreateThing } from "@/components/thing/create";
import { createItem, getInventories } from "@/lib/inventory";
import { useAccount } from "@/lib/providers/jazz";
import { Thing } from "@/lib/schema";
import { BlackSphere } from "@/tangible/black-sphere";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CoMapInit } from "jazz-tools";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent
});

function LayoutComponent() {
  const { me } = useAccount();

  const inventories = getInventories(me)

  const handleSubmit = (formData: {
    type: string;
    images: File[];
    json: string;
  }) => {
    try {
      
      // const inventoryId = data?.inventory as unknown as string;
      // const selectedInventory = inventories.find(
      //   (inventory) => inventory.id === inventoryId
      // );
      // if (selectedInventory) {
      //   data.inventory = selectedInventory;
      // }
      createItem({
        inventory: inventories?.at(0),
        deleted: false,
        data: formData.json,
        type: formData.type
      } as CoMapInit<Thing>);
    } catch (err: any) {
      throw new Error(err);
    }
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <Outlet />

      <div className="fixed bottom-10 right-3 sm:bottom-16 sm:right-4 md:bottom-20 md:right-5">
        <Inspect
          trigger={
            <div className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40">
              <BlackSphere />
            </div>
          }
          content={
            <CreateThing availableTypes={["Thing"]} onSubmit={handleSubmit} />
          }
          mode="dialog"
        />
      </div>
    </>
  );
}
