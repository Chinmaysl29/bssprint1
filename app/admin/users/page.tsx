"use client";

import { useState } from "react";
import AdminCard from "../components/AdminCard";
import StatusBadge from "../components/StatusBadge";
import { Search, Filter, Eye, Ban, Trash2, User } from "lucide-react";

const users = [
  { id: 1, name: "Arjun Reddy", email: "arjun@example.com", role: "customer", status: "active", bookings: 2, joined: "2024-01-15" },
  { id: 2, name: "Neha Kapoor", email: "neha@example.com", role: "owner", status: "active", bookings: 0, joined: "2023-11-20" },
  { id: 3, name: "Siddharth Nair", email: "siddharth@example.com", role: "customer", status: "inactive", bookings: 5, joined: "2023-09-10" },
  { id: 4, name: "Admin User", email: "admin@example.com", role: "admin", status: "active", bookings: 0, joined: "2023-01-01" },
  { id: 5, name: "Pooja Hegde", email: "pooja@example.com", role: "customer", status: "active", bookings: 1, joined: "2024-05-05" },
];

export default function UsersPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1931]">User Management</h1>
          <p className="text-[#4A7FA7] mt-1">Manage all users on the platform</p>
        </div>
      </div>

      <AdminCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-[#1A3D63] text-white"
                  : "bg-white border border-[#D9E3EC] text-[#0A1931] hover:bg-[#EDF4FB]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("customer")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "customer"
                  ? "bg-[#1A3D63] text-white"
                  : "bg-white border border-[#D9E3EC] text-[#0A1931] hover:bg-[#EDF4FB]"
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setFilter("owner")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "owner"
                  ? "bg-[#1A3D63] text-white"
                  : "bg-white border border-[#D9E3EC] text-[#0A1931] hover:bg-[#EDF4FB]"
              }`}
            >
              Owners
            </button>
            <button
              onClick={() => setFilter("admin")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "admin"
                  ? "bg-[#1A3D63] text-white"
                  : "bg-white border border-[#D9E3EC] text-[#0A1931] hover:bg-[#EDF4FB]"
              }`}
            >
              Admins
            </button>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A7FA7]" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent text-[#0A1931]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D9E3EC]">
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">User</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Email</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Role</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Bookings</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Joined Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#D9E3EC] hover:bg-[#EDF4FB] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EDF4FB] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#1A3D63]" />
                      </div>
                      <span className="font-medium text-[#0A1931]">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#0A1931]">{user.email}</td>
                  <td className="py-4 px-4 text-[#0A1931] capitalize">{user.role}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={user.status as any} />
                  </td>
                  <td className="py-4 px-4 text-[#0A1931]">{user.bookings}</td>
                  <td className="py-4 px-4 text-[#0A1931]">{user.joined}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#EDF4FB] rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-[#4A7FA7]" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <Ban className="w-4 h-4 text-red-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
