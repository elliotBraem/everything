import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { JazzAuth } from "@/lib/providers/jazz";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Provider as JotaiProvider } from "jotai";

export const Route = createFileRoute("/_layout/_pages")({
  component: PagesLayout
});

function PagesLayout() {
  return (
    <JotaiProvider>
      <JazzAuth>
        <LayoutContent />
      </JazzAuth>
    </JotaiProvider>
  );
}

function LayoutContent() {
  return (
    <>
      {/* Full page */}
      <div className="flex size-full min-h-full flex-row items-stretch overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                {/* TODO replace with separate, derivable bread crumb */}
                {/* <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb> */}
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <MainContent />
            </div>
            {/* If  on mobile, I want to display a camera */}
          </SidebarInset>
          {/* <div>
            <SidebarTrigger />
            <MainContent />
          </div> */}
        </SidebarProvider>
      </div>
    </>
  );
}

function MainContent() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <main className="relative flex flex-auto flex-col place-items-stretch overflow-auto lg:my-2 lg:mr-2">
        <Outlet />
      </main>
    </div>
  );
}
