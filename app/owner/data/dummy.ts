export const buildings = [
  { id: '1', name: 'Sunrise PG', address: '12, MG Road, Koramangala', city: 'Bangalore', floors: 4, rooms: 24, beds: 72, occupied: 58, vacant: 10, reserved: 4, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80' },
  { id: '2', name: 'Green Valley PG', address: '34, 5th Cross, Indiranagar', city: 'Bangalore', floors: 3, rooms: 18, beds: 54, occupied: 40, vacant: 10, reserved: 4, image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80' },
  { id: '3', name: 'Blue Ridge PG', address: '78, HSR Layout, Sector 2', city: 'Bangalore', floors: 5, rooms: 30, beds: 90, occupied: 74, vacant: 12, reserved: 4, image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400&q=80' },
]

export const floors = [
  { id: '1', buildingId: '1', building: 'Sunrise PG', number: 'Ground Floor', rooms: 6, beds: 18, occupancy: 88 },
  { id: '2', buildingId: '1', building: 'Sunrise PG', number: '1st Floor', rooms: 6, beds: 18, occupancy: 75 },
  { id: '3', buildingId: '1', building: 'Sunrise PG', number: '2nd Floor', rooms: 6, beds: 18, occupancy: 80 },
  { id: '4', buildingId: '1', building: 'Sunrise PG', number: '3rd Floor', rooms: 6, beds: 18, occupancy: 72 },
  { id: '5', buildingId: '2', building: 'Green Valley PG', number: 'Ground Floor', rooms: 6, beds: 18, occupancy: 66 },
  { id: '6', buildingId: '2', building: 'Green Valley PG', number: '1st Floor', rooms: 6, beds: 18, occupancy: 78 },
  { id: '7', buildingId: '2', building: 'Green Valley PG', number: '2nd Floor', rooms: 6, beds: 18, occupancy: 82 },
  { id: '8', buildingId: '3', building: 'Blue Ridge PG', number: 'Ground Floor', rooms: 6, beds: 18, occupancy: 90 },
]

export const rooms = [
  { id: '1', number: '101', building: 'Sunrise PG', floor: 'Ground Floor', type: 'Triple', capacity: 3, occupied: 3, vacant: 0, status: 'occupied' },
  { id: '2', number: '102', building: 'Sunrise PG', floor: 'Ground Floor', type: 'Double', capacity: 2, occupied: 1, vacant: 1, status: 'available' },
  { id: '3', number: '103', building: 'Sunrise PG', floor: 'Ground Floor', type: 'Single', capacity: 1, occupied: 1, vacant: 0, status: 'occupied' },
  { id: '4', number: '201', building: 'Sunrise PG', floor: '1st Floor', type: 'Triple', capacity: 3, occupied: 2, vacant: 1, status: 'available' },
  { id: '5', number: '202', building: 'Sunrise PG', floor: '1st Floor', type: 'Double', capacity: 2, occupied: 0, vacant: 2, status: 'available' },
  { id: '6', number: '301', building: 'Green Valley PG', floor: 'Ground Floor', type: 'Dormitory', capacity: 6, occupied: 5, vacant: 1, status: 'available' },
  { id: '7', number: '302', building: 'Green Valley PG', floor: 'Ground Floor', type: 'Triple', capacity: 3, occupied: 3, vacant: 0, status: 'occupied' },
  { id: '8', number: '401', building: 'Blue Ridge PG', floor: '1st Floor', type: 'Single', capacity: 1, occupied: 0, vacant: 1, status: 'maintenance' },
]

export const beds = [
  { id: 'B1', roomId: '1', room: '101', building: 'Sunrise PG', label: 'Bed A', status: 'occupied', resident: 'Arjun Mehta' },
  { id: 'B2', roomId: '1', room: '101', building: 'Sunrise PG', label: 'Bed B', status: 'occupied', resident: 'Vikram Nair' },
  { id: 'B3', roomId: '1', room: '101', building: 'Sunrise PG', label: 'Bed C', status: 'occupied', resident: 'Kiran Das' },
  { id: 'B4', roomId: '2', room: '102', building: 'Sunrise PG', label: 'Bed A', status: 'occupied', resident: 'Rohit Sharma' },
  { id: 'B5', roomId: '2', room: '102', building: 'Sunrise PG', label: 'Bed B', status: 'available', resident: null },
  { id: 'B6', roomId: '3', room: '103', building: 'Sunrise PG', label: 'Bed A', status: 'occupied', resident: 'Suresh Kumar' },
  { id: 'B7', roomId: '4', room: '201', building: 'Sunrise PG', label: 'Bed A', status: 'occupied', resident: 'Manish Gupta' },
  { id: 'B8', roomId: '4', room: '201', building: 'Sunrise PG', label: 'Bed B', status: 'reserved', resident: null },
  { id: 'B9', roomId: '4', room: '201', building: 'Sunrise PG', label: 'Bed C', status: 'available', resident: null },
  { id: 'B10', roomId: '5', room: '202', building: 'Sunrise PG', label: 'Bed A', status: 'available', resident: null },
  { id: 'B11', roomId: '5', room: '202', building: 'Sunrise PG', label: 'Bed B', status: 'available', resident: null },
  { id: 'B12', roomId: '8', room: '401', building: 'Blue Ridge PG', label: 'Bed A', status: 'maintenance', resident: null },
]

export const residents = [
  { id: '1', name: 'Arjun Mehta', phone: '9876543210', email: 'arjun@email.com', building: 'Sunrise PG', room: '101', bed: 'Bed A', moveIn: '2024-01-15', moveOut: null, rent: 8000, deposit: 16000, status: 'active', kyc: 'approved', avatar: 'AM' },
  { id: '2', name: 'Vikram Nair', phone: '9876543211', email: 'vikram@email.com', building: 'Sunrise PG', room: '101', bed: 'Bed B', moveIn: '2024-02-01', moveOut: null, rent: 8000, deposit: 16000, status: 'active', kyc: 'approved', avatar: 'VN' },
  { id: '3', name: 'Rohit Sharma', phone: '9876543212', email: 'rohit@email.com', building: 'Sunrise PG', room: '102', bed: 'Bed A', moveIn: '2024-01-20', moveOut: null, rent: 10000, deposit: 20000, status: 'active', kyc: 'pending', avatar: 'RS' },
  { id: '4', name: 'Priya Patel', phone: '9876543213', email: 'priya@email.com', building: 'Green Valley PG', room: '301', bed: 'Bed C', moveIn: '2024-03-10', moveOut: null, rent: 7500, deposit: 15000, status: 'active', kyc: 'approved', avatar: 'PP' },
  { id: '5', name: 'Kiran Das', phone: '9876543214', email: 'kiran@email.com', building: 'Sunrise PG', room: '101', bed: 'Bed C', moveIn: '2024-02-15', moveOut: null, rent: 8000, deposit: 16000, status: 'active', kyc: 'rejected', avatar: 'KD' },
  { id: '6', name: 'Suresh Kumar', phone: '9876543215', email: 'suresh@email.com', building: 'Blue Ridge PG', room: '401', bed: 'Bed A', moveIn: '2023-12-01', moveOut: '2024-05-31', rent: 9000, deposit: 18000, status: 'inactive', kyc: 'approved', avatar: 'SK' },
]

export const payments = [
  { id: '1', resident: 'Arjun Mehta', room: '101', rent: 8000, dueDate: '2024-06-01', status: 'paid', receipt: 'REC-001' },
  { id: '2', resident: 'Vikram Nair', room: '101', rent: 8000, dueDate: '2024-06-01', status: 'paid', receipt: 'REC-002' },
  { id: '3', resident: 'Rohit Sharma', room: '102', rent: 10000, dueDate: '2024-06-01', status: 'overdue', receipt: null },
  { id: '4', resident: 'Priya Patel', room: '301', rent: 7500, dueDate: '2024-06-05', status: 'pending', receipt: null },
  { id: '5', resident: 'Kiran Das', room: '101', rent: 8000, dueDate: '2024-06-01', status: 'paid', receipt: 'REC-003' },
]

export const expenses = [
  { id: '1', category: 'Electricity', amount: 12000, date: '2024-05-31', status: 'paid', description: 'Monthly electricity bill' },
  { id: '2', category: 'Water', amount: 3500, date: '2024-05-31', status: 'paid', description: 'Water supply charges' },
  { id: '3', category: 'Internet', amount: 2000, date: '2024-06-01', status: 'pending', description: 'Broadband monthly plan' },
  { id: '4', category: 'Cleaning', amount: 5000, date: '2024-06-01', status: 'paid', description: 'Housekeeping staff' },
  { id: '5', category: 'Maintenance', amount: 8500, date: '2024-05-28', status: 'paid', description: 'Plumbing repairs' },
  { id: '6', category: 'Food', amount: 45000, date: '2024-05-31', status: 'paid', description: 'Monthly meal plan' },
]

export const employees = [
  { id: '1', name: 'Ramesh Kumar', role: 'Cook', phone: '9876500001', salary: 18000, status: 'active', avatar: 'RK', attendance: 26 },
  { id: '2', name: 'Meena Devi', role: 'Cleaner', phone: '9876500002', salary: 12000, status: 'active', avatar: 'MD', attendance: 28 },
  { id: '3', name: 'Rajesh Singh', role: 'Security', phone: '9876500003', salary: 15000, status: 'active', avatar: 'RS', attendance: 30 },
  { id: '4', name: 'Anita Sharma', role: 'Receptionist', phone: '9876500004', salary: 16000, status: 'active', avatar: 'AS', attendance: 27 },
  { id: '5', name: 'Sunil Patel', role: 'Manager', phone: '9876500005', salary: 28000, status: 'active', avatar: 'SP', attendance: 29 },
]

export const revenueData = [
  { month: 'Jan', revenue: 142000, expenses: 68000, profit: 74000 },
  { month: 'Feb', revenue: 148000, expenses: 72000, profit: 76000 },
  { month: 'Mar', revenue: 155000, expenses: 70000, profit: 85000 },
  { month: 'Apr', revenue: 150000, expenses: 75000, profit: 75000 },
  { month: 'May', revenue: 162000, expenses: 78000, profit: 84000 },
  { month: 'Jun', revenue: 158000, expenses: 74000, profit: 84000 },
]

export const occupancyData = [
  { month: 'Jan', occupancy: 82 },
  { month: 'Feb', occupancy: 85 },
  { month: 'Mar', occupancy: 88 },
  { month: 'Apr', occupancy: 84 },
  { month: 'May', occupancy: 90 },
  { month: 'Jun', occupancy: 87 },
]

export const expenseCategoryData = [
  { name: 'Food', value: 45000 },
  { name: 'Electricity', value: 12000 },
  { name: 'Maintenance', value: 8500 },
  { name: 'Staff', value: 89000 },
  { name: 'Water', value: 3500 },
  { name: 'Internet', value: 2000 },
]
