import { ModalStack } from "@/components/common/modal-stack";
import { SheetStack } from "@/components/common/sheet-stack";
import WindowContainer from "@/components/common/window-container";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent
});

function LayoutComponent() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 py-0 md:py-16">
        <WindowContainer>
          <Outlet />
        </WindowContainer>
      </div>
      {/* absolute positioned */}
      <SheetStack />
      <ModalStack />
    </>
  );
}
