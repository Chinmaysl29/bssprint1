CREATE TABLE owners (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES users(id),
  business_name text,
  address       text,
  document_url  text,
  verified      boolean DEFAULT false
);
