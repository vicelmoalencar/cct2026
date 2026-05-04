-- ============================================================
-- Migration completa: todos os campos novos da tabela lessons
-- Rode este SQL direto no banco novocct
-- ============================================================

-- Campos de conteúdo extra da aula
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS support_text TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS transcript TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Campos de aluguel
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rentable BOOLEAN DEFAULT FALSE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rental_credits INTEGER DEFAULT 0;

-- Tabela de aluguéis de aulas
CREATE TABLE IF NOT EXISTS lesson_rentals (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  lesson_id INTEGER NOT NULL,
  credits_paid INTEGER NOT NULL,
  rented_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE(user_email, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_rentals_email ON lesson_rentals(user_email);
CREATE INDEX IF NOT EXISTS idx_lesson_rentals_lesson ON lesson_rentals(lesson_id);

-- Verificar resultado
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'lessons'
  AND column_name IN ('support_text', 'transcript', 'attachments', 'rentable', 'rental_credits')
ORDER BY column_name;
