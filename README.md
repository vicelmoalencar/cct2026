# CCT - Clube do Cálculo Trabalhista

## 📋 Visão Geral do Projeto

**Nome**: CCT - Clube do Cálculo Trabalhista  
**Objetivo**: Plataforma de cursos online especializada em cálculos trabalhistas para profissionais da Justiça do Trabalho  
**Instrutor**: Vicelmo

### Principais Funcionalidades

✅ **Completas**:
- ✅ **Sistema de Autenticação com Supabase** (Login, Registro, Logout)
- ✅ **Sistema de Recuperação de Senha** completo com email
- ✅ **Página de Perfil do Usuário** com edição de nome e alteração de senha
- ✅ **Sistema de Certificados** com geração automática ao completar 100% do curso
- ✅ **Painel de Administração** completo para gerenciar cursos e templates de certificados
- ✅ **Players de Vídeo** integrados (YouTube, Vimeo, URL customizada)
- ✅ **Permissões de Admin** - apenas emails autorizados acessam o painel
- ✅ Proteção de rotas - usuários não autenticados veem tela de login
- ✅ Listagem de cursos com contador de módulos e aulas
- ✅ Visualização detalhada de cursos com módulos e aulas organizados
- ✅ Sistema de progresso do usuário (marcar aulas como assistidas)
- ✅ Barra de progresso visual por curso
- ✅ Visualização de aulas individuais com player de vídeo embutido
- ✅ Sistema de comentários nas aulas vinculados ao usuário
- ✅ Navegação fluida entre cursos, módulos e aulas
- ✅ Design responsivo com TailwindCSS
- ✅ Interface intuitiva e profissional
- ✅ Header com informações do usuário e botão de admin/logout
- ✅ CRUD completo de cursos via painel admin
- ✅ Suporte a múltiplos formatos de vídeo

🚧 **Pendentes**:
- ⏳ Interface visual para gestão de módulos e aulas no painel admin
- ⏳ Confirmação de email no registro (configurável no Supabase)
- ⏳ Fórum de discussões
- ⏳ Download de materiais complementares

## 🌐 URLs e Acesso

- **Produção (Easypanel)**: https://ensinoplus-dev-cct2026.n697dr.easypanel.host
- **GitHub**: https://github.com/vicelmoalencar/cct2026
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin

### Endpoints da API

#### Autenticação (Supabase)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login com email e senha |
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/logout` | Logout (limpa cookies) |
| GET | `/api/auth/me` | Retorna dados do usuário atual |
| POST | `/api/auth/forgot-password` | Solicita recuperação de senha (envia email) |
| POST | `/api/auth/reset-password` | Redefine senha com token de recuperação |
| PUT | `/api/auth/profile` | Atualiza nome do usuário |
| POST | `/api/auth/change-password` | Altera senha (requer senha atual) |

#### Certificados (v2.0 - HTML/PDF com Verificação)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/certificates` | Página de certificados do usuário |
| GET | `/api/my-certificates` | Lista certificados do usuário (JSON) |
| GET | `/api/certificates/:id/html` | Gera certificado HTML |
| GET | `/verificar/:code` | Verificação pública (HTML) |
| GET | `/api/verify/:code` | Verificação pública (JSON) |
| GET | `/api/admin/certificates` | Lista todos (Admin) |
| GET | `/api/admin/certificates/find` | Busca duplicata (Admin) |
| POST | `/api/admin/certificates` | Criar certificado (Admin) |
| PUT | `/api/admin/certificates/:id` | Atualizar (Admin) |
| DELETE | `/api/admin/certificates/:id` | Deletar (Admin) |

#### Administração (Admin apenas)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/admin/check` | Verifica se usuário é admin |
| POST | `/api/admin/courses` | Criar novo curso |
| PUT | `/api/admin/courses/:id` | Atualizar curso |
| DELETE | `/api/admin/courses/:id` | Excluir curso |
| POST | `/api/admin/modules` | Criar novo módulo |
| PUT | `/api/admin/modules/:id` | Atualizar módulo |
| DELETE | `/api/admin/modules/:id` | Excluir módulo |
| POST | `/api/admin/lessons` | Criar nova aula |
| PUT | `/api/admin/lessons/:id` | Atualizar aula |
| DELETE | `/api/admin/lessons/:id` | Excluir aula |

