export const owners = [
  { id: '1', name: 'Ravi Kumar', email: 'ravi@email.com', phone: '9876543200', joinDate: '2024-01-15', status: 'active', verification: 'verified', properties: 3, beds: 72, revenue: 456000, city: 'Bangalore' },
  { id: '2', name: 'Meera Nair', email: 'meera@email.com', phone: '9876543201', joinDate: '2024-02-10', status: 'active', verification: 'verified', properties: 1, beds: 18, revenue: 162000, city: 'Bangalore' },
  { id: '3', name: 'Suresh Patel', email: 'suresh@email.com', phone: '9876543202', joinDate: '2024-03-05', status: 'active', verification: 'pending', properties: 1, beds: 30, revenue: 0, city: 'Pune' },
  { id: '4', name: 'Anita Sharma', email: 'anita@email.com', phone: '9876543203', joinDate: '2024-04-20', status: 'suspended', verification: 'verified', properties: 1, beds: 20, revenue: 84000, city: 'Bangalore' },
  { id: '5', name: 'Deepak Joshi', email: 'deepak@email.com', phone: '9876543204', joinDate: '2024-05-15', status: 'active', verification: 'rejected', properties: 0, beds: 0, revenue: 0, city: 'Mumbai' },
]

export const properties = [
  { id: '1', name: 'Sunrise PG', ownerId: '1', owner: 'Ravi Kumar', address: '12, MG Road, Koramangala', city: 'Bangalore', status: 'live', submittedDate: '2024-01-20', approvedDate: '2024-01-25', buildings: 2, rooms: 24, beds: 72, occupied: 58, rent: 8000, amenities: ['WiFi', 'Food', 'Parking', 'Laundry', 'CCTV'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80', gender: 'Male' },
  { id: '2', name: 'Green Valley PG', ownerId: '2', owner: 'Meera Nair', address: '34, 5th Cross, Indiranagar', city: 'Bangalore', status: 'live', submittedDate: '2024-02-12', approvedDate: '2024-02-16', buildings: 1, rooms: 18, beds: 54, occupied: 40, rent: 10000, amenities: ['WiFi', 'Food', 'AC', 'Laundry'], image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', gender: 'Female' },
  { id: '3', name: 'Blue Ridge PG', ownerId: '1', owner: 'Ravi Kumar', address: '78, HSR Layout, Sector 2', city: 'Bangalore', status: 'live', submittedDate: '2024-02-01', approvedDate: '2024-02-08', buildings: 1, rooms: 30, beds: 90, occupied: 74, rent: 7500, amenities: ['WiFi', 'Parking', 'Gym'], image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80', gender: 'Male' },
  { id: '4', name: 'Urban Nest PG', ownerId: '4', owner: 'Anita Sharma', address: '45, Whitefield Main Rd', city: 'Bangalore', status: 'suspended', submittedDate: '2024-03-10', approvedDate: '2024-03-15', buildings: 1, rooms: 20, beds: 60, occupied: 0, rent: 12000, amenities: ['WiFi', 'Food', 'AC', 'Gym'], image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80', gender: 'Both' },
  { id: '5', name: 'Skyview PG', ownerId: '1', owner: 'Ravi Kumar', address: '90, BTM Layout 2nd Stage', city: 'Bangalore', status: 'pending', submittedDate: '2024-06-01', approvedDate: null, buildings: 1, rooms: 12, beds: 36, occupied: 0, rent: 9000, amenities: ['WiFi', 'Food', 'Laundry'], image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', gender: 'Male' },
  { id: '6', name: 'Horizon PG', ownerId: '3', owner: 'Suresh Patel', address: '22, FC Road', city: 'Pune', status: 'pending', submittedDate: '2024-06-05', approvedDate: null, buildings: 1, rooms: 15, beds: 45, occupied: 0, rent: 7000, amenities: ['WiFi', 'Parking'], image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', gender: 'Both' },
  { id: '7', name: 'Royal Stay PG', ownerId: '2', owner: 'Meera Nair', address: '15, Jayanagar 4th Block', city: 'Bangalore', status: 'rejected', submittedDate: '2024-05-10', approvedDate: null, buildings: 1, rooms: 8, beds: 24, occupied: 0, rent: 11000, amenities: ['WiFi', 'AC'], image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=400&q=80', gender: 'Female' },
  { id: '8', name: 'Elite Homes PG', ownerId: '4', owner: 'Anita Sharma', address: '67, Marathahalli', city: 'Bangalore', status: 'approved', submittedDate: '2024-05-20', approvedDate: '2024-05-28', buildings: 2, rooms: 20, beds: 60, occupied: 0, rent: 9500, amenities: ['WiFi', 'Food', 'AC', 'Parking'], image: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=400&q=80', gender: 'Both' },
]

export const customers = [
  { id: '1', name: 'Arjun Mehta', email: 'arjun@email.com', phone: '9876543210', joinDate: '2024-01-20', status: 'active', bookings: 2, currentPg: 'Sunrise PG', kyc: 'verified' },
  { id: '2', name: 'Vikram Nair', email: 'vikram@email.com', phone: '9876543211', joinDate: '2024-02-01', status: 'active', bookings: 1, currentPg: 'Sunrise PG', kyc: 'verified' },
  { id: '3', name: 'Rohit Sharma', email: 'rohit@email.com', phone: '9876543212', joinDate: '2024-02-10', status: 'active', bookings: 1, currentPg: 'Sunrise PG', kyc: 'pending' },
  { id: '4', name: 'Priya Patel', email: 'priya@email.com', phone: '9876543213', joinDate: '2024-03-05', status: 'active', bookings: 1, currentPg: 'Green Valley PG', kyc: 'verified' },
  { id: '5', name: 'Kiran Das', email: 'kiran@email.com', phone: '9876543214', joinDate: '2024-03-10', status: 'active', bookings: 1, currentPg: 'Sunrise PG', kyc: 'rejected' },
  { id: '6', name: 'Suresh Kumar', email: 'suresh.k@email.com', phone: '9876543215', joinDate: '2023-12-01', status: 'inactive', bookings: 3, currentPg: null, kyc: 'verified' },
  { id: '7', name: 'Ananya Singh', email: 'ananya@email.com', phone: '9876543216', joinDate: '2024-04-01', status: 'active', bookings: 1, currentPg: 'Green Valley PG', kyc: 'verified' },
  { id: '8', name: 'Rahul Gupta', email: 'rahul@email.com', phone: '9876543217', joinDate: '2024-04-15', status: 'active', bookings: 1, currentPg: 'Blue Ridge PG', kyc: 'pending' },
  { id: '9', name: 'Divya Menon', email: 'divya@email.com', phone: '9876543218', joinDate: '2024-05-01', status: 'suspended', bookings: 0, currentPg: null, kyc: 'verified' },
  { id: '10', name: 'Arun Krishnan', email: 'arun@email.com', phone: '9876543219', joinDate: '2024-05-20', status: 'active', bookings: 1, currentPg: 'Blue Ridge PG', kyc: 'verified' },
]

export const residents = [
  { id: '1', name: 'Arjun Mehta', property: 'Sunrise PG', propertyId: '1', room: '101', bed: 'Bed A', checkIn: '2024-01-25', rent: 8000, deposit: 16000, kyc: 'verified', status: 'active' },
  { id: '2', name: 'Vikram Nair', property: 'Sunrise PG', propertyId: '1', room: '101', bed: 'Bed B', checkIn: '2024-02-01', rent: 8000, deposit: 16000, kyc: 'verified', status: 'active' },
  { id: '3', name: 'Rohit Sharma', property: 'Sunrise PG', propertyId: '1', room: '102', bed: 'Bed A', checkIn: '2024-02-10', rent: 8000, deposit: 16000, kyc: 'pending', status: 'active' },
  { id: '4', name: 'Priya Patel', property: 'Green Valley PG', propertyId: '2', room: '201', bed: 'Bed C', checkIn: '2024-03-05', rent: 10000, deposit: 20000, kyc: 'verified', status: 'active' },
  { id: '5', name: 'Kiran Das', property: 'Sunrise PG', propertyId: '1', room: '101', bed: 'Bed C', checkIn: '2024-03-10', rent: 8000, deposit: 16000, kyc: 'rejected', status: 'active' },
  { id: '6', name: 'Ananya Singh', property: 'Green Valley PG', propertyId: '2', room: '202', bed: 'Bed A', checkIn: '2024-04-01', rent: 10000, deposit: 20000, kyc: 'verified', status: 'active' },
  { id: '7', name: 'Rahul Gupta', property: 'Blue Ridge PG', propertyId: '3', room: '301', bed: 'Bed A', checkIn: '2024-04-15', rent: 7500, deposit: 15000, kyc: 'pending', status: 'active' },
  { id: '8', name: 'Arun Krishnan', property: 'Blue Ridge PG', propertyId: '3', room: '302', bed: 'Bed B', checkIn: '2024-05-20', rent: 7500, deposit: 15000, kyc: 'verified', status: 'active' },
  { id: '9', name: 'Manish Gupta', property: 'Sunrise PG', propertyId: '1', room: '201', bed: 'Bed A', checkIn: '2024-03-15', rent: 8000, deposit: 16000, kyc: 'verified', status: 'active' },
  { id: '10', name: 'Sneha Rao', property: 'Green Valley PG', propertyId: '2', room: '103', bed: 'Bed A', checkIn: '2024-04-10', rent: 10000, deposit: 20000, kyc: 'verified', status: 'active' },
  { id: '11', name: 'Pavithra K', property: 'Green Valley PG', propertyId: '2', room: '103', bed: 'Bed B', checkIn: '2024-05-01', rent: 10000, deposit: 20000, kyc: 'verified', status: 'active' },
  { id: '12', name: 'Sanjay M', property: 'Blue Ridge PG', propertyId: '3', room: '401', bed: 'Bed A', checkIn: '2024-05-15', rent: 7500, deposit: 15000, kyc: 'pending', status: 'active' },
  { id: '13', name: 'Kartik N', property: 'Sunrise PG', propertyId: '1', room: '302', bed: 'Bed A', checkIn: '2024-02-20', rent: 8000, deposit: 16000, kyc: 'verified', status: 'active' },
  { id: '14', name: 'Akash P', property: 'Blue Ridge PG', propertyId: '3', room: '501', bed: 'Bed C', checkIn: '2024-03-25', rent: 7500, deposit: 15000, kyc: 'verified', status: 'active' },
  { id: '15', name: 'Nithya S', property: 'Green Valley PG', propertyId: '2', room: '301', bed: 'Bed A', checkIn: '2024-06-01', rent: 10000, deposit: 20000, kyc: 'pending', status: 'active' },
  { id: '16', name: 'Surya V', property: 'Sunrise PG', propertyId: '1', room: '401', bed: 'Bed B', checkIn: '2024-04-05', rent: 8000, deposit: 16000, kyc: 'verified', status: 'active' },
  { id: '17', name: 'Ganesh T', property: 'Blue Ridge PG', propertyId: '3', room: '201', bed: 'Bed A', checkIn: '2024-05-10', rent: 7500, deposit: 15000, kyc: 'verified', status: 'active' },
  { id: '18', name: 'Lakshmi D', property: 'Green Valley PG', propertyId: '2', room: '401', bed: 'Bed C', checkIn: '2024-04-20', rent: 10000, deposit: 20000, kyc: 'verified', status: 'active' },
  { id: '19', name: 'Naveen R', property: 'Sunrise PG', propertyId: '1', room: '501', bed: 'Bed A', checkIn: '2024-05-05', rent: 8000, deposit: 16000, kyc: 'verified', status: 'active' },
  { id: '20', name: 'Pooja V', property: 'Green Valley PG', propertyId: '2', room: '501', bed: 'Bed B', checkIn: '2024-06-01', rent: 10000, deposit: 20000, kyc: 'pending', status: 'active' },
]

export const complaints = [
  { id: 'CMP001', propertyId: '1', property: 'Sunrise PG', residentId: '1', resident: 'Arjun Mehta', owner: 'Ravi Kumar', category: 'Maintenance', description: 'AC not working in Room 101 for the past 2 weeks. Raised multiple times to owner with no response.', status: 'open', priority: 'high', raisedDate: '2024-06-01', adminNote: '' },
  { id: 'CMP002', propertyId: '2', property: 'Green Valley PG', residentId: '4', resident: 'Priya Patel', owner: 'Meera Nair', category: 'Food', description: 'Food quality has significantly deteriorated. Stale food being served regularly.', status: 'in_progress', priority: 'medium', raisedDate: '2024-05-28', adminNote: 'Owner notified on June 1. Follow-up pending.' },
  { id: 'CMP003', propertyId: '3', property: 'Blue Ridge PG', residentId: '7', resident: 'Rahul Gupta', owner: 'Ravi Kumar', category: 'Hygiene', description: 'Common bathrooms are not cleaned regularly. Serious hygiene concerns.', status: 'open', priority: 'critical', raisedDate: '2024-06-03', adminNote: '' },
  { id: 'CMP004', propertyId: '1', property: 'Sunrise PG', residentId: '3', resident: 'Rohit Sharma', owner: 'Ravi Kumar', category: 'Payment', description: 'Owner charging extra ₹500 per month without explanation or new agreement.', status: 'in_progress', priority: 'high', raisedDate: '2024-05-25', adminNote: 'Investigating payment records.' },
  { id: 'CMP005', propertyId: '2', property: 'Green Valley PG', residentId: '6', resident: 'Ananya Singh', owner: 'Meera Nair', category: 'Behavior', description: 'Owner being rude and uncooperative when asked about basic amenity repairs.', status: 'resolved', priority: 'medium', raisedDate: '2024-05-15', adminNote: 'Owner counseled. Issue resolved.' },
  { id: 'CMP006', propertyId: '3', property: 'Blue Ridge PG', residentId: '8', resident: 'Arun Krishnan', owner: 'Ravi Kumar', category: 'Maintenance', description: 'WiFi connectivity issues in Block A for the past month.', status: 'resolved', priority: 'low', raisedDate: '2024-05-10', adminNote: 'ISP issue resolved.' },
  { id: 'CMP007', propertyId: '1', property: 'Sunrise PG', residentId: '9', resident: 'Manish Gupta', owner: 'Ravi Kumar', category: 'Other', description: 'Security guard is not present at night. Safety concerns.', status: 'open', priority: 'critical', raisedDate: '2024-06-04', adminNote: '' },
  { id: 'CMP008', propertyId: '2', property: 'Green Valley PG', residentId: '10', resident: 'Sneha Rao', owner: 'Meera Nair', category: 'Maintenance', description: 'Geyser in Room 103 not working. No hot water for 10 days.', status: 'in_progress', priority: 'medium', raisedDate: '2024-05-30', adminNote: 'Plumber scheduled for June 6.' },
  { id: 'CMP009', propertyId: '1', property: 'Sunrise PG', residentId: '13', resident: 'Kartik N', owner: 'Ravi Kumar', category: 'Food', description: 'Mess facility closed without prior notice on multiple occasions.', status: 'open', priority: 'medium', raisedDate: '2024-06-02', adminNote: '' },
  { id: 'CMP010', propertyId: '3', property: 'Blue Ridge PG', residentId: '14', resident: 'Akash P', owner: 'Ravi Kumar', category: 'Payment', description: 'Deposit refund not returned 3 months after checkout.', status: 'in_progress', priority: 'high', raisedDate: '2024-05-01', adminNote: 'Legal team notified. Owner given 2-week deadline.' },
]

export const documents = [
  { id: '1', ownerId: '1', owner: 'Ravi Kumar', type: 'Aadhaar Card', fileName: 'ravi_aadhaar.pdf', uploadDate: '2024-01-16', status: 'approved', reviewedBy: 'Super Admin', reviewDate: '2024-01-18', note: '' },
  { id: '2', ownerId: '1', owner: 'Ravi Kumar', type: 'Business License', fileName: 'ravi_license.pdf', uploadDate: '2024-01-16', status: 'approved', reviewedBy: 'Super Admin', reviewDate: '2024-01-18', note: '' },
  { id: '3', ownerId: '2', owner: 'Meera Nair', type: 'Aadhaar Card', fileName: 'meera_aadhaar.pdf', uploadDate: '2024-02-11', status: 'approved', reviewedBy: 'Super Admin', reviewDate: '2024-02-13', note: '' },
  { id: '4', ownerId: '3', owner: 'Suresh Patel', type: 'Aadhaar Card', fileName: 'suresh_aadhaar.pdf', uploadDate: '2024-03-06', status: 'pending', reviewedBy: null, reviewDate: null, note: '' },
  { id: '5', ownerId: '3', owner: 'Suresh Patel', type: 'Property Ownership Proof', fileName: 'suresh_ownership.pdf', uploadDate: '2024-03-06', status: 'pending', reviewedBy: null, reviewDate: null, note: '' },
  { id: '6', ownerId: '4', owner: 'Anita Sharma', type: 'Business License', fileName: 'anita_license.pdf', uploadDate: '2024-04-21', status: 'rejected', reviewedBy: 'Super Admin', reviewDate: '2024-04-24', note: 'Document expired. Please upload valid license.' },
  { id: '7', ownerId: '5', owner: 'Deepak Joshi', type: 'Aadhaar Card', fileName: 'deepak_aadhaar.pdf', uploadDate: '2024-05-16', status: 'rejected', reviewedBy: 'Super Admin', reviewDate: '2024-05-18', note: 'Blurry image. Illegible details.' },
  { id: '8', ownerId: '5', owner: 'Deepak Joshi', type: 'PAN Card', fileName: 'deepak_pan.pdf', uploadDate: '2024-05-16', status: 'pending', reviewedBy: null, reviewDate: null, note: '' },
]

export const revenueData = [
  { month: 'Jan', bookings: 38, totalRent: 285000, commission: 5700, ownerPayout: 279300 },
  { month: 'Feb', bookings: 42, totalRent: 312000, commission: 6240, ownerPayout: 305760 },
  { month: 'Mar', bookings: 51, totalRent: 378000, commission: 7560, ownerPayout: 370440 },
  { month: 'Apr', bookings: 48, totalRent: 356000, commission: 7120, ownerPayout: 348880 },
  { month: 'May', bookings: 55, totalRent: 412000, commission: 8240, ownerPayout: 403760 },
  { month: 'Jun', bookings: 58, totalRent: 436000, commission: 8720, ownerPayout: 427280 },
]

export const growthData = [
  { month: 'Jan', owners: 2, customers: 8, bookings: 38 },
  { month: 'Feb', owners: 1, customers: 12, bookings: 42 },
  { month: 'Mar', owners: 1, customers: 18, bookings: 51 },
  { month: 'Apr', owners: 0, customers: 15, bookings: 48 },
  { month: 'May', owners: 1, customers: 22, bookings: 55 },
  { month: 'Jun', owners: 0, customers: 19, bookings: 58 },
]

export const occupancyData = [
  { month: 'Jan', occupancy: 72 },
  { month: 'Feb', occupancy: 75 },
  { month: 'Mar', occupancy: 80 },
  { month: 'Apr', occupancy: 78 },
  { month: 'May', occupancy: 85 },
  { month: 'Jun', occupancy: 82 },
]

export const cityOccupancy = [
  { city: 'Bangalore', properties: 6, beds: 294, occupied: 172, rate: 58 },
  { city: 'Pune', properties: 1, beds: 45, occupied: 0, rate: 0 },
  { city: 'Mumbai', properties: 0, beds: 0, occupied: 0, rate: 0 },
]

export const activityFeed = [
  { id: '1', type: 'new_owner', message: 'Deepak Joshi registered as a new PG owner', time: '2 hours ago', icon: 'user' },
  { id: '2', type: 'new_property', message: 'Skyview PG submitted for approval by Ravi Kumar', time: '5 hours ago', icon: 'building' },
  { id: '3', type: 'complaint', message: 'Critical complaint raised at Blue Ridge PG by Rahul Gupta', time: '8 hours ago', icon: 'alert' },
  { id: '4', type: 'document', message: 'Suresh Patel uploaded Aadhaar for verification', time: '1 day ago', icon: 'file' },
  { id: '5', type: 'booking', message: 'Pooja V booked Bed B at Green Valley PG', time: '1 day ago', icon: 'calendar' },
  { id: '6', type: 'property', message: 'Urban Nest PG suspended due to policy violations', time: '2 days ago', icon: 'ban' },
  { id: '7', type: 'document', message: "Deepak Joshi's Aadhaar document rejected", time: '2 days ago', icon: 'x' },
]
