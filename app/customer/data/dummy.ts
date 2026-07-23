export const pgListings = [
  {
    id: '1', name: 'Sunrise PG', location: 'Koramangala, Bangalore', area: 'Koramangala',
    city: 'Bangalore', price: 8000, deposit: 16000, rating: 4.7, reviews: 128,
    availableBeds: 4, totalBeds: 24, gender: 'Male', category: 'boys', food: true, wifi: true,
    parking: true, ac: false, gym: false, laundry: true, verified: true,
    distance: '1.2 km', type: 'Triple Sharing',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    ],
    owner: 'Ravi Kumar', ownerAvatar: 'RK',
    description: 'Premium PG with all modern amenities. Well-ventilated rooms, hygienic food, 24/7 security.',
    rules: ['No smoking', 'No alcohol', 'Guests allowed till 9 PM', 'Quiet hours after 10 PM'],
    amenities: ['WiFi', 'Food', 'Parking', 'Laundry', 'CCTV', 'Power Backup'],
  },
  {
    id: '2', name: 'Green Valley PG', location: 'Indiranagar, Bangalore', area: 'Indiranagar',
    city: 'Bangalore', price: 10000, deposit: 20000, rating: 4.5, reviews: 94,
    availableBeds: 2, totalBeds: 18, gender: 'Female', category: 'girls', food: true, wifi: true,
    parking: false, ac: true, gym: false, laundry: true, verified: true,
    distance: '0.8 km', type: 'Double Sharing',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&q=80',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&q=80',
    ],
    owner: 'Meera Nair', ownerAvatar: 'MN',
    description: 'Cozy female PG in the heart of Indiranagar. Safe, secure, and home-like atmosphere.',
    rules: ['Ladies only', 'No smoking', 'No outside food after 9 PM'],
    amenities: ['WiFi', 'Food', 'AC', 'Laundry', 'CCTV', 'Power Backup'],
  },
  {
    id: '3', name: 'Blue Ridge PG', location: 'HSR Layout, Bangalore', area: 'HSR Layout',
    city: 'Bangalore', price: 7500, deposit: 15000, rating: 4.3, reviews: 67,
    availableBeds: 8, totalBeds: 30, gender: 'Male', category: 'boys', food: false, wifi: true,
    parking: true, ac: false, gym: true, laundry: false, verified: true,
    distance: '2.1 km', type: 'Triple Sharing',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    ],
    owner: 'Suresh Patel', ownerAvatar: 'SP',
    description: 'Budget-friendly PG with gym facilities. Ideal for working professionals.',
    rules: ['No smoking inside', 'Guests allowed on weekends only'],
    amenities: ['WiFi', 'Parking', 'Gym', 'CCTV', 'Power Backup'],
  },
  {
    id: '4', name: 'Urban Nest PG', location: 'Whitefield, Bangalore', area: 'Whitefield',
    city: 'Bangalore', price: 12000, deposit: 24000, rating: 4.8, reviews: 213,
    availableBeds: 1, totalBeds: 20, gender: 'Both', category: 'coliving', food: true, wifi: true,
    parking: true, ac: true, gym: true, laundry: true, verified: true,
    distance: '3.4 km', type: 'Single',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    ],
    owner: 'Anita Sharma', ownerAvatar: 'AS',
    description: 'Premium single-room PG with all amenities. Perfect for professionals seeking privacy.',
    rules: ['No smoking', 'No pets', 'Guests allowed with prior notice'],
    amenities: ['WiFi', 'Food', 'AC', 'Gym', 'Parking', 'Laundry', 'CCTV', 'Attached Bathroom'],
  },
  {
    id: '5', name: 'Pearl Haven PG', location: 'BTM Layout, Bangalore', area: 'BTM Layout',
    city: 'Bangalore', price: 9200, deposit: 18400, rating: 4.6, reviews: 76,
    availableBeds: 5, totalBeds: 22, gender: 'Female', category: 'girls', food: true, wifi: true,
    parking: true, ac: false, gym: false, laundry: true, verified: true,
    distance: '1.7 km', type: 'Double Sharing',
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&q=80',
    ],
    owner: 'Kavya Rao', ownerAvatar: 'KR',
    description: 'A calm girls PG with warm interiors, secure access, home-style meals, and quick commute options.',
    rules: ['Ladies only', 'Visitor entry with approval', 'Quiet hours after 10 PM'],
    amenities: ['WiFi', 'Food', 'Parking', 'Laundry', 'CCTV', 'Power Backup'],
  },
  {
    id: '6', name: 'Metro House Co-Living', location: 'Marathahalli, Bangalore', area: 'Whitefield',
    city: 'Bangalore', price: 14500, deposit: 29000, rating: 4.9, reviews: 152,
    availableBeds: 3, totalBeds: 16, gender: 'Both', category: 'coliving', food: true, wifi: true,
    parking: true, ac: true, gym: true, laundry: true, verified: true,
    distance: '2.8 km', type: 'Single',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
      'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80',
    ],
    owner: 'Neha Iyer', ownerAvatar: 'NI',
    description: 'Design-led co-living with private rooms, shared lounges, high-speed WiFi, and a vibrant community.',
    rules: ['No smoking indoors', 'Pet friendly with approval', 'Guests allowed with registration'],
    amenities: ['WiFi', 'Food', 'AC', 'Gym', 'Parking', 'Laundry', 'Power Backup', 'Pet Friendly'],
  },
]

