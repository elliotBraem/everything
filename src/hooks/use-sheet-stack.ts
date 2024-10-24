import { sheetStackAtom } from "@/atoms/sheet";
import { useAtom } from "jotai";

export const useSheetStack = () => {
  const [sheetStack, setSheetStack] = useAtom(sheetStackAtom);

  // Pushes a new sheet onto the stack
  const openSheet = (
    component: React.FC<any>,
    props: Record<string, any> = {}
  ) => {
    setSheetStack((prevStack) => [...prevStack, { component, props }]);
  };

  // Pops the top sheet off the stack
  const closeSheet = () => {
    setSheetStack((prevStack) => prevStack.slice(0, -1)); // Remove the last sheet
  };

  // Closes all sheets
  const closeAllSheets = () => {
    setSheetStack([]);
  };

  return {
    sheetStack,
    openSheet,
    closeSheet,
    closeAllSheets
  };
};
