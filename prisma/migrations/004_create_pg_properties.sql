CREATE TABLE pg_properties (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid REFERENCES owners(id),
  name        text,
  location    text,
  description text,
  price       int,
  status      text DEFAULT 'pending'
);