#### Cursos e Aulas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/courses` | Lista todos os cursos |
| GET | `/api/courses/:id` | Detalhes de um curso com módulos e aulas |
| GET | `/api/lessons/:id` | Detalhes de uma aula com comentários |
| POST | `/api/lessons/:id/comments` | Adiciona comentário em uma aula |
| GET | `/api/progress/:email/:courseId` | Progresso do usuário em um curso |
| POST | `/api/progress/complete` | Marca aula como concluída |
| POST | `/api/progress/uncomplete` | Desmarca aula como concluída |

### Exemplos de Uso da API

**Listar cursos**:
```bash
curl https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/courses
```

**Ver detalhes de um curso**:
```bash
curl https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/courses/1
```

**Adicionar comentário**:
```bash
curl -X POST https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/lessons/1/comments \
  -H "Content-Type: application/json" \
  -d '{"user_name":"João","user_email":"joao@example.com","comment_text":"Ótima aula!"}'
```

**Marcar aula como concluída**:
```bash
curl -X POST https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/progress/complete \
  -H "Content-Type: application/json" \
  -d '{"user_email":"usuario@example.com","lesson_id":1}'
```

**Login (autenticação)**:
```bash
curl -X POST https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"suasenha"}'
```

**Registrar novo usuário**:
```bash
curl -X POST https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"novo@email.com","password":"senha123","name":"Seu Nome"}'
```

## 🔐 Sistema de Autenticação

### Integração com Supabase

O sistema utiliza **Supabase** como backend de autenticação, fornecendo:

- ✅ **Login seguro** com email e senha
- ✅ **Registro de novos usuários** com validação
- ✅ **Recuperação de senha** via email com token seguro
- ✅ **Gerenciamento de sessão** via cookies HTTP-only
- ✅ **Proteção de rotas** - usuários não autenticados não acessam o conteúdo
- ✅ **Token refresh automático** para manter usuários logados

### Configuração Supabase

**Variáveis de Ambiente**:
- `SUPABASE_URL`: URL do projeto Supabase
- `SUPABASE_ANON_KEY`: Chave pública (anon key)

