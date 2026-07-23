CREATE TABLE bookings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  pg_id       uuid REFERENCES pg_properties(id),
  status      text DEFAULT 'pending',
  created_at  timestamp DEFAULT now()
);
