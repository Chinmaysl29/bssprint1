import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-6 bg-[#EDF4FB] rounded-full mb-4">
        <Icon className="w-12 h-12 text-[#4A7FA7]" />
      </div>
      <h3 className="text-xl font-semibold text-[#0A1931] mb-2">{title}</h3>
      <p className="text-[#4A7FA7] max-w-md">{description}</p>
    </div>
  );
}