**Arquivo .dev.vars** (local):
```env
SUPABASE_URL=https://ghdfouqzasvxlptbjkin.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

**Produção** (Cloudflare Pages):
```bash
# Configure secrets para produção
npx wrangler pages secret put SUPABASE_URL
npx wrangler pages secret put SUPABASE_ANON_KEY
```

### Fluxo de Autenticação

1. **Usuário não autenticado** → Vê tela de login/registro
2. **Registro** → Cria conta no Supabase → Recebe email de confirmação
3. **Login** → Valida credenciais → Recebe token JWT → Salvo em cookie
4. **Acesso ao app** → Token validado em cada requisição
5. **Logout** → Remove cookies → Redireciona para login

### Sistema de Recuperação de Senha

**Fluxo Completo**:

1. **Usuário esqueceu a senha** → Clica em "Esqueceu sua senha?" na tela de login
2. **Digite o email** → Sistema envia email com link de recuperação via Supabase
3. **Recebe email** → Email contém link único com token de segurança
4. **Clica no link** → Redireciona para `/reset-password` com token no URL
5. **Define nova senha** → Usuário digita e confirma nova senha (mínimo 6 caracteres)
6. **Senha atualizada** → Sistema valida token e atualiza senha no Supabase
7. **Login automático** → Após redefinir, usuário é autenticado automaticamente
8. **Redirecionamento** → Usuário é levado à página principal já logado

**Endpoints**:
- `POST /api/auth/forgot-password` - Solicita recuperação (body: `{email}`)
- `POST /api/auth/reset-password` - Redefine senha (body: `{token, password}`)
- `GET /reset-password` - Página de redefinição de senha (com token no hash)

**Recursos de Segurança**:
- ✅ Token único e temporário gerado pelo Supabase
- ✅ Link expira após uso ou tempo limite
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Confirmação de senha antes de enviar
- ✅ Token não revelado na URL (apenas no hash #)
- ✅ Mensagens genéricas para não revelar se email existe

### Segurança

- ✅ Cookies **HTTP-only** (não acessíveis via JavaScript)
- ✅ Cookies **Secure** (apenas HTTPS)
- ✅ Tokens JWT validados no servidor
- ✅ Senhas hash no Supabase (bcrypt)
- ✅ Rate limiting do Supabase

## 🎓 Sistema de Certificados (NOVO - v2.0)

### 🆕 Novidades da Versão 2.0

- ✅ **Certificados em HTML** profissional (não mais imagem estática)
- ✅ **Geração de PDF** via impressão do navegador
- ✅ **Código de verificação único** para validação pública
- ✅ **Página de verificação pública** - `/verificar/:codigo`
- ✅ **Contador de verificações** - rastreamento de acessos
- ✅ **Link de compartilhamento** fácil
- ✅ **Certificados aparecem automaticamente** após login baseado no email

### Como Funciona

#### **Para Alunos:**

1. **Faça login na plataforma**
   - Use seu email cadastrado

2. **Acesse seus certificados**
   - Clique no botão **"Certificados"** (amarelo) no header
   - Ou acesse: `/certificates`

3. **Visualize seus certificados disponíveis**
   - Veja todos os cursos que você concluiu
   - Cada certificado mostra:
     - Nome do curso
     - Carga horária
     - Data de conclusão
     - Código de verificação único

4. **Visualize o certificado**
   - Clique em **"Visualizar Certificado"**
   - Abre em nova aba com design profissional

5. **Baixe como PDF**
   - Clique em **"Baixar PDF"**
   - Use `Ctrl+P` (Windows) ou `Cmd+P` (Mac)
   - Selecione **"Salvar como PDF"**
   - Layout: **Paisagem** (Landscape)
   - Tamanho: **A4**

6. **Compartilhe o link de verificação**
   - Clique em **"Compartilhar Link"**
   - Copie o link público
   - Qualquer pessoa pode verificar a autenticidade

#### **Para Validação Pública:**

Qualquer pessoa pode verificar a autenticidade de um certificado:

1. **Acesse**: `https://seu-dominio.com/verificar/CCT-2025-XXXXX`
2. **Veja os dados validados**:
   - Nome do aluno
   - Título do curso
   - Carga horária
   - Data de conclusão
   - Data de emissão
   - Quantas vezes foi verificado

#### **Para Administradores:**

1. **Acesse Admin Panel → Certificados**
2. **Importe certificados via CSV**
   - Clique em "Importar CSV de Certificados"
   - Formato: `user_email; user_name; course_title; carga_horaria`
   - Sistema previne duplicatas automaticamente
3. **Visualize códigos de verificação**
   - Nova coluna mostra código único
   - Link para verificação pública
   - Botão para visualizar certificado
4. **Gerencie certificados**
   - Filtros por curso e busca
   - Estatísticas em tempo real
   - Deletar certificados individualmente

### Recursos do Sistema v2.0

- ✅ **Template HTML profissional** embutido no código
- ✅ **Design elegante** com bordas duplas e marca d'água
- ✅ **Código único** formato `CCT-YYYY-XXXXXXXX`
- ✅ **Verificação pública** sem necessidade de login
- ✅ **Contador de acessos** para cada certificado
- ✅ **API JSON** para integração (`/api/verify/:code`)
- ✅ **Página dedicada** `/certificates` para usuários
- ✅ **Importação CSV** em massa com prevenção de duplicatas
- ✅ **Filtros avançados** no admin panel
- ✅ **Responsivo** para desktop e mobile
- ✅ **Impressão otimizada** para PDF
- ✅ **Compartilhamento fácil** via Web Share API

