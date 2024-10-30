import { ModalStack } from "@/components/common/modal-stack";
import { SheetStack } from "@/components/common/sheet-stack";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent
});

function LayoutComponent() {
  return (
    <>
      <div className="min-h-screen">
        <Outlet />
      </div>
      {/* absolute positioned */}
      <SheetStack />
      <ModalStack />
    </>
  );
}
