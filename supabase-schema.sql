-- ============================================
-- SCHEMA COMPLETO PARA SUPABASE
-- CCT - Clube do Cálculo Trabalhista
-- ============================================

-- Habilitar RLS (Row Level Security) será configurado depois
-- Por enquanto, vamos criar as tabelas

-- ============================================
-- Tabela de Administradores
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir administradores
INSERT INTO admins (email, name) VALUES 
  ('antoniovicelmo.alencar@gmail.com', 'ANTONIO VICELMO'),
  ('vicelmo@trt21.jus.br', 'VICELMO ALENCAR')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Tabela de Cursos
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  instructor TEXT DEFAULT 'Vicelmo',
  duration_hours INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Tabela de Módulos
-- ============================================
CREATE TABLE IF NOT EXISTS modules (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Tabela de Aulas
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id BIGSERIAL PRIMARY KEY,
  module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_provider TEXT CHECK(video_provider IN ('youtube', 'vimeo', 'url')),
  video_id TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Tabela de Comentários
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Tabela de Progresso do Usuário
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_email, lesson_id)
);

-- ============================================
-- Índices para Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_video ON lessons(video_provider, video_id);
CREATE INDEX IF NOT EXISTS idx_comments_lesson_id ON comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_email ON user_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON user_progress(user_id, lesson_id);

-- ============================================
-- Função para atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para courses
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) - Configuração Básica
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Políticas para COURSES (todos podem ler, apenas admins podem modificar)
CREATE POLICY "Todos podem ler cursos" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir cursos" ON courses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins podem atualizar cursos" ON courses
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins podem deletar cursos" ON courses
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

-- Políticas para MODULES (todos podem ler, apenas admins podem modificar)
CREATE POLICY "Todos podem ler módulos" ON modules
  FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir módulos" ON modules
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins podem atualizar módulos" ON modules
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins podem deletar módulos" ON modules
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

-- Políticas para LESSONS (todos podem ler, apenas admins podem modificar)
CREATE POLICY "Todos podem ler aulas" ON lessons
  FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir aulas" ON lessons
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins podem atualizar aulas" ON lessons
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins podem deletar aulas" ON lessons
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
  );

-- Políticas para COMMENTS (todos podem ler, usuários autenticados podem inserir, donos podem deletar)
CREATE POLICY "Todos podem ler comentários" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem inserir comentários" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem deletar seus próprios comentários" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para USER_PROGRESS (usuários podem ver e modificar apenas seu próprio progresso)
CREATE POLICY "Usuários podem ver seu próprio progresso" ON user_progress
  FOR SELECT USING (auth.uid() = user_id OR user_email = auth.jwt()->>'email');

CREATE POLICY "Usuários podem inserir seu próprio progresso" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_email = auth.jwt()->>'email');

CREATE POLICY "Usuários podem atualizar seu próprio progresso" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id OR user_email = auth.jwt()->>'email');

CREATE POLICY "Usuários podem deletar seu próprio progresso" ON user_progress
  FOR DELETE USING (auth.uid() = user_id OR user_email = auth.jwt()->>'email');

-- Políticas para ADMINS (apenas admins podem ver/modificar)
CREATE POLICY "Admins podem ler admins" ON admins
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins a WHERE a.email = auth.jwt()->>'email')
  );

-- ============================================
-- Dados de Exemplo
-- ============================================

-- Inserir cursos de exemplo
INSERT INTO courses (title, description, duration_hours, instructor) VALUES 
  ('Cálculos Trabalhistas Fundamentais', 'Aprenda os fundamentos essenciais dos cálculos trabalhistas na Justiça do Trabalho', 20, 'Vicelmo'),
  ('Cálculos de Rescisão', 'Domine todos os tipos de cálculo de rescisão contratual', 15, 'Vicelmo'),
  ('Perícias e Cálculos Complexos', 'Cálculos avançados para perícias trabalhistas', 25, 'Vicelmo')
ON CONFLICT DO NOTHING;

-- Inserir módulos (assumindo IDs dos cursos)
INSERT INTO modules (course_id, title, description, order_index) VALUES 
  (1, 'Introdução aos Cálculos Trabalhistas', 'Conceitos básicos e legislação', 1),
  (1, 'Salários e Remunerações', 'Cálculo de salários, adicionais e gratificações', 2),
  (1, 'Férias e 13º Salário', 'Como calcular férias e décimo terceiro', 3),
  (2, 'Tipos de Rescisão', 'Entendendo cada tipo de desligamento', 1),
  (2, 'Verbas Rescisórias', 'Cálculo de todas as verbas rescisórias', 2),
  (3, 'Perícia Trabalhista', 'Introdução à perícia trabalhista', 1),
  (3, 'Cálculos de Diferenças Salariais', 'Cálculos complexos de diferenças', 2)
ON CONFLICT DO NOTHING;

-- Inserir aulas (assumindo IDs dos módulos)
INSERT INTO lessons (module_id, title, description, duration_minutes, order_index) VALUES 
  (1, 'Bem-vindo ao CCT', 'Apresentação do curso e metodologia', 10, 1),
  (1, 'CLT e Legislação Trabalhista', 'Fundamentos da Consolidação das Leis do Trabalho', 25, 2),
  (1, 'Calculadora e Ferramentas', 'Como usar as ferramentas de cálculo', 15, 3),
  (2, 'Composição do Salário', 'O que compõe o salário do trabalhador', 20, 1),
  (2, 'Adicionais: Noturno, Insalubridade e Periculosidade', 'Cálculo dos principais adicionais', 30, 2),
  (2, 'Horas Extras', 'Como calcular horas extras corretamente', 35, 3),
  (3, 'Direito a Férias', 'Período aquisitivo e concessivo', 20, 1),
  (3, 'Cálculo de Férias Integrais', 'Passo a passo do cálculo de férias', 25, 2),
  (3, 'Cálculo do 13º Salário', 'Como calcular o décimo terceiro', 20, 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- CONCLUÍDO!
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin/sql/new
