CREATE TABLE customers (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  uuid REFERENCES users(id),
  age      int,
  gender   text,
  address  text,
  verified boolean DEFAULT false
);
