import type { ReactNode } from "react";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { OpsProvider } from "@/context/OpsContext";

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <OpsProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:ml-64 transition-all duration-300">
          <DashboardHeader title={title} subtitle={subtitle} />
          <main className="p-4 md:p-6 space-y-6">{children}</main>
        </div>
      </div>
    </OpsProvider>
  );
}
