"use client";
import { PanelRightClose } from "lucide-react";
import { useSidebar } from "~/app/components/ui/sidebar";
import { SidebarMenu, SidebarMenuButton } from "~/app/components/ui/sidebar";
export function NavFooter() {
  const { open, setOpen } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuButton
        onClick={() => {
          setOpen(!open);
        }}
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="flex h-8 w-8 items-center justify-center">
          <PanelRightClose className="text-forest-green-700" size={24} />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate text-xs font-semibold">
            Collapse Sidebar
          </span>
        </div>
      </SidebarMenuButton>
    </SidebarMenu>
  );
}
