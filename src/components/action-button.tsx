import { BlackSphere } from "@/components/common/black-sphere";
import { useSheetStack } from "@/hooks/use-sheet-stack";
import { createItem, getInventories, getThings } from "@/lib/inventory";
import { useAccount } from "@/lib/providers/jazz";
import { Thing } from "@/lib/schema";
import { CoMapInit } from "jazz-tools";
import { CreateThing } from "./thing/create";

export const ActionButton = () => {
  const { openSheet } = useSheetStack();
  const { me } = useAccount();

  const inventories = getInventories(me);

  const handleSubmit = ({ data, type }) => {
    try {
      createItem({
        inventory: inventories?.at(0),
        deleted: false,
        data: data,
        type: type
      } as CoMapInit<Thing>);
    } catch (err: any) {
      throw new Error(err);
    }
    console.log("Form submitted:", data);
  };

  // <div className="h-full w-full">
  //   <iframe
  //     src="https://near.social/embed/every.near/widget/thing?path=efiz.near/thing/core"
  //     title="Embedded Content"
  //     className="h-full w-full border-none"
  //     allowFullScreen
  //   />
  // </div>
  // <CreateThing availableTypes={["thing"]} onSubmit={handleSubmit} />

  const things = getThings(me);
  const types = things.filter((thing) => thing.type === "type" || []);

  const handleActionClick = () => {
    // openSheet(AIAssistantComponent);
    openSheet(CreateThing, {
      availableTypes: types,
      onSubmit: handleSubmit
    });
  };

  return (
    <div className="fixed bottom-10 right-3 sm:bottom-16 sm:right-4 md:bottom-20 md:right-5">
      <div
        className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40"
        onClick={handleActionClick}
      >
        <BlackSphere />
      </div>
    </div>
  );
};
