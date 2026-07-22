import StatCard from "../components/StatCard";
import AdminCard from "../components/AdminCard";
import { DollarSign, TrendingUp, Calendar, Users, MapPin, Building2 } from "lucide-react";

const recentTransactions = [
  { id: 1, user: "Arjun Reddy", amount: "₹15,000", date: "2024-07-03", type: "Booking" },
  { id: 2, user: "Sunita Sharma", amount: "₹25,000", date: "2024-07-02", type: "Commission" },
  { id: 3, user: "Rajesh Kumar", amount: "₹30,000", date: "2024-07-01", type: "Commission" },
  { id: 4, user: "Neha Kapoor", amount: "₹12,000", date: "2024-06-30", type: "Subscription" },
];

const topCities = [
  { city: "Bangalore", revenue: "₹4,50,000", percentage: 35 },
  { city: "Mumbai", revenue: "₹3,20,000", percentage: 25 },
  { city: "Delhi", revenue: "₹2,80,000", percentage: 22 },
  { city: "Pune", revenue: "₹1,95,670", percentage: 18 },
];

const topOwners = [
  { name: "Rajesh Kumar", revenue: "₹1,20,000", pgCount: 3 },
  { name: "Amit Patel", revenue: "₹95,000", pgCount: 5 },
  { name: "Sunita Sharma", revenue: "₹80,000", pgCount: 2 },
];

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1931]">Revenue Dashboard</h1>
        <p className="text-[#4A7FA7] mt-1">Track your platform&apos;s financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Revenue"
          value="₹12,45,670"
          icon={DollarSign}
          trend="up"
          trendValue="18% this month"
        />
        <StatCard
          title="Annual Revenue"
          value="₹1,45,67,890"
          icon={TrendingUp}
          trend="up"
          trendValue="22% this year"
        />
        <StatCard
          title="Total Commission"
          value="₹45,67,890"
          icon={DollarSign}
          trend="up"
          trendValue="15% this year"
        />
        <StatCard
          title="Active Subscriptions"
          value="876"
          icon={Users}
          trend="up"
          trendValue="12% this month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4">Revenue Trend</h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Chart Placeholder</p>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4">Subscription Breakdown</h3>
          <div className="h-64 bg-[#F6FAFD] rounded-lg flex items-center justify-center">
            <p className="text-[#4A7FA7]">Chart Placeholder</p>
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4">Top Cities by Revenue</h3>
          <div className="space-y-4">
            {topCities.map((city, index) => (
              <div key={city.city} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#EDF4FB] rounded-full flex items-center justify-center text-[#1A3D63] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[#0A1931] font-medium">
                      <MapPin className="w-4 h-4 text-[#4A7FA7]" />
                      {city.city}
                    </div>
                    <p className="text-sm text-[#4A7FA7]">{city.revenue}</p>
                  </div>
                </div>
                <span className="text-[#1A3D63] font-bold">{city.percentage}%</span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-[#0A1931] mb-4">Highest Revenue Owners</h3>
          <div className="space-y-4">
            {topOwners.map((owner, index) => (
              <div key={owner.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#EDF4FB] rounded-full flex items-center justify-center text-[#1A3D63] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[#0A1931] font-medium">
                      <Building2 className="w-4 h-4 text-[#4A7FA7]" />
                      {owner.name}
                    </div>
                    <p className="text-sm text-[#4A7FA7]">{owner.pgCount} PGs</p>
                  </div>
                </div>
                <span className="text-[#1A3D63] font-bold">{owner.revenue}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold text-[#0A1931] mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D9E3EC]">
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">User</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Type</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#0A1931]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-[#D9E3EC] hover:bg-[#EDF4FB] transition-colors">
                  <td className="py-4 px-4 text-[#0A1931] font-medium">{txn.user}</td>
                  <td className="py-4 px-4 text-[#0A1931]">{txn.type}</td>
                  <td className="py-4 px-4 text-[#0A1931]">{txn.date}</td>
                  <td className="py-4 px-4 text-[#1A3D63] font-bold">{txn.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
