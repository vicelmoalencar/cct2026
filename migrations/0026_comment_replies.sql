-- Respostas administrativas para comentários de aulas
ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_replied_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_replied_by TEXT;

CREATE INDEX IF NOT EXISTS idx_comments_admin_replied_at ON comments(admin_replied_at);

DROP POLICY IF EXISTS "Admins podem responder comentários" ON comments;
CREATE POLICY "Admins podem responder comentários" ON comments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );
