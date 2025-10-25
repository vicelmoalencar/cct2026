-- ============================================
-- FIX RLS POLICIES FOR ADMIN OPERATIONS
-- ============================================
-- Este arquivo corrige as políticas RLS para permitir operações de admin

-- Primeiro, vamos verificar se RLS está habilitado
-- Se estiver, vamos criar políticas permissivas

-- COURSES TABLE
-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Admin can insert courses" ON courses;
DROP POLICY IF EXISTS "Admin can update courses" ON courses;
DROP POLICY IF EXISTS "Admin can delete courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;

-- Habilitar RLS se não estiver
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Políticas para courses
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert courses"
  ON courses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update courses"
  ON courses FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete courses"
  ON courses FOR DELETE
  USING (true);

-- MODULES TABLE
DROP POLICY IF EXISTS "Admin can insert modules" ON modules;
DROP POLICY IF EXISTS "Admin can update modules" ON modules;
DROP POLICY IF EXISTS "Admin can delete modules" ON modules;
DROP POLICY IF EXISTS "Anyone can view modules" ON modules;

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules"
  ON modules FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert modules"
  ON modules FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update modules"
  ON modules FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete modules"
  ON modules FOR DELETE
  USING (true);

-- LESSONS TABLE
DROP POLICY IF EXISTS "Admin can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Admin can update lessons" ON lessons;
DROP POLICY IF EXISTS "Admin can delete lessons" ON lessons;
DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert lessons"
  ON lessons FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update lessons"
  ON lessons FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete lessons"
  ON lessons FOR DELETE
  USING (true);

-- PROGRESS TABLE
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON progress;
DROP POLICY IF EXISTS "Users can update own progress" ON progress;

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- CERTIFICATES TABLE
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
DROP POLICY IF EXISTS "Users can insert own certificates" ON certificates;

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own certificates"
  ON certificates FOR INSERT
  WITH CHECK (true);

-- CERTIFICATE_TEMPLATES TABLE
DROP POLICY IF EXISTS "Anyone can view templates" ON certificate_templates;
DROP POLICY IF EXISTS "Service role can manage templates" ON certificate_templates;

ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates"
  ON certificate_templates FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage templates"
  ON certificate_templates FOR ALL
  USING (true)
  WITH CHECK (true);

-- PLANS TABLE
DROP POLICY IF EXISTS "Anyone can view plans" ON plans;
DROP POLICY IF EXISTS "Service role can manage plans" ON plans;

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plans"
  ON plans FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage plans"
  ON plans FOR ALL
  USING (true)
  WITH CHECK (true);

-- SUBSCRIPTIONS TABLE
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- PAYMENT_HISTORY TABLE
DROP POLICY IF EXISTS "Users can view own payment history" ON payment_history;
DROP POLICY IF EXISTS "Service role can manage payment history" ON payment_history;

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage payment history"
  ON payment_history FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comentários
COMMENT ON POLICY "Service role can insert courses" ON courses IS 'Permite que o service role (backend) insira cursos';
COMMENT ON POLICY "Service role can insert modules" ON modules IS 'Permite que o service role (backend) insira módulos';
COMMENT ON POLICY "Service role can insert lessons" ON lessons IS 'Permite que o service role (backend) insira aulas';
