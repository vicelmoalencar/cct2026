-- ============================================
-- Tabela: usuarios_importados
-- Origem: usuarios-importados.csv (exportação Bubble)
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios_importados (
  id                    SERIAL PRIMARY KEY,
  id_bubble_user        VARCHAR(100),
  nome                  VARCHAR(255),
  first_name            VARCHAR(100),
  last_name             VARCHAR(100),
  email                 VARCHAR(255),
  assinatura_ativa      BOOLEAN DEFAULT false,
  ativo                 BOOLEAN DEFAULT false,
  cpf                   VARCHAR(20),
  dt_expiracao          TIMESTAMP,
  end_cep               VARCHAR(20),
  end_cidade            VARCHAR(100),
  end_estado            VARCHAR(10),
  end_logradouro        VARCHAR(255),
  end_numero            VARCHAR(20),
  foto                  TEXT,
  id_bubble_plano_atual VARCHAR(100),
  senha_provisoria      VARCHAR(255),
  suporte               VARCHAR(10),
  telefone              VARCHAR(30),
  teste_gratis          BOOLEAN DEFAULT false,
  tipo                  VARCHAR(50),
  whatsapp              VARCHAR(30),
  whatsapp_validacao    VARCHAR(30),
  importado_em          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_importados_email   ON usuarios_importados(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_importados_cpf     ON usuarios_importados(cpf);
CREATE INDEX IF NOT EXISTS idx_usuarios_importados_bubble  ON usuarios_importados(id_bubble_user);

COMMENT ON TABLE usuarios_importados IS 'Snapshot da exportação Bubble (usuarios-importados.csv) para consulta e migração futura';
