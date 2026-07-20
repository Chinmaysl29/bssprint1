import AdminCard from "../components/AdminCard";
import StatusBadge from "../components/StatusBadge";
import { CheckCircle, User, AlertTriangle, ArrowUpRight, Eye, Calendar } from "lucide-react";

const complaints = [
  {
    id: "COMP-001",
    raisedBy: "Arjun Reddy",
    category: "Maintenance",
    priority: "high",
    assignedTo: "Support Team",
    status: "open",
    date: "2024-07-03",
    title: "Water leakage in room 305"
  },
  {
    id: "COMP-002",
    raisedBy: "Pooja Hegde",
    category: "Food",
    priority: "medium",
    assignedTo: "Rajesh Kumar",
    status: "open",
    date: "2024-07-02",
    title: "Mess food quality issues"
  },
  {
    id: "COMP-003",
    raisedBy: "Siddharth Nair",
    category: "WiFi",
    priority: "low",
    assignedTo: "Technical Team",
    status: "resolved",
    date: "2024-07-01",
    title: "Slow internet connection"
  },
  {
    id: "COMP-004",
    raisedBy: "Neha Kapoor",
    category: "Security",
    priority: "high",
    assignedTo: "Admin",
    status: "escalated",
    date: "2024-06-30",
    title: "Unauthorized person entry"
  },
];

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

export default function ComplaintsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1931]">Complaint Management</h1>
        <p className="text-[#4A7FA7] mt-1">Track and resolve user complaints</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {complaints.map((complaint) => (
          <AdminCard key={complaint.id} className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-[#1A3D63]">{complaint.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[complaint.priority]}`}>
                    {complaint.priority}
                  </span>
                  <StatusBadge status={complaint.status as any} />
                </div>
                <h3 className="text-lg font-semibold text-[#0A1931] mb-2">{complaint.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#4A7FA7]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Raised by: {complaint.raisedBy}
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Category: {complaint.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Assigned to: {complaint.assignedTo}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {complaint.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Resolve
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#D9E3EC] rounded-lg text-[#0A1931] hover:bg-[#EDF4FB] transition-colors">
                  <User className="w-4 h-4" />
                  Assign
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#D9E3EC] rounded-lg text-[#0A1931] hover:bg-[#EDF4FB] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                  Escalate
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#D9E3EC] rounded-lg text-[#0A1931] hover:bg-[#EDF4FB] transition-colors">
                  <Eye className="w-4 h-4" />
                  Details
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
