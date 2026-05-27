"use client";

import Link from "next/link";
import { Bell, LogOut, Search } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/auth-context";
import { getUploadPublicUrl } from "@/lib/utils/uploads";
import { formatUserRole } from "@/lib/utils/format-role";
import type { NavItem } from "@/constants/navigation";
import type { UserRole } from "@/types";
import { toast } from "sonner";

interface NavbarProps {
  navItems: NavItem[];
  user?: {
    name: string;
    email: string;
    role?: UserRole;
    avatar?: string;
  };
}

export function Navbar({ navItems, user }: NavbarProps) {
  const { logout } = useAuthContext();
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "HF";

  const avatarUrl = getUploadPublicUrl(user?.avatar);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <MobileNav navItems={navItems} />
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search
          className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search jobs, candidates..."
          className="pl-9"
          aria-label="Global search"
        />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative size-8 rounded-full p-0"
              aria-label="User menu"
            >
              <Avatar className="size-8">
                <AvatarImage src={avatarUrl ?? undefined} alt={user?.name} />
                <AvatarFallback className="bg-violet-600 text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="space-y-1">
              <p className="font-medium">{user?.name ?? "User"}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {user?.email ?? "user@hireflow.ai"}
              </p>
              {user?.role && (
                <p className="text-xs font-medium capitalize text-violet-600 dark:text-violet-400">
                  {formatUserRole(user.role)}
                </p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Profile settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
