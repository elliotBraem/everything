import { atom, useAtom } from "jotai";
import { Metadata } from "./use-modal-stack";

/**
 * easy to stack sheets, renders a drawer on mobile
 * ships with @/components/common/sheet-stack.tsx
 *
 * usage:
 */

// const { openSheet, closeSheet, closeAllSheets } = useSheetStack();
// function Content(props) { return <p>{props.message}</p> }
// openSheet(Content, "hello");

// closeSheet(); // closes top of stack
interface Sheet {
  component: React.FC<any>;
  props: Record<string, any>;
  metadata: Metadata;
}

// keeps track of a stack of atoms
export const sheetStackAtom = atom<Sheet[]>([]);

export const useSheetStack = () => {
  const [sheetStack, setSheetStack] = useAtom(sheetStackAtom);

  // Pushes a new sheet onto the stack
  const openSheet = (
    component: React.FC<any>,
    props: Record<string, any> = {},
    metadata: Metadata
  ) => {
    setSheetStack((prevStack) => [
      ...prevStack,
      { component, props, metadata }
    ]);
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
