import { ActionButton } from "@/components/action-button";
import { ModalStack } from "@/components/common/modal-stack";
import { SheetStack } from "@/components/common/sheet-stack";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent
});

function LayoutComponent() {
  return (
    <>
      {/* main content */}
      <Outlet />
      {/* absolute positioned */}
      <ActionButton />
      <SheetStack />
      <ModalStack />
    </>
  );
}
