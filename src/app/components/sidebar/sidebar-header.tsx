import * as React from "react";
import { SidebarHeader } from "~/app/components/ui/sidebar";
import { Plus } from "lucide-react";
import { Button } from "~/app/components/ui/button";
// This is sample data.
export function MicareSidebarHeader({
  ...props
}: React.ComponentProps<typeof SidebarHeader>) {
  return (
    <SidebarHeader {...props}>
      <Button className="bg-forest-green-700 flex max-h-8 flex-row justify-start rounded-3xl">
        <Plus className="text-white" size={18} />{" "}
        <span className="text-sm font-normal">New Chat</span>
      </Button>
    </SidebarHeader>
  );
}
