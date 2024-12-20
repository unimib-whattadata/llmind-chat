"use client";
import { MessageSquare } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/app/components/ui/sidebar";
import { api } from "~/trpc/react";
import { Label } from "~/app/components/ui/label";
import { useSidebar } from "~/app/components/ui/sidebar";

export function NavProjects() {
  const { mainContent, setMainContent, auth } = useSidebar();
  const chats = api.chats.getChats.useQuery({
    userToken: auth.userId,
  });
  if (chats.isLoading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          <Label className="text-xs">Chats Loading...</Label>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (chats.isError) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          <Label className="text-xs text-red-500">Error on Loading Chats</Label>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="max-h-[200px] overflow-hidden group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu className="no-scrollbar overflow-y-auto">
        {chats.data && chats.data.length == 0 && (
          <p className="text-center text-xs text-gray-30">No Chats</p>
        )}
        {chats.data &&
          chats.data.length > 0 &&
          chats.data.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton asChild>
                <button
                  className={
                    mainContent.chatId == chat.id ? "bg-forest-green-100" : ""
                  }
                  onClick={() =>
                    setMainContent({
                      validation: false,
                      chatId: chat.id,
                    })
                  }
                >
                  <MessageSquare />
                  <span className="text-xs">{chat.chatName}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
