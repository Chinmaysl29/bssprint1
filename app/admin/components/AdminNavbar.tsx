import { Search, Bell, User, Calendar, Sun } from "lucide-react";

export default function AdminNavbar() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white border-b border-[#D9E3EC] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A7FA7]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-[#D9E3EC] rounded-lg bg-[#F6FAFD] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent text-[#0A1931]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[#4A7FA7]">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium hidden md:inline">{currentDate}</span>
        </div>

        <button className="p-2 hover:bg-[#EDF4FB] rounded-lg transition-colors">
          <Sun className="w-5 h-5 text-[#4A7FA7]" />
        </button>

        <button className="p-2 hover:bg-[#EDF4FB] rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-[#4A7FA7]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#D9E3EC]">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-[#0A1931]">Admin User</p>
            <p className="text-xs text-[#4A7FA7]">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-[#EDF4FB] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[#1A3D63]" />
          </div>
        </div>
      </div>
    </header>
  );
}
