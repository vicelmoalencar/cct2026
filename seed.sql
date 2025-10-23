-- Inserindo cursos de exemplo
INSERT OR IGNORE INTO courses (id, title, description, duration_hours) VALUES 
  (1, 'Cálculos Trabalhistas Fundamentais', 'Aprenda os fundamentos essenciais dos cálculos trabalhistas na Justiça do Trabalho', 20),
  (2, 'Cálculos de Rescisão', 'Domine todos os tipos de cálculo de rescisão contratual', 15),
  (3, 'Perícias e Cálculos Complexos', 'Cálculos avançados para perícias trabalhistas', 25);

-- Módulos do Curso 1
INSERT OR IGNORE INTO modules (id, course_id, title, description, order_index) VALUES 
  (1, 1, 'Introdução aos Cálculos Trabalhistas', 'Conceitos básicos e legislação', 1),
  (2, 1, 'Salários e Remunerações', 'Cálculo de salários, adicionais e gratificações', 2),
  (3, 1, 'Férias e 13º Salário', 'Como calcular férias e décimo terceiro', 3);

-- Módulos do Curso 2
INSERT OR IGNORE INTO modules (id, course_id, title, description, order_index) VALUES 
  (4, 2, 'Tipos de Rescisão', 'Entendendo cada tipo de desligamento', 1),
  (5, 2, 'Verbas Rescisórias', 'Cálculo de todas as verbas rescisórias', 2);

-- Módulos do Curso 3
INSERT OR IGNORE INTO modules (id, course_id, title, description, order_index) VALUES 
  (6, 3, 'Perícia Trabalhista', 'Introdução à perícia trabalhista', 1),
  (7, 3, 'Cálculos de Diferenças Salariais', 'Cálculos complexos de diferenças', 2);

-- Aulas do Módulo 1
INSERT OR IGNORE INTO lessons (id, module_id, title, description, duration_minutes, order_index) VALUES 
  (1, 1, 'Bem-vindo ao CCT', 'Apresentação do curso e metodologia', 10, 1),
  (2, 1, 'CLT e Legislação Trabalhista', 'Fundamentos da Consolidação das Leis do Trabalho', 25, 2),
  (3, 1, 'Calculadora e Ferramentas', 'Como usar as ferramentas de cálculo', 15, 3);

-- Aulas do Módulo 2
INSERT OR IGNORE INTO lessons (id, module_id, title, description, duration_minutes, order_index) VALUES 
  (4, 2, 'Composição do Salário', 'O que compõe o salário do trabalhador', 20, 1),
  (5, 2, 'Adicionais: Noturno, Insalubridade e Periculosidade', 'Cálculo dos principais adicionais', 30, 2),
  (6, 2, 'Horas Extras', 'Como calcular horas extras corretamente', 35, 3);

-- Aulas do Módulo 3
INSERT OR IGNORE INTO lessons (id, module_id, title, description, duration_minutes, order_index) VALUES 
  (7, 3, 'Direito a Férias', 'Período aquisitivo e concessivo', 20, 1),
  (8, 3, 'Cálculo de Férias Integrais', 'Passo a passo do cálculo de férias', 25, 2),
  (9, 3, 'Cálculo do 13º Salário', 'Como calcular o décimo terceiro', 20, 3);

-- Comentários de exemplo
INSERT OR IGNORE INTO comments (lesson_id, user_name, user_email, comment_text) VALUES 
  (1, 'João Silva', 'joao@example.com', 'Excelente introdução! Muito didático.'),
  (2, 'Maria Santos', 'maria@example.com', 'Conteúdo muito completo sobre a CLT.'),
  (4, 'Pedro Costa', 'pedro@example.com', 'Dúvida: como fica o cálculo quando há comissões?');

-- Progresso de exemplo
INSERT OR IGNORE INTO user_progress (user_email, lesson_id, completed, completed_at) VALUES 
  ('usuario@example.com', 1, 1, datetime('now')),
  ('usuario@example.com', 2, 1, datetime('now')),
  ('usuario@example.com', 3, 0, NULL);
