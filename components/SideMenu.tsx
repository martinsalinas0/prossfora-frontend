"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import {
  BarChartHorizontal,
  Frame,
  Landmark,
  Map,
  PieChart,
  Settings2,
  Toolbox,
  Users,
} from "lucide-react";

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
      const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email || "User";
      setUser({ name, email: u.email || "", avatar: "/avatar/logo.png" });
    }
  }, []);
  return user;
}

const data = {
  //section titles
  navMain: [
    {
      title: "Users",
      url: "/admin/list",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/admin/list/users",
        },
        {
          title: "Employees",
          url: "/admin/list/employees",
        },
        {
          title: "Contractors",
          url: "/admin/list/contractors",
        },
        {
          title: "Customers",
          url: "/admin/list/customers",
        },
      ],
    },
    {
      title: "Jobs",
      url: "",
      icon: Toolbox,
      isActive: false,
      items: [
        {
          title: "All Jobs List",
          url: "/admin/list/jobs",
        },
        {
          title: "Active Jobs",
          url: "/admin/list/jobs/active",
        },
        {
          title: "Completed Jobs",
          url: "/admin/list/jobs/complete",
        },
        {
          title: "Task Requests",
          url: "/admin/list/jobs/task-requests",
        },
      ],
    },

    {
      title: "Financial",
      url: "/admin/list/financials",
      icon: Landmark,
      items: [
        {
          title: "Payments",
          url: "/admin/list/financials/payments",
        },
        {
          title: "Quotes",
          url: "/admin/list/financials/quotes",
        },
        {
          title: "Contractor Invoices",
          url: "/admin/list/financials/invoices/contractors",
        },
        {
          title: "Customer Invoices",
          url: "/admin/list/financials/invoices/customers",
        },
      ],
    },
    {
      title: "Analytics and Reports",
      url: "/admin/analytics",
      icon: BarChartHorizontal,
      items: [
        {
          title: "Platform Analytics",
          url: "/admin/analytics",
        },
        { title: "User Activity", url: "/admin/analytics" },
        {
          title: "Job Stats",
          url: "/admin/analytics",
        },
        { title: "Financial Reports", url: "/admin/analytics" },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings",
        },
        {
          title: "Team",
          url: "/admin/settings",
        },
        {
          title: "Billing",
          url: "/admin/settings",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarUser = useSidebarUser();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