// ── Building images (reused across PGs) ──────────────────────────────────────
const BLDG_IMGS = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=70',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=70',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=70',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=70',
]

export const buildings = [
  // PG 1 – Sunrise PG
  { id: 'b1', pgId: '1', name: 'Block A', floors: 3, availableRooms: 4, availableBeds: 6, totalBeds: 12, image: BLDG_IMGS[0], status: 'active' },
  { id: 'b2', pgId: '1', name: 'Block B', floors: 2, availableRooms: 2, availableBeds: 3, totalBeds: 8,  image: BLDG_IMGS[1], status: 'active' },
  // PG 2 – Green Valley PG
  { id: 'b3', pgId: '2', name: 'Main Block', floors: 3, availableRooms: 3, availableBeds: 4, totalBeds: 12, image: BLDG_IMGS[2], status: 'active' },
  // PG 3 – Blue Ridge PG
  { id: 'b4', pgId: '3', name: 'Tower 1', floors: 4, availableRooms: 5, availableBeds: 9, totalBeds: 20, image: BLDG_IMGS[0], status: 'active' },
  { id: 'b5', pgId: '3', name: 'Tower 2', floors: 3, availableRooms: 3, availableBeds: 4, totalBeds: 12, image: BLDG_IMGS[3], status: 'active' },
  // PG 4 – Urban Nest PG
  { id: 'b6', pgId: '4', name: 'East Wing', floors: 2, availableRooms: 2, availableBeds: 2, totalBeds: 8,  image: BLDG_IMGS[1], status: 'active' },
  // PG 5 – Pearl Haven PG
  { id: 'b7', pgId: '5', name: 'Pearl Block', floors: 3, availableRooms: 4, availableBeds: 6, totalBeds: 14, image: BLDG_IMGS[2], status: 'active' },
  // PG 6 – Metro House Co-Living
  { id: 'b8', pgId: '6', name: 'Metro Block A', floors: 3, availableRooms: 3, availableBeds: 4, totalBeds: 10, image: BLDG_IMGS[0], status: 'active' },
  { id: 'b9', pgId: '6', name: 'Metro Block B', floors: 2, availableRooms: 2, availableBeds: 3, totalBeds: 8,  image: BLDG_IMGS[1], status: 'active' },
]

