export default function StatusBadge({
  status,
}: {
  status: "verified" | "pending" | "rejected" | "active" | "inactive" | "suspended" | "resolved" | "open" | "escalated";
}) {
  const statusConfig = {
    verified: { bg: "bg-green-100", text: "text-green-800", label: "Verified" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    active: { bg: "bg-blue-100", text: "text-blue-800", label: "Active" },
    inactive: { bg: "bg-gray-100", text: "text-gray-800", label: "Inactive" },
    suspended: { bg: "bg-orange-100", text: "text-orange-800", label: "Suspended" },
    resolved: { bg: "bg-green-100", text: "text-green-800", label: "Resolved" },
    open: { bg: "bg-blue-100", text: "text-blue-800", label: "Open" },
    escalated: { bg: "bg-red-100", text: "text-red-800", label: "Escalated" },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
