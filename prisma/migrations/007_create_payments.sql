CREATE TABLE payments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id       uuid REFERENCES bookings(id),
  amount           int,
  commission       int,   -- 2% of amount, goes to admin
  owner_amount     int,   -- 98% of amount, goes to owner
  payment_status   text,  -- 'pending', 'completed', 'failed', 'refunded'
  date             timestamp DEFAULT now()
);
