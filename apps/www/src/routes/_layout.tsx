import { ModalStack } from "@/components/common/modal-stack";
import { SheetStack } from "@/components/common/sheet-stack";
import WindowContainer from "@/components/common/window-container";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent
});

function LayoutComponent() {
  return (
    <>
      <a
        className="github-fork-ribbon"
        href="https://github.com/elliotBraem/everything"
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
      ></a>
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
