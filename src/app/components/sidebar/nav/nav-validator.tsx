"use client";
import { CircleCheckBig } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/app/components/ui/sidebar";
export function NavValidator() {
  const { validation, setValidation } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Validation</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <button
              className={cn(validation ? "bg-forest-green-100" : "")}
              onClick={() => setValidation(true)}
            >
              <CircleCheckBig size={24} />
              <span className="text-xs">Validator</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
