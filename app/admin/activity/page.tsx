import AdminCard from "../components/AdminCard";
import { Activity, User, Calendar, Building2, FileCheck } from "lucide-react";

const activities = [
  { id: 1, action: "New user registered", user: "Arjun Reddy", time: "2 minutes ago", type: "user" },
  { id: 2, action: "PG listing approved", user: "Sunita Sharma", time: "15 minutes ago", type: "pg" },
  { id: 3, action: "Owner verified", user: "Rajesh Kumar", time: "1 hour ago", type: "owner" },
  { id: 4, action: "Complaint resolved", user: "Support Team", time: "2 hours ago", type: "complaint" },
  { id: 5, action: "Payment received", user: "Pooja Hegde", time: "3 hours ago", type: "payment" },
  { id: 6, action: "New PG owner registered", user: "Amit Patel", time: "4 hours ago", type: "owner" },
];

const activityIcons: Record<string, any> = {
  user: User,
  pg: Building2,
  owner: FileCheck,
  complaint: Activity,
  payment: Activity,
};

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1931]">Activity Logs</h1>
        <p className="text-[#4A7FA7] mt-1">Track all platform activities</p>
      </div>

      <AdminCard className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type] || Activity;
            return (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-[#F6FAFD] rounded-lg">
                <div className="w-10 h-10 bg-[#EDF4FB] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#1A3D63]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#0A1931] font-medium">{activity.action}</p>
                  <p className="text-sm text-[#4A7FA7]">By {activity.user}</p>
                </div>
                <div className="text-sm text-[#4A7FA7] flex items-center gap-2 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                  {activity.time}
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>
    </div>
  );
}
