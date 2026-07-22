CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES users(id),
  title      text,
  message    text,
  read       boolean DEFAULT false,
  type       text,  -- 'booking', 'payment', 'system', 'reminder'
  created_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY "admin_all_notifications" ON notifications
  FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- User: view and update only their own notifications
CREATE POLICY "user_own_notifications" ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_update_notifications" ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());