### Design do Certificado

**Layout:**
- Formato: A4 Landscape (297mm x 210mm)
- Borda dupla: Externa (cinza escuro) + Interna (azul)
- Marca d'água: "CCT 2026" diagonal em transparência
- Fonte: Georgia (serifada, elegante)

**Elementos:**
- 📋 Header: Logo + "CCT 2026 - Centro de Capacitação Técnica"
- 🎓 Título: "CERTIFICADO" em destaque
- 👤 Nome do aluno em azul com linha inferior
- 📚 Nome do curso em negrito
- ⏱️ Carga horária, Data de conclusão, Data de emissão
- ✍️ Linha de assinatura digital
- 🔐 Código de verificação no rodapé direito
- 🌐 URL de verificação pública

### Estrutura de Dados

**Tabela: certificates**
- `id`: ID único
- `user_email`: Email do usuário
- `user_name`: Nome do usuário
- `course_id`: Referência ao curso (pode ser NULL para importados)
- `course_title`: Título do curso
- `issued_at`: Data de emissão
- `completion_date`: Data de conclusão
- `carga_horaria`: Carga horária em horas
- `certificate_code`: Código antigo (legacy)
- `verification_code`: **NOVO** - Código único de verificação
- `pdf_url`: **NOVO** - URL do PDF (opcional)
- `is_verified`: **NOVO** - Indica se certificado é válido
- `verification_count`: **NOVO** - Número de verificações
- `created_at`, `updated_at`: Timestamps

### Endpoints da API

#### Usuários Autenticados:
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/certificates` | Página de certificados do usuário |
| GET | `/api/my-certificates` | Lista certificados (JSON) |
| GET | `/api/certificates/:id/html` | Gera HTML do certificado |

#### Públicos (sem autenticação):
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/verificar/:code` | Página de verificação HTML |
| GET | `/api/verify/:code` | Verificação JSON |

