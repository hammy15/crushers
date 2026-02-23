"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  TrendingUp,
  User,
  Zap,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { DemoProvider } from "@/lib/demo-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sessions", label: "Sessions", icon: BarChart3 },
  { href: "/matching", label: "Peer Match", icon: Users },
  { href: "/improve", label: "Improve", icon: TrendingUp },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DemoProvider>
      <div className="min-h-screen bg-background flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-border flex flex-col z-50 transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="h-16 flex items-center justify-between px-5 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <span className="text-lg font-bold tracking-tight">Crushers</span>
            </Link>
            <button
              className="lg:hidden p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="w-5 h-5 text-muted" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:bg-surface-hover hover:text-foreground",
                  )}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="bg-gradient-to-br from-accent/5 to-orange-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Demo Mode</p>
              <p className="text-xs text-muted">Viewing seeded data for demonstration</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-border flex items-center px-6 lg:px-8">
            <button
              className="lg:hidden mr-4 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                D
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </DemoProvider>
  );
}
