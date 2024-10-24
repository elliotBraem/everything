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
import { useSheetStack } from "@/hooks/use-sheet-stack";
import { ReactNode, memo } from "react";

const StackItem = memo(
  ({
    isMobile,
    children,
    closeSheet
  }: {
    isMobile: boolean;
    children: ReactNode;
    closeSheet: () => void;
  }) => {
    if (isMobile) {
      return (
        <Drawer open={true} onOpenChange={closeSheet}>
          <DrawerContent className="flex h-screen max-h-screen flex-col justify-between">
            {/* <div className="h-full flex-1"> */}
            <div className="flex-1 overflow-y-auto">
              <DrawerHeader className="text-left">
                <DrawerTitle>Edit profile</DrawerTitle>
                <DrawerDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex h-full flex-col">{children}</div>
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    } else {
      return (
        <Sheet open={true} onOpenChange={closeSheet}>
          <SheetContent className="flex h-screen max-h-screen w-full min-w-[768px] flex-col justify-between">
            <div className="flex-1 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="flex h-full flex-col">{children}</div>
            </div>
            <SheetFooter className="pt-2">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
    }
  }
);

export const SheetStack = () => {
  const { sheetStack, closeSheet } = useSheetStack();
  const isMobile = useMediaQuery("(max-width: 768px)"); // sheet on larger screen, drawer on mobile

  if (sheetStack.length === 0) return null;

  return (
    <>
      {sheetStack.map(({ component: Component, props }, index) => (
        <StackItem key={index} isMobile={isMobile} closeSheet={closeSheet}>
          <Component {...props} />
        </StackItem>
      ))}
    </>
  );
};