export const floors = [
  // b1 – Block A (PG 1)
  { id: 'f1', buildingId: 'b1', name: 'Ground Floor', rooms: 3, availableBeds: 3, totalBeds: 6 },
  { id: 'f2', buildingId: 'b1', name: '1st Floor',    rooms: 3, availableBeds: 2, totalBeds: 6 },
  { id: 'f3', buildingId: 'b1', name: '2nd Floor',    rooms: 3, availableBeds: 1, totalBeds: 6 },
  // b2 – Block B (PG 1)
  { id: 'f4', buildingId: 'b2', name: 'Ground Floor', rooms: 2, availableBeds: 2, totalBeds: 4 },
  { id: 'f5', buildingId: 'b2', name: '1st Floor',    rooms: 2, availableBeds: 1, totalBeds: 4 },
  // b3 – Main Block (PG 2)
  { id: 'f6', buildingId: 'b3', name: 'Ground Floor', rooms: 3, availableBeds: 2, totalBeds: 6 },
  { id: 'f7', buildingId: 'b3', name: '1st Floor',    rooms: 3, availableBeds: 1, totalBeds: 6 },
  { id: 'f8', buildingId: 'b3', name: '2nd Floor',    rooms: 2, availableBeds: 1, totalBeds: 4 },
  // b4 – Tower 1 (PG 3)
  { id: 'f9',  buildingId: 'b4', name: 'Ground Floor', rooms: 3, availableBeds: 3, totalBeds: 8 },
  { id: 'f10', buildingId: 'b4', name: '1st Floor',    rooms: 3, availableBeds: 3, totalBeds: 8 },
  { id: 'f11', buildingId: 'b4', name: '2nd Floor',    rooms: 2, availableBeds: 2, totalBeds: 6 },
  { id: 'f12', buildingId: 'b4', name: '3rd Floor',    rooms: 2, availableBeds: 1, totalBeds: 6 },
  // b5 – Tower 2 (PG 3)
  { id: 'f13', buildingId: 'b5', name: 'Ground Floor', rooms: 2, availableBeds: 2, totalBeds: 6 },
  { id: 'f14', buildingId: 'b5', name: '1st Floor',    rooms: 2, availableBeds: 1, totalBeds: 6 },
  { id: 'f15', buildingId: 'b5', name: '2nd Floor',    rooms: 2, availableBeds: 1, totalBeds: 6 },
  // b6 – East Wing (PG 4)
  { id: 'f16', buildingId: 'b6', name: 'Ground Floor', rooms: 2, availableBeds: 1, totalBeds: 4 },
  { id: 'f17', buildingId: 'b6', name: '1st Floor',    rooms: 2, availableBeds: 1, totalBeds: 4 },
  // b7 – Pearl Block (PG 5)
  { id: 'f18', buildingId: 'b7', name: 'Ground Floor', rooms: 3, availableBeds: 2, totalBeds: 6 },
  { id: 'f19', buildingId: 'b7', name: '1st Floor',    rooms: 3, availableBeds: 2, totalBeds: 6 },
  { id: 'f20', buildingId: 'b7', name: '2nd Floor',    rooms: 2, availableBeds: 2, totalBeds: 4 },
  // b8 – Metro Block A (PG 6)
  { id: 'f21', buildingId: 'b8', name: 'Ground Floor', rooms: 2, availableBeds: 2, totalBeds: 4 },
  { id: 'f22', buildingId: 'b8', name: '1st Floor',    rooms: 2, availableBeds: 1, totalBeds: 4 },
  { id: 'f23', buildingId: 'b8', name: '2nd Floor',    rooms: 2, availableBeds: 1, totalBeds: 4 },
  // b9 – Metro Block B (PG 6)
  { id: 'f24', buildingId: 'b9', name: 'Ground Floor', rooms: 2, availableBeds: 2, totalBeds: 4 },
  { id: 'f25', buildingId: 'b9', name: '1st Floor',    rooms: 2, availableBeds: 1, totalBeds: 4 },
]

