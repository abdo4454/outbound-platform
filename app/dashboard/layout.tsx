"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, BarChart3, Mail, Settings, Bell,
  ChevronLeft, ChevronRight, FileText, Users, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Mail },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Contacts", href: "/dashboard/contacts", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Integrations", href: "/dashboard/integrations", icon: Zap },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-40 flex flex-col transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-lg text-gray-900">
                OutboundPro
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", active && "text-brand-600")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300", collapsed ? "ml-[72px]" : "ml-64")}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="font-display font-bold text-lg text-gray-900">
              {NAV_ITEMS.find(
                (i) =>
                  i.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(i.href)
              )?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full" />
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
