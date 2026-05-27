"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { getNavForRole } from "@/constants/navigation";
import { useAuthContext } from "@/context/auth-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, role } = useAuthContext();

  if (!user || !role) {
    return null;
  }

  const navItems = getNavForRole(role);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar navItems={navItems} />
      <div className="flex flex-1 flex-col">
        <Navbar navItems={navItems} user={user} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
