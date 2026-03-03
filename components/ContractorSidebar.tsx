"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { Briefcase, FileText, LayoutDashboard } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { CompanyHeader } from "@/components/CompanyHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const DEFAULT_USER = {
  name: "User",
  email: "",
  avatar: "/avatar/logo.png",
};

function useSidebarUser() {
  const [user, setUser] = useState(DEFAULT_USER);
  useEffect(() => {
    const u = getUser();
    if (u && (u.email || u.first_name || u.last_name)) {
      const name =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.email ||
        "User";
      setUser({
        name,
        email: u.email || "",
        avatar: "/avatar/logo.png",
      });
    }
  }, []);
  return user;
}

const contractorNavData = {
  navMain: [
    {
      title: "Contractor",
      url: "/contractor",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Dashboard", url: "/contractor" },
        { title: "My Jobs", url: "/contractor/jobs" },
        { title: "My Invoices", url: "/contractor/invoices" },
      ],
    },
  ],
};

export function ContractorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const sidebarUser = useSidebarUser();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={contractorNavData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
