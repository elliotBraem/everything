import { BlackSphere } from "@/components/common/black-sphere";
import { CreateThing } from "@/components/thing/create";
import { useSheetStack } from "@/hooks/use-sheet-stack";
import { createItem, getInventories } from "@/lib/inventory";
import { useAccountOrGuest } from "@/lib/providers/jazz";
import { Thing } from "@/lib/schema";
import { CoMapInit } from "jazz-tools";
import { AIProcessor } from "./ai-assistant";

export const ActionButton = () => {
  const { openSheet, closeSheet } = useSheetStack();

  // <div className="h-full w-full">
  //   <iframe
  //     src="https://near.social/embed/every.near/widget/thing?path=efiz.near/thing/core"
  //     title="Embedded Content"
  //     className="h-full w-full border-none"
  //     allowFullScreen
  //   />
  // </div>
  // <CreateThing availableTypes={["thing"]} onSubmit={handleSubmit} />

  const handleActionClick = () => {
    // openSheet(AIAssistantComponent);
    openSheet(
      AIProcessor,
      {
        onCreateCallback: () => {
          // it could toast, success or so
          closeSheet();
        }
      },
      {
        title: "Create thing",
        description: "Select a type and then select confirm when you're done"
      }
    );
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
