import { BlackSphere } from "@/components/common/black-sphere";
import { CreateThing } from "@/components/thing/create";
import { useSheetStack } from "@/hooks/use-sheet-stack";

export const ActionButton = () => {
  const { openSheet, closeSheet } = useSheetStack();

  const handleActionClick = () => {
    openSheet(
      CreateThing,
      {
        onCreateCallback: () => {
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