export const rooms = [
  // f1 – Ground Floor, Block A, PG 1
  { id: 'r1', floorId: 'f1', name: 'Room 101', type: 'Triple', capacity: 3, rent: 8000, hasAC: false, hasBathroom: false, hasBalcony: true,  hasWifi: true },
  { id: 'r2', floorId: 'f1', name: 'Room 102', type: 'Double', capacity: 2, rent: 9500, hasAC: false, hasBathroom: true,  hasBalcony: false, hasWifi: true },
  { id: 'r3', floorId: 'f1', name: 'Room 103', type: 'Single', capacity: 1, rent: 13000, hasAC: true, hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  // f2 – 1st Floor, Block A, PG 1
  { id: 'r4', floorId: 'f2', name: 'Room 201', type: 'Triple', capacity: 3, rent: 8000, hasAC: false, hasBathroom: false, hasBalcony: false, hasWifi: true },
  { id: 'r5', floorId: 'f2', name: 'Room 202', type: 'Double', capacity: 2, rent: 9500, hasAC: true,  hasBathroom: true,  hasBalcony: false, hasWifi: true },
  { id: 'r6', floorId: 'f2', name: 'Room 203', type: 'Single', capacity: 1, rent: 13000, hasAC: true, hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  // f3 – 2nd Floor, Block A, PG 1
  { id: 'r7', floorId: 'f3', name: 'Room 301', type: 'Triple', capacity: 3, rent: 8000, hasAC: false, hasBathroom: false, hasBalcony: true,  hasWifi: true },
  { id: 'r8', floorId: 'f3', name: 'Room 302', type: 'Double', capacity: 2, rent: 9500, hasAC: false, hasBathroom: true,  hasBalcony: false, hasWifi: true },
  { id: 'r9', floorId: 'f3', name: 'Room 303', type: 'Quad',   capacity: 4, rent: 7000, hasAC: false, hasBathroom: false, hasBalcony: false, hasWifi: true },
  // f4 – Ground Floor, Block B, PG 1
  { id: 'r10', floorId: 'f4', name: 'Room 101', type: 'Double', capacity: 2, rent: 9000, hasAC: false, hasBathroom: false, hasBalcony: false, hasWifi: true },
  { id: 'r11', floorId: 'f4', name: 'Room 102', type: 'Triple', capacity: 3, rent: 7500, hasAC: false, hasBathroom: false, hasBalcony: true,  hasWifi: true },
  // f5 – 1st Floor, Block B, PG 1
  { id: 'r12', floorId: 'f5', name: 'Room 201', type: 'Single', capacity: 1, rent: 12000, hasAC: true,  hasBathroom: true, hasBalcony: true,  hasWifi: true },
  { id: 'r13', floorId: 'f5', name: 'Room 202', type: 'Double', capacity: 2, rent: 9000,  hasAC: false, hasBathroom: true, hasBalcony: false, hasWifi: true },
  // f6 – Ground Floor, Main Block, PG 2
  { id: 'r14', floorId: 'f6', name: 'Room 101', type: 'Double', capacity: 2, rent: 10000, hasAC: true,  hasBathroom: true,  hasBalcony: false, hasWifi: true },
  { id: 'r15', floorId: 'f6', name: 'Room 102', type: 'Triple', capacity: 3, rent: 8500,  hasAC: false, hasBathroom: false, hasBalcony: true,  hasWifi: true },
  { id: 'r16', floorId: 'f6', name: 'Room 103', type: 'Single', capacity: 1, rent: 14000, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  // f7 – 1st Floor, Main Block, PG 2
  { id: 'r17', floorId: 'f7', name: 'Room 201', type: 'Double', capacity: 2, rent: 10000, hasAC: true,  hasBathroom: true,  hasBalcony: false, hasWifi: true },
  { id: 'r18', floorId: 'f7', name: 'Room 202', type: 'Triple', capacity: 3, rent: 8500,  hasAC: false, hasBathroom: false, hasBalcony: false, hasWifi: true },
  { id: 'r19', floorId: 'f7', name: 'Room 203', type: 'Single', capacity: 1, rent: 14000, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  // f8 – 2nd Floor, Main Block, PG 2
  { id: 'r20', floorId: 'f8', name: 'Room 301', type: 'Double', capacity: 2, rent: 10000, hasAC: true,  hasBathroom: true,  hasBalcony: false, hasWifi: true },
  { id: 'r21', floorId: 'f8', name: 'Room 302', type: 'Single', capacity: 1, rent: 14000, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  // f9 – Ground Floor, Tower 1, PG 3
  { id: 'r22', floorId: 'f9',  name: 'Room 101', type: 'Triple', capacity: 3, rent: 7500, hasAC: false, hasBathroom: false, hasBalcony: false, hasWifi: true },
  { id: 'r23', floorId: 'f9',  name: 'Room 102', type: 'Quad',   capacity: 4, rent: 6500, hasAC: false, hasBathroom: false, hasBalcony: false, hasWifi: true },
  { id: 'r24', floorId: 'f9',  name: 'Room 103', type: 'Double', capacity: 2, rent: 9000, hasAC: false, hasBathroom: true,  hasBalcony: false, hasWifi: true },
  // f10 – 1st Floor, Tower 1, PG 3
  { id: 'r25', floorId: 'f10', name: 'Room 201', type: 'Triple', capacity: 3, rent: 7500, hasAC: false, hasBathroom: false, hasBalcony: true,  hasWifi: true },
  { id: 'r26', floorId: 'f10', name: 'Room 202', type: 'Single', capacity: 1, rent: 11000, hasAC: true, hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  { id: 'r27', floorId: 'f10', name: 'Room 203', type: 'Double', capacity: 2, rent: 9000, hasAC: true,  hasBathroom: true,  hasBalcony: false, hasWifi: true },
  // f16 – Ground Floor, East Wing, PG 4
  { id: 'r28', floorId: 'f16', name: 'Room 101', type: 'Single', capacity: 1, rent: 12000, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  { id: 'r29', floorId: 'f16', name: 'Room 102', type: 'Double', capacity: 2, rent: 11000, hasAC: true,  hasBathroom: true,  hasBalcony: false, hasWifi: true },
  // f17 – 1st Floor, East Wing, PG 4
  { id: 'r30', floorId: 'f17', name: 'Room 201', type: 'Single', capacity: 1, rent: 12000, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  { id: 'r31', floorId: 'f17', name: 'Room 202', type: 'Double', capacity: 2, rent: 11000, hasAC: true,  hasBathroom: false, hasBalcony: false, hasWifi: true },
  // f18 – Ground Floor, Pearl Block, PG 5
  { id: 'r32', floorId: 'f18', name: 'Room 101', type: 'Double', capacity: 2, rent: 9200,  hasAC: false, hasBathroom: true,  hasBalcony: false, hasWifi: true },
  { id: 'r33', floorId: 'f18', name: 'Room 102', type: 'Triple', capacity: 3, rent: 8000,  hasAC: false, hasBathroom: false, hasBalcony: true,  hasWifi: true },
  { id: 'r34', floorId: 'f18', name: 'Room 103', type: 'Single', capacity: 1, rent: 13500, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  // f19 – 1st Floor, Pearl Block, PG 5
  { id: 'r35', floorId: 'f19', name: 'Room 201', type: 'Double', capacity: 2, rent: 9200,  hasAC: false, hasBathroom: true,  hasBalcony: false, hasWifi: true },
  { id: 'r36', floorId: 'f19', name: 'Room 202', type: 'Triple', capacity: 3, rent: 8000,  hasAC: false, hasBathroom: false, hasBalcony: false, hasWifi: true },
  { id: 'r37', floorId: 'f19', name: 'Room 203', type: 'Single', capacity: 1, rent: 13500, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  // f21 – Ground Floor, Metro Block A, PG 6
  { id: 'r38', floorId: 'f21', name: 'Room 101', type: 'Single', capacity: 1, rent: 14500, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  { id: 'r39', floorId: 'f21', name: 'Room 102', type: 'Double', capacity: 2, rent: 13000, hasAC: true,  hasBathroom: true,  hasBalcony: false, hasWifi: true },
  // f22 – 1st Floor, Metro Block A, PG 6
  { id: 'r40', floorId: 'f22', name: 'Room 201', type: 'Single', capacity: 1, rent: 14500, hasAC: true,  hasBathroom: true,  hasBalcony: true,  hasWifi: true },
  { id: 'r41', floorId: 'f22', name: 'Room 202', type: 'Double', capacity: 2, rent: 13000, hasAC: true,  hasBathroom: false, hasBalcony: false, hasWifi: true },
]

export const beds = [
  // r1 – Room 101 (Triple, f1)
  { id: 'bed1',  roomId: 'r1',  label: 'A1', status: 'available',   price: 8000 },
  { id: 'bed2',  roomId: 'r1',  label: 'A2', status: 'occupied',    price: 8000 },
  { id: 'bed3',  roomId: 'r1',  label: 'A3', status: 'available',   price: 8000 },
  // r2 – Room 102 (Double, f1)
  { id: 'bed4',  roomId: 'r2',  label: 'A1', status: 'occupied',    price: 9500 },
  { id: 'bed5',  roomId: 'r2',  label: 'A2', status: 'available',   price: 9500 },
  // r3 – Room 103 (Single, f1)
  { id: 'bed6',  roomId: 'r3',  label: 'A1', status: 'available',   price: 13000 },
  // r4 – Room 201 (Triple, f2)
  { id: 'bed7',  roomId: 'r4',  label: 'A1', status: 'occupied',    price: 8000 },
  { id: 'bed8',  roomId: 'r4',  label: 'A2', status: 'maintenance', price: 8000 },
  { id: 'bed9',  roomId: 'r4',  label: 'A3', status: 'available',   price: 8000 },
  // r5 – Room 202 (Double, f2)
  { id: 'bed10', roomId: 'r5',  label: 'A1', status: 'available',   price: 9500 },
  { id: 'bed11', roomId: 'r5',  label: 'A2', status: 'reserved',    price: 9500 },
  // r6 – Room 203 (Single, f2)
  { id: 'bed12', roomId: 'r6',  label: 'A1', status: 'occupied',    price: 13000 },
  // r7 – Room 301 (Triple, f3)
  { id: 'bed13', roomId: 'r7',  label: 'A1', status: 'available',   price: 8000 },
  { id: 'bed14', roomId: 'r7',  label: 'A2', status: 'available',   price: 8000 },
  { id: 'bed15', roomId: 'r7',  label: 'A3', status: 'occupied',    price: 8000 },
  // r8 – Room 302 (Double, f3)
  { id: 'bed16', roomId: 'r8',  label: 'A1', status: 'reserved',    price: 9500 },
  { id: 'bed17', roomId: 'r8',  label: 'A2', status: 'available',   price: 9500 },
  // r9 – Room 303 (Quad, f3)
  { id: 'bed18', roomId: 'r9',  label: 'A1', status: 'occupied',    price: 7000 },
  { id: 'bed19', roomId: 'r9',  label: 'A2', status: 'occupied',    price: 7000 },
  { id: 'bed20', roomId: 'r9',  label: 'B1', status: 'available',   price: 7000 },
  { id: 'bed21', roomId: 'r9',  label: 'B2', status: 'available',   price: 7000 },
  // r10 – Block B Ground, Room 101 (Double)
  { id: 'bed22', roomId: 'r10', label: 'A1', status: 'available',   price: 9000 },
  { id: 'bed23', roomId: 'r10', label: 'A2', status: 'occupied',    price: 9000 },
  // r11 – Block B Ground, Room 102 (Triple)
  { id: 'bed24', roomId: 'r11', label: 'A1', status: 'available',   price: 7500 },
  { id: 'bed25', roomId: 'r11', label: 'A2', status: 'reserved',    price: 7500 },
  { id: 'bed26', roomId: 'r11', label: 'A3', status: 'occupied',    price: 7500 },
  // r12 – Block B 1st Floor, Room 201 (Single)
  { id: 'bed27', roomId: 'r12', label: 'A1', status: 'occupied',    price: 12000 },
  // r13 – Block B 1st Floor, Room 202 (Double)
  { id: 'bed28', roomId: 'r13', label: 'A1', status: 'available',   price: 9000 },
  { id: 'bed29', roomId: 'r13', label: 'A2', status: 'available',   price: 9000 },
  // r14 – PG 2, Room 101 (Double)
  { id: 'bed30', roomId: 'r14', label: 'A1', status: 'available',   price: 10000 },
  { id: 'bed31', roomId: 'r14', label: 'A2', status: 'occupied',    price: 10000 },
  // r15 – PG 2, Room 102 (Triple)
  { id: 'bed32', roomId: 'r15', label: 'A1', status: 'occupied',    price: 8500 },
  { id: 'bed33', roomId: 'r15', label: 'A2', status: 'available',   price: 8500 },
  { id: 'bed34', roomId: 'r15', label: 'A3', status: 'reserved',    price: 8500 },
  // r16 – PG 2, Room 103 (Single)
  { id: 'bed35', roomId: 'r16', label: 'A1', status: 'available',   price: 14000 },
  // r17 – PG 2, 1F Room 201 (Double)
  { id: 'bed36', roomId: 'r17', label: 'A1', status: 'occupied',    price: 10000 },
  { id: 'bed37', roomId: 'r17', label: 'A2', status: 'occupied',    price: 10000 },
  // r18 – PG 2, 1F Room 202 (Triple)
  { id: 'bed38', roomId: 'r18', label: 'A1', status: 'available',   price: 8500 },
  { id: 'bed39', roomId: 'r18', label: 'A2', status: 'occupied',    price: 8500 },
  { id: 'bed40', roomId: 'r18', label: 'A3', status: 'available',   price: 8500 },
  // r19 – PG 2, 1F Room 203 (Single)
  { id: 'bed41', roomId: 'r19', label: 'A1', status: 'available',   price: 14000 },
  // r22 – PG 3 Tower1 GF Room 101 (Triple)
  { id: 'bed42', roomId: 'r22', label: 'A1', status: 'available',   price: 7500 },
  { id: 'bed43', roomId: 'r22', label: 'A2', status: 'occupied',    price: 7500 },
  { id: 'bed44', roomId: 'r22', label: 'A3', status: 'available',   price: 7500 },
  // r23 – PG 3 Tower1 GF Room 102 (Quad)
  { id: 'bed45', roomId: 'r23', label: 'A1', status: 'occupied',    price: 6500 },
  { id: 'bed46', roomId: 'r23', label: 'A2', status: 'available',   price: 6500 },
  { id: 'bed47', roomId: 'r23', label: 'B1', status: 'available',   price: 6500 },
  { id: 'bed48', roomId: 'r23', label: 'B2', status: 'reserved',    price: 6500 },
  // r24 – PG 3 Tower1 GF Room 103 (Double)
  { id: 'bed49', roomId: 'r24', label: 'A1', status: 'available',   price: 9000 },
  { id: 'bed50', roomId: 'r24', label: 'A2', status: 'occupied',    price: 9000 },
  // r25 – PG 3 Tower1 1F Room 201 (Triple)
  { id: 'bed51', roomId: 'r25', label: 'A1', status: 'available',   price: 7500 },
  { id: 'bed52', roomId: 'r25', label: 'A2', status: 'available',   price: 7500 },
  { id: 'bed53', roomId: 'r25', label: 'A3', status: 'occupied',    price: 7500 },
  // r28 – PG 4 GF Room 101 (Single)
  { id: 'bed54', roomId: 'r28', label: 'A1', status: 'available',   price: 12000 },
  // r29 – PG 4 GF Room 102 (Double)
  { id: 'bed55', roomId: 'r29', label: 'A1', status: 'occupied',    price: 11000 },
  { id: 'bed56', roomId: 'r29', label: 'A2', status: 'available',   price: 11000 },
  // r30 – PG 4 1F Room 201 (Single)
  { id: 'bed57', roomId: 'r30', label: 'A1', status: 'reserved',    price: 12000 },
  // r31 – PG 4 1F Room 202 (Double)
  { id: 'bed58', roomId: 'r31', label: 'A1', status: 'available',   price: 11000 },
  { id: 'bed59', roomId: 'r31', label: 'A2', status: 'occupied',    price: 11000 },
  // r32 – PG 5 GF Room 101 (Double)
  { id: 'bed60', roomId: 'r32', label: 'A1', status: 'available',   price: 9200 },
  { id: 'bed61', roomId: 'r32', label: 'A2', status: 'occupied',    price: 9200 },
  // r33 – PG 5 GF Room 102 (Triple)
  { id: 'bed62', roomId: 'r33', label: 'A1', status: 'available',   price: 8000 },
  { id: 'bed63', roomId: 'r33', label: 'A2', status: 'occupied',    price: 8000 },
  { id: 'bed64', roomId: 'r33', label: 'A3', status: 'available',   price: 8000 },
  // r34 – PG 5 GF Room 103 (Single)
  { id: 'bed65', roomId: 'r34', label: 'A1', status: 'available',   price: 13500 },
  // r35 – PG 5 1F Room 201 (Double)
  { id: 'bed66', roomId: 'r35', label: 'A1', status: 'reserved',    price: 9200 },
  { id: 'bed67', roomId: 'r35', label: 'A2', status: 'available',   price: 9200 },
  // r38 – PG 6 Block A GF Room 101 (Single)
  { id: 'bed68', roomId: 'r38', label: 'A1', status: 'available',   price: 14500 },
  // r39 – PG 6 Block A GF Room 102 (Double)
  { id: 'bed69', roomId: 'r39', label: 'A1', status: 'occupied',    price: 13000 },
  { id: 'bed70', roomId: 'r39', label: 'A2', status: 'available',   price: 13000 },
  // r40 – PG 6 Block A 1F Room 201 (Single)
  { id: 'bed71', roomId: 'r40', label: 'A1', status: 'available',   price: 14500 },
  // r41 – PG 6 Block A 1F Room 202 (Double)
  { id: 'bed72', roomId: 'r41', label: 'A1', status: 'available',   price: 13000 },
  { id: 'bed73', roomId: 'r41', label: 'A2', status: 'reserved',    price: 13000 },
]

export const bookings = [
  { id: 'BK001', pg: 'Sunrise PG', room: 'Room 101', bed: 'Bed A', date: '2024-01-15', moveIn: '2024-02-01', amount: 8000, deposit: 16000, status: 'active', receipt: true, category: 'boys' },
  { id: 'BK002', pg: 'Green Valley PG', room: 'Room 202', bed: 'Bed B', date: '2023-09-10', moveIn: '2023-10-01', amount: 10000, deposit: 20000, status: 'completed', receipt: true, category: 'girls' },
  { id: 'BK003', pg: 'Blue Ridge PG', room: 'Room 301', bed: 'Bed A', date: '2024-05-20', moveIn: '2024-06-01', amount: 7500, deposit: 15000, status: 'pending', receipt: false, category: 'boys' },
]

export const wishlist = [
  pgListings[1], pgListings[3], pgListings[4],
]

export const notifications = [
  { id: '1', type: 'booking', title: 'Booking Confirmed!', message: 'Your booking at Sunrise PG, Room 101 has been confirmed by the owner.', time: '2 hours ago', read: false, date: 'Today' },
  { id: '2', type: 'payment', title: 'Rent Due Reminder', message: 'Your rent of ₹8,000 for June is due on June 1st. Please make payment.', time: '5 hours ago', read: false, date: 'Today' },
  { id: '3', type: 'pg', title: 'PG Update', message: 'Sunrise PG has added a new gym facility. Check it out!', time: '1 day ago', read: true, date: 'Yesterday' },
  { id: '4', type: 'offer', title: 'Special Offer!', message: 'Get ₹1,000 cashback on your next booking. Offer valid till June 30.', time: '2 days ago', read: true, date: 'This Week' },
  { id: '5', type: 'booking', title: 'Check-out Reminder', message: 'Your lease at Green Valley PG ends in 15 days. Renew or plan your move.', time: '3 days ago', read: true, date: 'This Week' },
]

export const reviews = [
  { id: '1', pg: 'Green Valley PG', rating: 5, comment: 'Excellent PG! Very clean, great food, and the owner is very responsive. Highly recommend for working professionals.', date: '2023-12-15', helpful: 12, status: 'published' },
  { id: '2', pg: 'Sunrise PG', rating: 4, comment: 'Good facilities, WiFi is fast, and location is convenient. Food could be better but overall a solid choice.', date: '2024-03-20', helpful: 8, status: 'published' },
]

export const pendingReviews = [
  { id: '3', pg: 'Blue Ridge PG', bookingId: 'BK003', moveOut: '2024-05-31' },
]

export const documents = [
  { id: '1', type: 'Aadhaar Card', status: 'uploaded', uploadDate: '2024-01-10', verified: true },
  { id: '2', type: 'PAN Card', status: 'uploaded', uploadDate: '2024-01-10', verified: false },
  { id: '3', type: 'College ID', status: 'pending', uploadDate: null, verified: false },
  { id: '4', type: 'Passport', status: 'pending', uploadDate: null, verified: false },
  { id: '5', type: 'Employee ID', status: 'rejected', uploadDate: '2024-01-12', verified: false },
  { id: '6', type: 'Driving License', status: 'pending', uploadDate: null, verified: false },
]
