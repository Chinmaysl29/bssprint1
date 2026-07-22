import AdminCard from "../components/AdminCard";
import { Bell, AlertTriangle, CheckCircle, User, Building2, FileCheck } from "lucide-react";

const notifications = [
  { id: 1, title: "New verification request", message: "Sunita Sharma has submitted documents for verification", time: "5 minutes ago", read: false, type: "owner" },
  { id: 2, title: "PG approval pending", message: "Green Valley PG is waiting for your approval", time: "30 minutes ago", read: false, type: "pg" },
  { id: 3, title: "High priority complaint", message: "Water leakage complaint needs immediate attention", time: "1 hour ago", read: false, type: "complaint" },
  { id: 4, title: "Monthly revenue report", message: "Your monthly revenue report is ready to view", time: "2 hours ago", read: true, type: "report" },
  { id: 5, title: "New user registered", message: "15 new users joined the platform today", time: "3 hours ago", read: true, type: "user" },
];

const notificationIcons: Record<string, any> = {
  owner: FileCheck,
  pg: Building2,
  complaint: AlertTriangle,
  report: CheckCircle,
  user: User,
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1931]">Notifications</h1>
          <p className="text-[#4A7FA7] mt-1">Stay updated with platform activities</p>
        </div>
        <button className="px-4 py-2 bg-[#1A3D63] text-white rounded-lg hover:bg-[#0A1931] transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notificationIcons[notification.type] || Bell;
          return (
            <AdminCard key={notification.id} className={`p-6 ${!notification.read ? "border-l-4 border-l-[#4A7FA7]" : ""}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${notification.read ? "bg-[#E8EEF5]" : "bg-[#EDF4FB]"}`}>
                  <Icon className={`w-6 h-6 ${notification.read ? "text-[#4A7FA7]" : "text-[#1A3D63]"}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${notification.read ? "text-[#4A7FA7]" : "text-[#0A1931]"}`}>{notification.title}</h3>
                  <p className={`text-sm mt-1 ${notification.read ? "text-[#4A7FA7]" : "text-[#0A1931]"}`}>{notification.message}</p>
                  <p className="text-xs text-[#4A7FA7] mt-2">{notification.time}</p>
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
