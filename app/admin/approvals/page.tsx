import AdminCard from "../components/AdminCard";
import { CheckCircle, XCircle, Eye, Building2, MapPin, Bed, Calendar, Users, Wifi, Tv } from "lucide-react";

const approvalRequests = [
  { 
    id: 1, 
    name: "Green Valley PG", 
    owner: "Rajesh Kumar", 
    location: "Koramangala, Bangalore", 
    capacity: 40, 
    amenities: ["WiFi", "TV", "AC", "Mess"], 
    submittedDate: "2024-07-01" 
  },
  { 
    id: 2, 
    name: "Comfort Stay PG", 
    owner: "Sunita Sharma", 
    location: "Andheri, Mumbai", 
    capacity: 30, 
    amenities: ["WiFi", "TV", "Mess"], 
    submittedDate: "2024-06-30" 
  },
  { 
    id: 3, 
    name: "Royal Residency PG", 
    owner: "Amit Patel", 
    location: "Connaught Place, Delhi", 
    capacity: 50, 
    amenities: ["WiFi", "TV", "AC", "Mess", "Gym"], 
    submittedDate: "2024-06-29" 
  },
];

const amenityIcons: Record<string, any> = {
  "WiFi": Wifi,
  "TV": Tv,
};

export default function PGApprovalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1931]">PG Approval Requests</h1>
        <p className="text-[#4A7FA7] mt-1">Review and approve new PG listings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {approvalRequests.map((pg) => (
          <AdminCard key={pg.id} className="overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-[#EDF4FB] to-[#B3CFE5]"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0A1931] mb-2">{pg.name}</h3>
              <p className="text-[#4A7FA7] mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {pg.owner}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#0A1931]">
                  <MapPin className="w-4 h-4 text-[#4A7FA7]" />
                  {pg.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0A1931]">
                  <Bed className="w-4 h-4 text-[#4A7FA7]" />
                  Capacity: {pg.capacity} beds
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0A1931]">
                  <Calendar className="w-4 h-4 text-[#4A7FA7]" />
                  Submitted: {pg.submittedDate}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-[#4A7FA7] mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {pg.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Building2;
                    return (
                      <span key={amenity} className="px-3 py-1 bg-[#F6FAFD] rounded-full text-xs text-[#0A1931] flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {amenity}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#D9E3EC] rounded-lg text-[#0A1931] hover:bg-[#EDF4FB] transition-colors">
                  <Eye className="w-4 h-4" />
                  Details
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
