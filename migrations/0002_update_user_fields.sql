-- Esta migration atualiza os campos de usuário para garantir consistência
-- Não é necessário alterar a estrutura, apenas garantir que os índices estão corretos

-- Adicionar índice para melhorar performance de consultas por email
CREATE INDEX IF NOT EXISTS idx_comments_user_email ON comments(user_email);
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON user_progress(user_email, lesson_id);
