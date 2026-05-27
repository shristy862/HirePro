"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/constants/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useOptionalProfileContext } from "@/context/profile-context";
import { useAuthContext } from "@/context/auth-context";

interface SidebarProps {
  navItems: NavItem[];
  className?: string;
}

export function Sidebar({ navItems, className }: SidebarProps) {
  const pathname = usePathname();
  const { hasRole } = useAuthContext();
  const profileCtx = useOptionalProfileContext();
  const isCandidate = hasRole("candidate");
  const profilePct = profileCtx?.completion?.percentage;

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-sidebar lg:sticky lg:top-0 lg:h-screen",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Logo />
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">{item.title}</span>
                {isCandidate &&
                  item.href === "/settings" &&
                  profilePct !== undefined &&
                  !profileCtx?.error && (
                    <Badge
                      variant={
                        profileCtx?.completion?.isComplete
                          ? "default"
                          : "secondary"
                      }
                      className="ml-auto text-xs tabular-nums"
                    >
                      {profilePct}%
                    </Badge>
                  )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
