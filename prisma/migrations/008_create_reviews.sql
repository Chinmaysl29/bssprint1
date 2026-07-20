CREATE TABLE reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  pg_id       uuid REFERENCES pg_properties(id),
  rating      int CHECK (rating >= 1 AND rating <= 5),
  comment     text
);
