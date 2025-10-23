# CCT - Clube do Cálculo Trabalhista

## 📋 Visão Geral do Projeto

**Nome**: CCT - Clube do Cálculo Trabalhista  
**Objetivo**: Plataforma de cursos online especializada em cálculos trabalhistas para profissionais da Justiça do Trabalho  
**Instrutor**: Vicelmo

### Principais Funcionalidades

✅ **Completas**:
- ✅ **Sistema de Autenticação com Supabase** (Login, Registro, Logout)
- ✅ Proteção de rotas - usuários não autenticados veem tela de login
- ✅ Listagem de cursos com contador de módulos e aulas
- ✅ Visualização detalhada de cursos com módulos e aulas organizados
- ✅ Sistema de progresso do usuário (marcar aulas como assistidas)
- ✅ Barra de progresso visual por curso
- ✅ Visualização de aulas individuais com descrição e duração
- ✅ Sistema de comentários nas aulas vinculados ao usuário
- ✅ Navegação fluida entre cursos, módulos e aulas
- ✅ Design responsivo com TailwindCSS
- ✅ Interface intuitiva e profissional
- ✅ Header com informações do usuário e botão de logout

🚧 **Pendentes**:
- ⏳ Integração com player de vídeo (YouTube, Vimeo ou outro)
- ⏳ Área administrativa para gerenciar cursos
- ⏳ Confirmação de email no registro
- ⏳ Recuperação de senha
- ⏳ Editar perfil do usuário
- ⏳ Certificados de conclusão
- ⏳ Fórum de discussões
- ⏳ Download de materiais complementares

## 🌐 URLs e Acesso

- **Desenvolvimento Local**: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
- **Produção**: (Aguardando deploy no Cloudflare Pages)

### Endpoints da API

#### Autenticação (Supabase)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login com email e senha |
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/logout` | Logout (limpa cookies) |
| GET | `/api/auth/me` | Retorna dados do usuário atual |

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

### Segurança

- ✅ Cookies **HTTP-only** (não acessíveis via JavaScript)
- ✅ Cookies **Secure** (apenas HTTPS)
- ✅ Tokens JWT validados no servidor
- ✅ Senhas hash no Supabase (bcrypt)
- ✅ Rate limiting do Supabase

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

4. **Escolha um curso**: Na página inicial, você verá todos os cursos disponíveis com informações sobre módulos e aulas
5. **Navegue pelos módulos**: Clique em um curso para ver seus módulos. Clique nos módulos para expandir e ver as aulas
6. **Assista às aulas**: Clique em uma aula para ver o conteúdo, vídeo e comentários
7. **Marque como concluída**: Após assistir, clique no botão "Marcar como concluída" para registrar seu progresso
8. **Comente**: Adicione comentários nas aulas para tirar dúvidas ou compartilhar insights
9. **Acompanhe seu progresso**: A barra de progresso mostra quantas aulas você já completou
10. **Logout**: Clique no botão "Sair" no canto superior direito quando terminar

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

- **Plataforma**: Cloudflare Pages + Cloudflare Workers
- **Status Atual**: ✅ Desenvolvimento local ativo
- **Produção**: ⏳ Aguardando configuração das credenciais Cloudflare

### Stack Tecnológica

- **Backend**: Hono Framework (TypeScript)
- **Frontend**: HTML5 + TailwindCSS + JavaScript (Vanilla)
- **Autenticação**: Supabase Auth
- **Database**: Cloudflare D1 (SQLite distribuído)
- **Deploy**: Cloudflare Pages/Workers
- **Process Manager**: PM2
- **Build Tool**: Vite

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

### Para Deploy em Produção

1. Configure as credenciais do Cloudflare:
   ```bash
   # Opção 1: Usar a ferramenta setup_cloudflare_api_key
   # Opção 2: Configurar manualmente na aba Deploy
   ```

2. Crie o banco de dados D1 em produção:
   ```bash
   npx wrangler d1 create cct-production
   # Copie o database_id gerado para wrangler.jsonc
   ```

3. Aplique as migrations:
   ```bash
   npm run db:migrate:prod
   ```

4. Faça o deploy:
   ```bash
   npm run deploy:prod
   ```

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
**Última Atualização**: 23 de Outubro de 2025

---

**Observações**:
- Os dados atuais são exemplos para demonstração
- Para popular com cursos reais, edite o arquivo `seed.sql` ou use a API
- O sistema está pronto para expansão com novas funcionalidades
