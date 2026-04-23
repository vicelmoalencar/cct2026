-- ============================================================================
-- Migration 0023: Tabela de aulas favoritas
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_favorites (
  id         SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  lesson_id  INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_email, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_email ON user_favorites(user_email);
CREATE INDEX IF NOT EXISTS idx_favorites_lesson_id  ON user_favorites(lesson_id);
