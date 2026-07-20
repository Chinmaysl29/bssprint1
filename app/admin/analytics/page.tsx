import AdminCard from "../components/AdminCard";
import { TrendingUp, Users, Building2, BarChart3, PieChart, MapPin, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1931]">Platform Analytics</h1>
        <p className="text-[#4A7FA7] mt-1">Deep insights into your platform&apos;s performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#4A7FA7]" />
            Platform Growth
          </h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Line Chart Placeholder</p>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#4A7FA7]" />
            User Growth
          </h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Bar Chart Placeholder</p>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#4A7FA7]" />
            Revenue Growth
          </h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Area Chart Placeholder</p>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#4A7FA7]" />
            PG Growth
          </h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Line Chart Placeholder</p>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#4A7FA7]" />
            Occupancy Rate
          </h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Pie Chart Placeholder</p>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#4A7FA7]" />
            Top Cities Distribution
          </h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Map/Bar Chart Placeholder</p>
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4">Most Booked PGs</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#F6FAFD] rounded-lg">
                <span className="text-[#0A1931]">PG {i}</span>
                <span className="text-[#1A3D63] font-semibold">{100 - i * 10} bookings</span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4">Customer Retention</h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Retention Chart Placeholder</p>
          </div>
        </AdminCard>
      </div>

      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold text-[#0A1931] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#4A7FA7]" />
          Monthly Active Users (MAU)
        </h3>
        <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
          <p className="text-[#4A7FA7]">MAU Chart Placeholder</p>
        </div>
      </AdminCard>
    </div>
  );
}
