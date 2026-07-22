# HomiePG — System Overview

## Data Flow

### Customer Flow
```
Register (name, email, phone, role='customer')
  → users table (status='pending')
  → Admin approves (status='approved')
  → Customer profile created in customers table
  → Access to /customer/dashboard
  → Search approved PGs (/customer/search)
  → Book a PG → bookings table (status='pending')
  → Owner confirms → status='confirmed'
  → Payment recorded in payments table
  → Leave a review in reviews table
```

### Owner Flow
```
Register (name, email, phone, role='owner')
  → users table (status='pending')
  → Upload documents → owners table (verified=false)
  → Admin verifies → verified=true
  → Access to /owner/dashboard
  → Add PG → pg_properties table (status='pending')
  → Admin approves PG → status='approved'
  → Customers can now see & book the PG
  → Owner confirms/rejects bookings
  → Receives 98% of payment (2% commission to admin)
```

### Admin Flow
```
Access to /admin/dashboard
  → View all pending users → approve/reject
  → View all owners → verify documents
  → View all PG listings → approve/reject
  → Monitor all bookings (read-only)
  → Monitor all payments + commission tracking
```

---

## Database Tables

| Table           | Purpose                                 |
|-----------------|-----------------------------------------|
| users           | All users (admin, owner, customer)      |
| owners          | Owner profile + document verification  |
| customers       | Customer profile                        |
| pg_properties   | PG listings added by owners             |
| rooms           | Rooms inside each PG                    |
| bookings        | Customer ↔ Owner booking interactions  |
| payments        | Payment records with 2% admin commission|
| reviews         | Customer reviews on approved PGs        |
| notifications   | Per-user notifications                  |

---

## Payment Split

Every payment: amount = owner_amount (98%) + commission (2% → admin)

---

## Security (RLS)

- Admin     → SELECT, UPDATE, DELETE on all tables
- Owner     → manage only their own PGs and bookings
- Customer  → view approved PGs only, manage own bookings
```
