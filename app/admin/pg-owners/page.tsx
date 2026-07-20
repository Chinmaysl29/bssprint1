"use client";

import { useState } from "react";
import AdminCard from "../components/AdminCard";
import StatusBadge from "../components/StatusBadge";
import { Search, Filter, Eye, Edit, Ban, Trash2, User, Building2, Bed } from "lucide-react";

const owners = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", phone: "+91 98765 43210", city: "Bangalore", buildings: 3, beds: 120, verification: "verified", status: "active" },
  { id: 2, name: "Sunita Sharma", email: "sunita@example.com", phone: "+91 98765 43211", city: "Mumbai", buildings: 2, beds: 80, verification: "pending", status: "active" },
  { id: 3, name: "Amit Patel", email: "amit@example.com", phone: "+91 98765 43212", city: "Delhi", buildings: 5, beds: 200, verification: "verified", status: "active" },
  { id: 4, name: "Priya Singh", email: "priya@example.com", phone: "+91 98765 43213", city: "Pune", buildings: 1, beds: 40, verification: "rejected", status: "inactive" },
  { id: 5, name: "Vikram Mehta", email: "vikram@example.com", phone: "+91 98765 43214", city: "Hyderabad", buildings: 4, beds: 160, verification: "verified", status: "suspended" },
];

export default function PGOwnersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1931]">PG Owner Management</h1>
          <p className="text-[#4A7FA7] mt-1">Manage all PG owners on the platform</p>
        </div>
      </div>

      <AdminCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A7FA7]" />
            <input
              type="text"
              placeholder="Search owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent text-[#0A1931]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D9E3EC] rounded-lg text-[#0A1931] hover:bg-[#EDF4FB] transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D9E3EC]">
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Owner</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Contact</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">City</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Buildings</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Total Beds</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Verification</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id} className="border-b border-[#D9E3EC] hover:bg-[#EDF4FB] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EDF4FB] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#1A3D63]" />
                      </div>
                      <span className="font-medium text-[#0A1931]">{owner.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-[#0A1931]">{owner.email}</p>
                      <p className="text-[#4A7FA7]">{owner.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#0A1931]">{owner.city}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-[#0A1931]">
                      <Building2 className="w-4 h-4 text-[#4A7FA7]" />
                      {owner.buildings}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-[#0A1931]">
                      <Bed className="w-4 h-4 text-[#4A7FA7]" />
                      {owner.beds}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={owner.verification as any} />
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={owner.status as any} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#EDF4FB] rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-[#4A7FA7]" />
                      </button>
                      <button className="p-2 hover:bg-[#EDF4FB] rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-[#4A7FA7]" />
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

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[#4A7FA7]">Showing 1-5 of 1,248 owners</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-[#D9E3EC] rounded text-[#0A1931] hover:bg-[#EDF4FB]">Previous</button>
            <button className="px-3 py-1 bg-[#1A3D63] text-white rounded">1</button>
            <button className="px-3 py-1 border border-[#D9E3EC] rounded text-[#0A1931] hover:bg-[#EDF4FB]">2</button>
            <button className="px-3 py-1 border border-[#D9E3EC] rounded text-[#0A1931] hover:bg-[#EDF4FB]">3</button>
            <button className="px-3 py-1 border border-[#D9E3EC] rounded text-[#0A1931] hover:bg-[#EDF4FB]">Next</button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