#### Admin:
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/admin/certificates` | Lista todos certificados |
| GET | `/api/admin/certificates/find` | Busca por email+curso |
| POST | `/api/admin/certificates` | Criar certificado |
| PUT | `/api/admin/certificates/:id` | Atualizar certificado |
| DELETE | `/api/admin/certificates/:id` | Deletar certificado |

### Documentação Completa

Para instruções detalhadas de implantação, consulte:
📖 **INSTRUCOES_CERTIFICADOS.md**

Para criar contas de autenticação dos usuários certificados:
📖 **CRIAR_USUARIOS_AUTH.md**

## 🗄️ Arquitetura de Dados

### Modelo de Dados

O sistema utiliza **Cloudflare D1** (SQLite distribuído) com as seguintes tabelas:

#### **courses** (Cursos)
- `id`: ID único
- `title`: Título do curso
- `description`: Descrição
- `thumbnail`: URL da imagem (opcional)
- `instructor`: Nome do instrutor
- `duration_hours`: Duração total em horas
- `created_at`, `updated_at`: Timestamps

#### **modules** (Módulos)
- `id`: ID único
- `course_id`: Referência ao curso
- `title`: Título do módulo
- `description`: Descrição
- `order_index`: Ordem de exibição
- `created_at`: Timestamp

#### **lessons** (Aulas)
- `id`: ID único
- `module_id`: Referência ao módulo
- `title`: Título da aula
- `description`: Descrição
- `video_url`: URL do vídeo (opcional)
- `duration_minutes`: Duração em minutos
- `order_index`: Ordem de exibição
- `created_at`: Timestamp

#### **comments** (Comentários)
- `id`: ID único
- `lesson_id`: Referência à aula
- `user_name`: Nome do usuário
- `user_email`: Email do usuário
- `comment_text`: Texto do comentário
- `created_at`: Timestamp

#### **user_progress** (Progresso do Usuário)
- `id`: ID único
- `user_email`: Email do usuário
- `lesson_id`: Referência à aula
- `completed`: Boolean (0 ou 1)
- `completed_at`: Timestamp da conclusão

### Fluxo de Dados

1. **Listagem de Cursos**: Frontend → `/api/courses` → D1 Database → JSON com cursos, contadores de módulos e aulas
2. **Visualização de Curso**: Frontend → `/api/courses/:id` → D1 Database → JSON com curso, módulos aninhados e aulas
3. **Visualização de Aula**: Frontend → `/api/lessons/:id` → D1 Database → JSON com aula e comentários
4. **Progresso**: Frontend consulta `/api/progress/:email/:courseId` e atualiza via POST em `/api/progress/complete`
5. **Comentários**: Frontend envia POST para `/api/lessons/:id/comments` → D1 Database insere comentário

## 📚 Guia do Usuário

### Como Usar a Plataforma

#### Primeiro Acesso

1. **Acesse a plataforma**: Abra o navegador e acesse a URL fornecida
2. **Crie sua conta**: 
   - Clique na aba "Registrar"
   - Preencha seu nome, email e senha (mínimo 6 caracteres)
   - Clique em "Criar Conta"
   - Verifique seu email para confirmar o cadastro (se habilitado)
3. **Faça login**:
   - Use seu email e senha cadastrados
   - Clique em "Entrar"

#### Usando a Plataforma

4. **Acesse seus certificados**: Clique no botão "Certificados" (amarelo) para:
   - Ver todos os certificados conquistados
   - Baixar/visualizar certificados em alta qualidade
   - Acompanhar suas conquistas
5. **Gerencie seu perfil**: Clique no botão "Perfil" no header para:
   - Atualizar seu nome
   - Alterar sua senha (requer senha atual)
   - Visualizar suas informações de conta
6. **Escolha um curso**: Na página inicial, você verá todos os cursos disponíveis com informações sobre módulos e aulas
7. **Navegue pelos módulos**: Clique em um curso para ver seus módulos. Clique nos módulos para expandir e ver as aulas
8. **Assista às aulas**: Clique em uma aula para ver o conteúdo, vídeo e comentários
9. **Marque como concluída**: Após assistir, clique no botão "Marcar como concluída" para registrar seu progresso
10. **Comente**: Adicione comentários nas aulas para tirar dúvidas ou compartilhar insights
11. **Acompanhe seu progresso**: A barra de progresso mostra quantas aulas você já completou
12. **Receba seu certificado**: Ao completar 100% de um curso, o certificado é gerado automaticamente! 🎉
13. **Logout**: Clique no botão "Sair" no canto superior direito quando terminar

### Cursos Disponíveis (Dados de Exemplo)

1. **Cálculos Trabalhistas Fundamentais** (20h)
   - Módulo 1: Introdução aos Cálculos Trabalhistas
   - Módulo 2: Salários e Remunerações
   - Módulo 3: Férias e 13º Salário

2. **Cálculos de Rescisão** (15h)
   - Módulo 1: Tipos de Rescisão
   - Módulo 2: Verbas Rescisórias

3. **Perícias e Cálculos Complexos** (25h)
   - Módulo 1: Perícia Trabalhista
   - Módulo 2: Cálculos de Diferenças Salariais

## 🚀 Deploy e Configuração

### Status do Deployment

- **Plataforma**: Easypanel (Docker + Node.js)
- **Status Atual**: ✅ Produção ativa
- **URL de Produção**: https://ensinoplus-dev-cct2026.n697dr.easypanel.host
- **GitHub**: https://github.com/vicelmoalencar/cct2026
- **Deploy Automático**: Rebuild manual via Easypanel interface

### Stack Tecnológica

- **Backend**: Hono Framework (TypeScript) + Node.js
- **Frontend**: HTML5 + TailwindCSS + JavaScript (Vanilla)
- **Autenticação**: Supabase Auth (email/password + password recovery)
- **Database**: Supabase PostgreSQL
- **Deploy**: Easypanel (Docker + Node.js 20)
- **Build Tool**: Vite
- **Server Runtime**: @hono/node-server

### Estrutura do Projeto

```
webapp/
├── src/
│   └── index.tsx              # Backend Hono com API routes + Auth
├── public/
│   └── static/
│       ├── app.js             # Frontend JavaScript principal
│       └── auth.js            # Sistema de autenticação
├── migrations/
│   ├── 0001_initial_schema.sql # Schema do banco de dados
│   └── 0002_update_user_fields.sql # Índices de usuário
├── seed.sql                   # Dados de exemplo
├── .dev.vars                  # Variáveis de ambiente locais (Supabase)
├── wrangler.jsonc             # Configuração Cloudflare
├── ecosystem.config.cjs       # Configuração PM2
├── package.json               # Dependencies e scripts
└── README.md                  # Este arquivo
```

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev:sandbox          # Inicia servidor local com D1 local
npm run build                # Build do projeto
npm run test                 # Testa se o servidor está respondendo

# Banco de Dados
npm run db:migrate:local     # Aplica migrations localmente
npm run db:migrate:prod      # Aplica migrations em produção
npm run db:seed              # Popula banco com dados de exemplo
npm run db:reset             # Reset completo do banco local
npm run db:console:local     # Console SQL local

# Deploy
npm run deploy               # Build + Deploy para Cloudflare Pages
npm run deploy:prod          # Deploy para produção

# Utilitários
npm run clean-port           # Limpa a porta 3000
pm2 logs cct-clube-calculo --nostream  # Ver logs
pm2 restart cct-clube-calculo          # Reiniciar serviço
```

