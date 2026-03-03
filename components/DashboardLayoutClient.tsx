"use client";

import { usePathname } from "next/navigation";
import { DashboardBreadcrumb } from "@/components/DashboardBreadcrumb";
import { AppSidebar } from "@/components/SideMenu";
import { ContractorSidebar } from "@/components/ContractorSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isContractor = pathname?.startsWith("/contractor");
  const SidebarComponent = isContractor ? ContractorSidebar : AppSidebar;

  return (
    <div className="bg-background min-h-svh">
      <SidebarProvider>
        <SidebarComponent />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border bg-card">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 text-primary hover:bg-sidebar-accent" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4 bg-border"
              />
              <DashboardBreadcrumb />
            </div>
          </header>
          <div className="min-h-[calc(100vh-4rem)] p-6 md:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
