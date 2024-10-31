import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Metadata } from "@/hooks/use-modal-stack";
import { useSheetStack } from "@/hooks/use-sheet-stack";
import { ReactNode, memo } from "react";
import { motion } from "framer-motion";

const WindowControls = ({ onClose }: { onClose: () => void }) => (
  <div className="border-b-2 border-gray-800">
    <div className="flex items-center justify-end">
      <div
        className="mx-4 my-3 h-4 w-4 cursor-pointer rounded-full bg-black transition-opacity hover:opacity-80"
        onClick={onClose}
      />
    </div>
  </div>
);

const StackItem = memo(
  ({
    isMobile,
    children,
    closeSheet,
    metadata
  }: {
    isMobile: boolean;
    children: ReactNode;
    closeSheet: () => void;
    metadata: Metadata;
  }) => {
    if (isMobile) {
      return (
        <Drawer open={true} onOpenChange={closeSheet}>
          <DrawerContent className="flex h-[96vh] flex-col justify-between rounded-t-xl border-none p-0">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col rounded-t-xl border-2 border-gray-800 bg-white shadow-[4px_4px_0_rgba(0,0,0,1)]"
            >
              <WindowControls onClose={closeSheet} />

              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <DrawerHeader className="px-0 text-left">
                    <DrawerTitle className="font-mono text-xl font-semibold">
                      {metadata.title}
                    </DrawerTitle>
                    {metadata.description && (
                      <DrawerDescription className="text-gray-600">
                        {metadata.description}
                      </DrawerDescription>
                    )}
                  </DrawerHeader>
                  <div className="mt-4 flex h-full flex-col">{children}</div>
                </div>
              </div>

              <DrawerFooter className="border-t-2 border-gray-800 p-4">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-gray-800 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0_rgba(0,0,0,1)]"
                  >
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </motion.div>
          </DrawerContent>
        </Drawer>
      );
    } else {
      return (
        <Sheet open={true} onOpenChange={closeSheet}>
          <SheetContent className="flex h-screen w-full min-w-[768px] flex-col justify-between border-none p-0 shadow-none">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col border-l-2 border-gray-800 bg-white shadow-[-4px_4px_0_rgba(0,0,0,1)]"
            >
              <WindowControls onClose={closeSheet} />

              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <SheetHeader className="px-0 text-left">
                    <SheetTitle className="font-mono text-xl font-semibold">
                      {metadata.title}
                    </SheetTitle>
                    {metadata.description && (
                      <SheetDescription className="text-gray-600">
                        {metadata.description}
                      </SheetDescription>
                    )}
                  </SheetHeader>
                  <div className="mt-4 flex h-full flex-col">{children}</div>
                </div>
              </div>

              <SheetFooter className="border-t-2 border-gray-800 p-4">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-gray-800 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0_rgba(0,0,0,1)]"
                  >
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </motion.div>
          </SheetContent>
        </Sheet>
      );
    }
  }
);

export const SheetStack = () => {
  const { sheetStack, closeSheet } = useSheetStack();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (sheetStack.length === 0) return null;

  return (
    <>
      {sheetStack.map(({ component: Component, props, metadata }, index) => (
        <StackItem
          key={index}
          isMobile={isMobile}
          closeSheet={closeSheet}
          metadata={metadata}
        >
          <Component {...props} />
        </StackItem>
      ))}
    </>
  );
};
