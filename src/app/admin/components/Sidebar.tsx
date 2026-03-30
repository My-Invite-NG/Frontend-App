"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  X,
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  Settings,
  HelpCircle,
  MessageSquare,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  PieChart,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/financials", label: "Financials", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: PieChart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/support", label: "Help & Support", icon: HelpCircle },
  { href: "/admin/contact", label: "Contact Inquiries", icon: Mail },
  { href: "/admin/logout", label: "Logout", icon: LogOut },
];

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    // Settings: true, // Default open for visibility - Removed as settings is no longer a submenu
  });

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-all"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border flex flex-col h-full transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex shrink-0
      `}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                MyInvite
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Admin Portal
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const hasSubmenu = link.submenu && link.submenu.length > 0;
          const isActive =
            !hasSubmenu &&
            (pathname === link.href || pathname?.startsWith(link.href + "/"));
          const isSubmenuOpen = openSubmenus[link.label];
          const isSubmenuActive =
            hasSubmenu && link.submenu?.some((sub) => pathname === sub.href);

          if (hasSubmenu) {
            return (
              <div key={link.label}>
                <button
                  onClick={() => toggleSubmenu(link.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isSubmenuActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isSubmenuActive
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                      )}
                    />
                    {link.label}
                  </div>
                  {isSubmenuOpen ? (
                    <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isSubmenuOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-slate-100 dark:border-slate-800 space-y-1">
                    {link.submenu?.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            isSubActive
                              ? "text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 font-bold"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
                          )}
                        >
                          <SubIcon
                            className={cn(
                              "w-3.5 h-3.5",
                              isSubActive
                                ? "text-violet-600 dark:text-violet-400"
                                : "text-slate-400",
                            )}
                          />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-600 dark:bg-violet-500 rounded-r-full" />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Theme
          </span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Administrator
            </p>
            <p className="text-xs text-muted-foreground truncate">
              admin@myinvite.app
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
