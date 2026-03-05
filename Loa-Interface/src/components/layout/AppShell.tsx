import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

type AppShellProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <SidebarProvider className="bg-background text-foreground">
      <Sidebar variant="inset">
        <SidebarHeader className="flex flex-row items-center justify-between gap-2 border-b border-sidebar-foreground px-4 py-[23px]">
          <span className="wrap-break-word text-sm font-semibold leading-tight text-sidebar-foreground">
            Lunar Orbiter Algorithms
          </span>
          {/* <SidebarTrigger className="h-7 w-7 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:flex" /> */}
        </SidebarHeader>
        <SidebarContent className="px-2 py-3">{sidebar}</SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 data-[orientation=vertical]:h-4"
          />
          <span className="min-w-0 flex-1 truncate font-semibold tracking-tight md:font-medium md:text-muted-foreground">
            Lunar Orbiter Algorithms
          </span>
          <div className="flex items-center gap-2">{header}</div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4 md:mx-auto md:max-w-6xl md:w-full md:px-6 md:py-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
