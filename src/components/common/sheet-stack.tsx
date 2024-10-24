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
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here. Click save when you're done.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">{children}</div>
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
          <SheetContent className="w-full min-w-[768px]">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            {children}
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
