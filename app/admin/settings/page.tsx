import AdminCard from "../components/AdminCard";
import { User, Bell, Lock, Palette, Building2, DollarSign, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1931]">Settings</h1>
        <p className="text-[#4A7FA7] mt-1">Manage your platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-[#4A7FA7]" />
            <h3 className="text-lg font-semibold text-[#0A1931]">Profile Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A1931] mb-2">Name</label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full px-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A1931] mb-2">Email</label>
              <input
                type="email"
                defaultValue="admin@homiepg.com"
                className="w-full px-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A3D63] text-white rounded-lg hover:bg-[#0A1931] transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-[#4A7FA7]" />
            <h3 className="text-lg font-semibold text-[#0A1931]">Security</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A1931] mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A1931] mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A1931] mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A3D63] text-white rounded-lg hover:bg-[#0A1931] transition-colors">
              <Save className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-[#4A7FA7]" />
            <h3 className="text-lg font-semibold text-[#0A1931]">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            {["Email Notifications", "Push Notifications", "SMS Alerts", "Weekly Reports"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-[#0A1931]">{item}</span>
                <input type="checkbox" className="w-5 h-5 text-[#1A3D63] rounded" defaultChecked />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-[#4A7FA7]" />
            <h3 className="text-lg font-semibold text-[#0A1931]">Commission Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A1931] mb-2">Platform Commission (%)</label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A3D63] text-white rounded-lg hover:bg-[#0A1931] transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </AdminCard>

        <AdminCard className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-[#4A7FA7]" />
            <h3 className="text-lg font-semibold text-[#0A1931]">Platform Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A1931] mb-2">Platform Name</label>
              <input
                type="text"
                defaultValue="HomiePG"
                className="w-full px-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A1931] mb-2">Support Email</label>
              <input
                type="email"
                defaultValue="support@homiepg.com"
                className="w-full px-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A3D63] text-white rounded-lg hover:bg-[#0A1931] transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
