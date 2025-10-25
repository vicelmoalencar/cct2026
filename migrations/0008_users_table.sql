-- ============================================
-- TABELA DE USUÁRIOS DO SISTEMA
-- ============================================

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  cpf VARCHAR(14),
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  foto TEXT,
  
  -- Endereço
  end_cep VARCHAR(10),
  end_logradouro VARCHAR(255),
  end_numero VARCHAR(20),
  end_cidade VARCHAR(100),
  end_estado VARCHAR(2),
  
  -- Status e datas
  ativo BOOLEAN DEFAULT true,
  teste_gratis BOOLEAN DEFAULT false,
  dt_expiracao TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_ativo ON users(ativo);
CREATE INDEX IF NOT EXISTS idx_users_dt_expiracao ON users(dt_expiracao);

-- Comentários
COMMENT ON TABLE users IS 'Usuários do sistema CCT';
COMMENT ON COLUMN users.email IS 'Email único do usuário (usado para login)';
COMMENT ON COLUMN users.ativo IS 'Usuário está ativo no sistema';
COMMENT ON COLUMN users.teste_gratis IS 'Usuário tem acesso ao teste grátis';
COMMENT ON COLUMN users.dt_expiracao IS 'Data de expiração da assinatura';
