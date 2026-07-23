-- =============================================
-- Enable Row Level Security on all tables
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Helper function: get current user's role
-- =============================================

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- =============================================
-- USERS table
-- =============================================

-- Admin: full access
CREATE POLICY "admin_all_users" ON users
  FOR ALL
  USING (get_my_role() = 'admin');

-- Users: can read and update their own row
CREATE POLICY "self_read_users" ON users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "self_update_users" ON users
  FOR UPDATE
  USING (id = auth.uid());

-- =============================================
-- OWNERS table
-- =============================================

-- Admin: full access
CREATE POLICY "admin_all_owners" ON owners
  FOR ALL
  USING (get_my_role() = 'admin');

-- Owner: can read and update only their own row
CREATE POLICY "owner_read_self" ON owners
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "owner_update_self" ON owners
  FOR UPDATE
  USING (user_id = auth.uid());

-- =============================================
-- CUSTOMERS table
-- =============================================

-- Admin: full access
CREATE POLICY "admin_all_customers" ON customers
  FOR ALL
  USING (get_my_role() = 'admin');

-- Customer: can read and update only their own row
CREATE POLICY "customer_read_self" ON customers
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "customer_update_self" ON customers
  FOR UPDATE
  USING (user_id = auth.uid());

-- =============================================
-- PG_PROPERTIES table
-- =============================================

-- Admin: full access
CREATE POLICY "admin_all_pg_properties" ON pg_properties
  FOR ALL
  USING (get_my_role() = 'admin');

-- Owner: can INSERT, UPDATE, DELETE only their own PGs
CREATE POLICY "owner_insert_pg" ON pg_properties
  FOR INSERT
  WITH CHECK (
    owner_id = (SELECT id FROM owners WHERE user_id = auth.uid())
  );

CREATE POLICY "owner_update_pg" ON pg_properties
  FOR UPDATE
  USING (
    owner_id = (SELECT id FROM owners WHERE user_id = auth.uid())
  );

CREATE POLICY "owner_delete_pg" ON pg_properties
  FOR DELETE
  USING (
    owner_id = (SELECT id FROM owners WHERE user_id = auth.uid())
  );

-- Customer + Owner: can only SELECT approved PGs
CREATE POLICY "public_view_approved_pg" ON pg_properties
  FOR SELECT
  USING (status = 'approved');

-- =============================================
-- ROOMS table
-- =============================================

-- Admin: full access
CREATE POLICY "admin_all_rooms" ON rooms
  FOR ALL
  USING (get_my_role() = 'admin');

-- Owner: manage rooms belonging to their PGs
CREATE POLICY "owner_manage_rooms" ON rooms
  FOR ALL
  USING (
    pg_id IN (
      SELECT id FROM pg_properties
      WHERE owner_id = (SELECT id FROM owners WHERE user_id = auth.uid())
    )
  );

-- Customer: view rooms of approved PGs only
CREATE POLICY "customer_view_rooms" ON rooms
  FOR SELECT
  USING (
    pg_id IN (SELECT id FROM pg_properties WHERE status = 'approved')
  );

-- =============================================
-- BOOKINGS table
-- =============================================

-- Admin: full access
CREATE POLICY "admin_all_bookings" ON bookings
  FOR ALL
  USING (get_my_role() = 'admin');

-- Owner: view bookings for their PGs
CREATE POLICY "owner_view_bookings" ON bookings
  FOR SELECT
  USING (
    pg_id IN (
      SELECT id FROM pg_properties
      WHERE owner_id = (SELECT id FROM owners WHERE user_id = auth.uid())
    )
  );

-- Owner: update booking status (confirm/reject)
CREATE POLICY "owner_update_bookings" ON bookings
  FOR UPDATE
  USING (
    pg_id IN (
      SELECT id FROM pg_properties
      WHERE owner_id = (SELECT id FROM owners WHERE user_id = auth.uid())
    )
  );

-- Customer: view and insert their own bookings
CREATE POLICY "customer_own_bookings" ON bookings
  FOR SELECT
  USING (
    customer_id = (SELECT id FROM customers WHERE user_id = auth.uid())
  );

CREATE POLICY "customer_insert_booking" ON bookings
  FOR INSERT
  WITH CHECK (
    customer_id = (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- =============================================
-- PAYMENTS table
-- =============================================

-- Admin: full access
CREATE POLICY "admin_all_payments" ON payments
  FOR ALL
  USING (get_my_role() = 'admin');

-- Owner: view payments for their bookings
CREATE POLICY "owner_view_payments" ON payments
  FOR SELECT
  USING (
    booking_id IN (
      SELECT b.id FROM bookings b
      JOIN pg_properties p ON b.pg_id = p.id
      JOIN owners o ON p.owner_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

-- Customer: view their own payments
CREATE POLICY "customer_view_payments" ON payments
  FOR SELECT
  USING (
    booking_id IN (
      SELECT b.id FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- =============================================
-- REVIEWS table
-- =============================================

-- Admin: full access
CREATE POLICY "admin_all_reviews" ON reviews
  FOR ALL
  USING (get_my_role() = 'admin');

-- Everyone: view reviews on approved PGs
CREATE POLICY "public_view_reviews" ON reviews
  FOR SELECT
  USING (
    pg_id IN (SELECT id FROM pg_properties WHERE status = 'approved')
  );

-- Customer: insert their own reviews
CREATE POLICY "customer_insert_review" ON reviews
  FOR INSERT
  WITH CHECK (
    customer_id = (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Customer: update/delete their own reviews
CREATE POLICY "customer_manage_review" ON reviews
  FOR ALL
  USING (
    customer_id = (SELECT id FROM customers WHERE user_id = auth.uid())
  );
