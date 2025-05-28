"use client";

import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppHeader } from "./AppHeader";
import { ControlPanel } from "@/components/dashboard/ControlPanel";
import { DashboardArea } from "@/components/dashboard/DashboardArea";
import { Button } from '../ui/button';
import { PanelLeftOpen } from 'lucide-react';


export function AppShell({ children }: { children?: ReactNode }) { // children prop made optional
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-r"
          >
            <SidebarHeader className="p-2 flex items-center justify-end md:hidden">
               {/* Mobile trigger is typically handled by SidebarProvider, this is an example if custom needed */}
            </SidebarHeader>
            <SidebarContent className="p-0">
              <ControlPanel />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex-1 flex flex-col overflow-auto">
            <div className="p-2 md:hidden"> 
              {/* This button is specific for mobile to toggle sidebar if needed outside of the header */}
              <SidebarTrigger asChild>
                <Button variant="outline" size="sm">
                  <PanelLeftOpen className="h-4 w-4 mr-2" /> Control Panel
                </Button>
              </SidebarTrigger>
            </div>
            <main className="flex-1 p-0 md:p-0 overflow-auto"> {/* Reduced padding */}
              {children || <DashboardArea />}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
