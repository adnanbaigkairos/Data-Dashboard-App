import { AppShell } from "@/components/layout/AppShell";
import { DashboardProvider } from "@/contexts/DashboardContext";

export default function Home() {
  return (
    <DashboardProvider>
      <AppShell />
    </DashboardProvider>
  );
}