### Deploy no Easypanel (Configurado)

**Ambiente de Produção Ativo**:

1. **URL**: https://ensinoplus-dev-cct2026.n697dr.easypanel.host
2. **GitHub**: Código versionado em https://github.com/vicelmoalencar/cct2026
3. **Deploy**: Push para `main` branch → Rebuild manual no Easypanel

**Variáveis de Ambiente Configuradas**:
- `SUPABASE_URL`: https://ghdfouqzasvxlptbjkin.supabase.co
- `SUPABASE_ANON_KEY`: ✅ Configurada
- `PORT`: 80

**Health Check**:
- Endpoint: `/health`
- Self-check: A cada 10 segundos
- Keep-alive: A cada 30 segundos

**Para Fazer Deploy de Novas Alterações**:
1. Commit e push para GitHub: `git push origin main`
2. Acesse Easypanel → Aba "Geral" → Clique "Rebuild"
3. Aguarde o build completar (~2 minutos)
4. Verifique os logs para confirmar sucesso

## 🔄 Próximos Passos Recomendados

### Alta Prioridade
1. **Integrar player de vídeo**: Adicionar suporte a YouTube, Vimeo ou outro player
2. **Sistema de autenticação**: Implementar login/registro de usuários
3. **Área administrativa**: Criar painel para gerenciar cursos, módulos e aulas

### Média Prioridade
4. **Upload de vídeos**: Integrar com Cloudflare Stream ou outro serviço
5. **Certificados**: Gerar certificados automáticos ao concluir cursos
6. **Notificações**: Avisar sobre novos cursos ou aulas

### Baixa Prioridade
7. **Fórum de discussões**: Criar área de discussão entre alunos
8. **Download de materiais**: Permitir download de PDFs e planilhas
9. **Sistema de avaliação**: Provas e exercícios ao final dos módulos
10. **Analytics**: Dashboard com estatísticas de uso e progresso

## 👨‍💻 Desenvolvimento

**Desenvolvido para**: Vicelmo - Servidor da Justiça do Trabalho  
**Especialização**: Minuto decisões e despachos para a Justiça do Trabalho  
**Data de Criação**: 23 de Outubro de 2025  
**Última Atualização**: 24 de Outubro de 2025
**Status**: ✅ **Sistema em Produção no Easypanel**

---

**Observações**:
- Os dados atuais são exemplos para demonstração
- Para popular com cursos reais, edite o arquivo `seed.sql` ou use a API
- O sistema está pronto para expansão com novas funcionalidades
