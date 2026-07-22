CREATE TABLE users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text,
  email      text UNIQUE,
  phone      text,
  role       text CHECK (role IN ('admin', 'owner', 'customer')),
  status     text DEFAULT 'pending',
  created_at timestamp DEFAULT now()
);
