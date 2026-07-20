import { LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#D9E3EC] p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#4A7FA7]">{title}</p>
          <p className="text-3xl font-bold text-[#0A1931] mt-2">{value}</p>
          {trendValue && (
            <p className={`text-sm mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trend === "up" ? "↑" : "↓"} {trendValue}
            </p>
          )}
        </div>
        <div className="p-3 bg-[#EDF4FB] rounded-lg">
          <Icon className="w-8 h-8 text-[#1A3D63]" />
        </div>
      </div>
    </div>
  );
}
