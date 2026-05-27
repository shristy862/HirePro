import {
  Bookmark,
  Briefcase,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const recruiterNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/recruiter",
    icon: LayoutDashboard,
    roles: ["recruiter"],
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
    roles: ["recruiter", "candidate"],
  },
  {
    title: "Applications",
    href: "/applications",
    icon: FileText,
    roles: ["recruiter", "candidate"],
  },
  // {
  //   title: "AI Insights",
  //   href: "/recruiter#ai",
  //   icon: Sparkles,
  //   roles: ["recruiter"],
  // },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["recruiter", "candidate"],
  },
];

export const candidateNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/candidate",
    icon: LayoutDashboard,
    roles: ["candidate"],
  },
  {
    title: "Browse Jobs",
    href: "/jobs",
    icon: Search,
    roles: ["candidate"],
  },
  {
    title: "Saved Jobs",
    href: "/saved-jobs",
    icon: Bookmark,
    roles: ["candidate"],
  },
  {
    title: "My Applications",
    href: "/applications",
    icon: FileText,
    roles: ["candidate"],
  },
  {
    title: "Profile",
    href: "/settings",
    icon: UserCircle,
    roles: ["candidate"],
  },
];

export function getNavForRole(role: UserRole): NavItem[] {
  return role === "recruiter" ? recruiterNav : candidateNav;
}

export const APP_NAME = "HireFlow";
export const APP_TAGLINE = "Recruitment automation";
