"use client";
import * as React from "react";
import { NavValidator } from "~/app/components/sidebar/nav/nav-validator";
import { NavFooter } from "~/app/components/sidebar/nav/nav-footer";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "~/app/components/ui/sidebar";
import { NavProjects } from "~/app/components/sidebar/nav/nav-projects";
import { MicareSidebarHeader } from "~/app/components/sidebar/sidebar-header";
import { useSidebar } from "~/app/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      {open && (
        <SidebarHeader>
          <MicareSidebarHeader />
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavProjects />
      </SidebarContent>
      <SidebarContent className="mb-auto">
        <NavValidator />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
