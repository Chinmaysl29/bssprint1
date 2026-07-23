"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Building2,
  UserCheck,
  DollarSign,
  AlertCircle,
  BarChart3,
  Activity,
  Bell,
  Settings,
  Menu,
  X,
  Home,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "PG Owners", href: "/admin/pg-owners", icon: Users },
  { title: "PG Verification", href: "/admin/verification", icon: FileCheck },
  { title: "PG Approval Requests", href: "/admin/approvals", icon: Building2 },
  { title: "Users", href: "/admin/users", icon: UserCheck },
  { title: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { title: "Complaints", href: "/admin/complaints", icon: AlertCircle },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Activity Logs", href: "/admin/activity", icon: Activity },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`bg-[#0A1931] text-white transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen flex flex-col`}
    >
      <div className="p-6 border-b border-[#1A3D63] flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <Home className="w-8 h-8 text-[#B3CFE5]" />
          {!isCollapsed && (
            <span className="text-xl font-bold">HomiePG</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-[#1A3D63] rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#1A3D63] text-white"
                  : "text-[#B3CFE5] hover:bg-[#1A3D63] hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
