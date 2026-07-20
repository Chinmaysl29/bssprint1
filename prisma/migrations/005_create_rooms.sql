CREATE TABLE rooms (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pg_id     uuid REFERENCES pg_properties(id),
  room_no   text,
  capacity  int,
  available boolean DEFAULT true
);
