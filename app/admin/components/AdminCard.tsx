export default function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-[#D9E3EC] shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}
