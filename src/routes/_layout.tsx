import AIAssistantComponent from "@/components/ai-assistant";
import { Inspect } from "@/components/inspect";
import { ModalStack } from "@/components/common/modal-stack";
import { SheetStack } from "@/components/common/sheet-stack";
import { createItem, getInventories } from "@/lib/inventory";
import { useAccount } from "@/lib/providers/jazz";
import { Thing } from "@/lib/schema";
import { BlackSphere } from "@/tangible/black-sphere";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CoMapInit } from "jazz-tools";
import { ActionButton } from "@/components/action-button";

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
