"use client";
import * as React from "react";
import { SidebarInset, SidebarProvider } from "~/app/components/ui/sidebar";
import { AppSidebar } from "~/app/components/sidebar/sidebar";
import { Header } from "~/app/components/header/header";

export function MicareSidebarProvider({
  children,
}: React.ComponentProps<typeof SidebarProvider>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
