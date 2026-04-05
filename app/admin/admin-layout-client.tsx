"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, GitBranch, Send, Settings, ChevronLeft, ChevronRight,
  Building2, DollarSign, Activity, Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Clients", href: "/admin/clients", icon: Building2 },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Pipeline", href: "/admin/pipeline", icon: GitBranch },
  { label: "Outbound", href: "/admin/outbound", icon: Send },
  { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { label: "Referrals", href: "/admin/referrals", icon: Share2 },
  { label: "Activity", href: "/admin/activity", icon: Activity },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayoutClient({
  children,
  initials,
}: {
  children: React.ReactNode;
  initials: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-midnight-950 z-40 flex flex-col transition-all duration-300",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
            {!collapsed && (
              <div>
                <span className="font-display font-bold text-base text-white block leading-tight">
                  Accelrated Growth
                </span>
                <span className="text-xs text-gray-500">Internal CRM</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-brand-600 text-white"
                    : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="px-4 pb-3">
            <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              View public site →
            </Link>
          </div>
        )}

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-white/[0.06] hover:text-gray-300 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      <div className={cn("flex-1 transition-all duration-300", collapsed ? "ml-[72px]" : "ml-60")}>
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="font-display font-bold text-lg text-gray-900">
            {NAV.find((i) => (i.exact ? pathname === i.href : pathname.startsWith(i.href)))?.label ?? "Admin"}
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/#book" className="btn-primary btn-sm">+ New Lead</Link>
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
