# ⚠️ INSTRUÇÕES URGENTES - Resolver Erro 500 na Importação

## 🔴 PROBLEMA IDENTIFICADO

O erro 500 acontece porque a coluna `free_trial` ainda NÃO existe na tabela `lessons` do banco de dados.

## ✅ SOLUÇÃO

Você precisa aplicar a migration de assinaturas **ANTES** de usar a importação CSV.

---

## 📋 PASSO A PASSO

### 1. Acesse o Supabase Dashboard
- URL: https://supabase.com/dashboard
- Selecione seu projeto: **webapp**

### 2. Abra o SQL Editor
- Menu lateral esquerdo → **SQL Editor**
- Clique em **New query**

### 3. Copie e Cole o SQL
Copie TODO o conteúdo abaixo e cole no SQL Editor:

```sql
-- ============================================
-- SISTEMA DE PLANOS E ASSINATURAS
-- ============================================

-- Tabela de Planos de Assinatura
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  duration_days INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  is_free_trial BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);
CREATE INDEX IF NOT EXISTS idx_plans_free_trial ON plans(is_free_trial);

-- Tabela de Assinaturas dos Usuários
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_active_user ON subscriptions(user_email, status) 
  WHERE status = 'active';

-- ⚠️ ESTA É A LINHA MAIS IMPORTANTE - Adiciona coluna free_trial
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS free_trial BOOLEAN DEFAULT false;

-- Índice para aulas gratuitas
CREATE INDEX IF NOT EXISTS idx_lessons_free_trial ON lessons(free_trial);

-- Tabela de Histórico de Pagamentos
CREATE TABLE IF NOT EXISTS payment_history (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_payment_history_user ON payment_history(user_email);
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription ON payment_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);

-- Inserir Planos Padrão
INSERT INTO plans (name, description, price, duration_days, is_active, is_free_trial, features, display_order)
VALUES 
  (
    'Teste Grátis',
    'Acesso limitado às aulas de demonstração',
    0.00,
    7,
    true,
    true,
    '["Acesso a aulas gratuitas", "7 dias de teste", "Sem cartão de crédito"]'::jsonb,
    1
  ),
  (
    'Mensal',
    'Acesso completo por 30 dias',
    49.90,
    30,
    true,
    false,
    '["Acesso a todos os cursos", "Certificados", "Suporte prioritário", "Material complementar"]'::jsonb,
    2
  ),
  (
    'Trimestral',
    'Acesso completo por 90 dias - Economize 15%',
    127.00,
    90,
    true,
    false,
    '["Acesso a todos os cursos", "Certificados", "Suporte prioritário", "Material complementar", "15% de desconto"]'::jsonb,
    3
  ),
  (
    'Anual',
    'Acesso completo por 365 dias - Economize 30%',
    419.00,
    365,
    true,
    false,
    '["Acesso a todos os cursos", "Certificados", "Suporte prioritário", "Material complementar", "30% de desconto", "Acesso prioritário a novos cursos"]'::jsonb,
    4
  )
ON CONFLICT DO NOTHING;

-- Função para verificar se usuário tem acesso à aula
CREATE OR REPLACE FUNCTION user_has_lesson_access(p_user_email VARCHAR, p_lesson_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  lesson_is_free BOOLEAN;
  has_active_subscription BOOLEAN;
BEGIN
  -- Verificar se a aula é gratuita
  SELECT free_trial INTO lesson_is_free
  FROM lessons
  WHERE id = p_lesson_id;
  
  -- Se a aula é gratuita, sempre permitir acesso
  IF lesson_is_free THEN
    RETURN true;
  END IF;
  
  -- Verificar se o usuário tem assinatura ativa e não expirada
  SELECT EXISTS(
    SELECT 1
    FROM subscriptions
    WHERE user_email = p_user_email
    AND status = 'active'
    AND end_date > NOW()
  ) INTO has_active_subscription;
  
  RETURN has_active_subscription;
END;
$$ LANGUAGE plpgsql;

-- Função para expirar assinaturas automaticamente
CREATE OR REPLACE FUNCTION expire_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE subscriptions
  SET status = 'expired',
      updated_at = NOW()
  WHERE status = 'active'
  AND end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Função para obter o plano atual do usuário
CREATE OR REPLACE FUNCTION get_user_current_plan(p_user_email VARCHAR)
RETURNS TABLE(
  plan_id INTEGER,
  plan_name VARCHAR,
  status VARCHAR,
  end_date TIMESTAMP,
  days_remaining INTEGER,
  is_free_trial BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.plan_id,
    p.name as plan_name,
    s.status,
    s.end_date,
    EXTRACT(DAY FROM (s.end_date - NOW()))::INTEGER as days_remaining,
    p.is_free_trial
  FROM subscriptions s
  JOIN plans p ON s.plan_id = p.id
  WHERE s.user_email = p_user_email
  AND s.status = 'active'
  AND s.end_date > NOW()
  ORDER BY s.end_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Comentários nas tabelas
COMMENT ON TABLE plans IS 'Planos de assinatura disponíveis';
COMMENT ON TABLE subscriptions IS 'Assinaturas ativas dos usuários';
COMMENT ON TABLE payment_history IS 'Histórico de pagamentos realizados';
COMMENT ON COLUMN lessons.free_trial IS 'Indica se a aula está disponível no teste grátis';
COMMENT ON FUNCTION user_has_lesson_access IS 'Verifica se usuário tem permissão para acessar uma aula';
COMMENT ON FUNCTION expire_subscriptions IS 'Expira assinaturas que já passaram da data de término';
COMMENT ON FUNCTION get_user_current_plan IS 'Retorna o plano ativo atual do usuário';
```

### 4. Execute o SQL
- Clique no botão **Run** (ou pressione Ctrl+Enter)
- Aguarde alguns segundos até aparecer mensagem de sucesso

### 5. Verifique se Funcionou
Execute esta query para verificar se a coluna foi criada:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'lessons' 
AND column_name = 'free_trial';
```

**Resultado esperado**: Deve mostrar 1 linha com `free_trial | boolean | YES`

---

## ✅ DEPOIS DE APLICAR A MIGRATION

1. **Rebuild no Easypanel** (se estiver usando Easypanel)
2. **Teste a importação novamente** no painel admin
3. O erro 500 deve desaparecer! 🎉

---

## 🐛 Se o Erro Persistir

Me avise com a mensagem de erro EXATA que aparece no log do navegador:
1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Tente importar o CSV novamente
4. Copie e me envie TODA a mensagem de erro

---

## 📱 Me Avise Quando Terminar

Após aplicar a migration, me avise para eu ajudar com os próximos passos! 👍
