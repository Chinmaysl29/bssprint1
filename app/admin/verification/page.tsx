import AdminCard from "../components/AdminCard";
import StatusBadge from "../components/StatusBadge";
import { CheckCircle, XCircle, Eye, RefreshCw, FileText, User, CreditCard, Building, Camera } from "lucide-react";

const verificationQueue = [
  { 
    id: 1, 
    name: "Sunita Sharma", 
    documents: ["Aadhaar", "PAN", "Business Proof", "Profile Image"], 
    status: "pending" 
  },
  { 
    id: 2, 
    name: "Rahul Verma", 
    documents: ["Aadhaar", "PAN", "Profile Image"], 
    status: "pending" 
  },
  { 
    id: 3, 
    name: "Anita Desai", 
    documents: ["Aadhaar", "PAN", "Business Proof", "Profile Image"], 
    status: "pending" 
  },
];

const documentIcons: Record<string, any> = {
  "Aadhaar": CreditCard,
  "PAN": FileText,
  "Business Proof": Building,
  "Profile Image": Camera,
};

export default function OwnerVerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1931]">Owner Verification</h1>
        <p className="text-[#4A7FA7] mt-1">Review and verify PG owner documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verificationQueue.map((item) => (
          <AdminCard key={item.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#EDF4FB] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#1A3D63]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1931]">{item.name}</h3>
                  <StatusBadge status={item.status as any} />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-[#4A7FA7] mb-3">Documents Uploaded</p>
              <div className="space-y-2">
                {item.documents.map((doc) => {
                  const Icon = documentIcons[doc];
                  return (
                    <div key={doc} className="flex items-center gap-2 text-sm text-[#0A1931]">
                      <Icon className="w-4 h-4 text-[#4A7FA7]" />
                      {doc}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#D9E3EC] rounded-lg text-[#0A1931] hover:bg-[#EDF4FB] transition-colors">
                <Eye className="w-4 h-4" />
                View Docs
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#D9E3EC] rounded-lg text-[#0A1931] hover:bg-[#EDF4FB] transition-colors">
                <RefreshCw className="w-4 h-4" />
                Resubmit
              </button>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
