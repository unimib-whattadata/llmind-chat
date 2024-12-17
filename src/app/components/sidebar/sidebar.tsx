"use client";
import * as React from "react";
import { NavValidator } from "~/app/components/sidebar/nav/nav-validator";
import { NavFooter } from "~/app/components/sidebar/nav/nav-footer";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "~/app/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* {open && (
        <SidebarHeader>
          <MicareSidebarHeader />
        </SidebarHeader>
      )}*/}
      {/* <SidebarContent>
        <NavProjects chats={data.chats} />
      </SidebarContent> */}
      <SidebarContent className="mb-auto">
        <NavValidator />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
