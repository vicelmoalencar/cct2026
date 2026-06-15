import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { SupabaseClient } from './supabase-client'
import { PostgresClient } from './postgres-client'
import { LOGO_ENSINO_PLUS_B64 } from './logo-base64'
import QRCode from 'qrcode'

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  DATABASE_CCT: string;
  DATABASE_SUITEPLUS: string;
  DATABASE_URL_CREDITOS?: string;
}

const app = new Hono<{ Bindings: Bindings }>()
const creditsSchemaReady = new Map<string, Promise<void>>()
const lessonRentalSchemaReady = new Map<string, Promise<void>>()
const commentsReplySchemaReady = new Map<string, Promise<void>>()
const questionBankSchemaReady = new Map<string, Promise<void>>()

// Helper: retorna cliente PostgreSQL para dados do CCT
function getDB(c: any): PostgresClient {
  const connStr = c.env.DATABASE_CCT
  if (!connStr) throw new Error('DATABASE_CCT não configurado nas variáveis de ambiente')
  return new PostgresClient(connStr)
}

// Helper: retorna cliente PostgreSQL para créditos (Creditos_Ensinoplus)
function getCreditsDB(c: any): PostgresClient {
  const connStr = c.env.DATABASE_URL_CREDITOS || c.env.DATABASE_SUITEPLUS
  if (!connStr) throw new Error('DATABASE_URL_CREDITOS não configurado')
  return new PostgresClient(connStr)
}

async function ensureCreditsSchema(credDb: PostgresClient): Promise<void> {
  const key = (credDb as any).connectionString || 'credits'
  if (!creditsSchemaReady.has(key)) {
    creditsSchemaReady.set(key, (async () => {
      await credDb.sql(`
        CREATE TABLE IF NOT EXISTS users_credits (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL UNIQUE,
          credits_balance INTEGER NOT NULL DEFAULT 0,
          total_credits_used INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `)
      await credDb.sql(`CREATE INDEX IF NOT EXISTS idx_users_credits_email ON users_credits(lower(user_email))`)
    })())
  }

  await creditsSchemaReady.get(key)
}

async function getUserCreditBalance(credDb: PostgresClient, email: string): Promise<number> {
  await ensureCreditsSchema(credDb)
  const rows = await credDb.sql('SELECT credits_balance FROM users_credits WHERE lower(user_email) = lower($1)', [email])
  return rows.length > 0 ? parseInt(rows[0].credits_balance) : 0
}

async function deductCredits(credDb: PostgresClient, email: string, amount: number): Promise<boolean> {
  await ensureCreditsSchema(credDb)
  const rows = await credDb.sql(
    `UPDATE users_credits
     SET credits_balance = credits_balance - $1,
         total_credits_used = COALESCE(total_credits_used, 0) + $1,
         updated_at = NOW()
     WHERE lower(user_email) = lower($2)
       AND credits_balance >= $1
     RETURNING credits_balance`,
    [amount, email]
  )
  return rows.length > 0
}

async function addCredits(credDb: PostgresClient, email: string, amount: number): Promise<void> {
  await ensureCreditsSchema(credDb)
  await credDb.sql(
    `INSERT INTO users_credits (user_email, credits_balance)
     VALUES (lower($1), $2)
     ON CONFLICT (user_email) DO UPDATE
     SET credits_balance = users_credits.credits_balance + $2,
         updated_at = NOW()`,
    [email, amount]
  )
}

async function ensureLessonRentalSchema(db: PostgresClient): Promise<void> {
  const key = (db as any).connectionString || 'lesson-rentals'
  if (!lessonRentalSchemaReady.has(key)) {
    lessonRentalSchemaReady.set(key, (async () => {
      await db.sql(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rentable BOOLEAN DEFAULT FALSE`)
      await db.sql(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rental_credits INTEGER DEFAULT 0`)
      await db.sql(`
        CREATE TABLE IF NOT EXISTS lesson_rentals (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          lesson_id INTEGER NOT NULL,
          credits_paid INTEGER NOT NULL,
          rented_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL,
          UNIQUE(user_email, lesson_id)
        )
      `)
      await db.sql(`CREATE INDEX IF NOT EXISTS idx_lesson_rentals_email ON lesson_rentals(user_email)`)
      await db.sql(`CREATE INDEX IF NOT EXISTS idx_lesson_rentals_lesson ON lesson_rentals(lesson_id)`)
    })())
  }

  await lessonRentalSchemaReady.get(key)
}

async function ensureCommentsReplySchema(db: PostgresClient): Promise<void> {
  const key = (db as any).connectionString || 'comments-replies'
  if (!commentsReplySchemaReady.has(key)) {
    commentsReplySchemaReady.set(key, (async () => {
      await db.sql(`ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_reply TEXT`)
      await db.sql(`ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_replied_at TIMESTAMPTZ`)
      await db.sql(`ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_replied_by TEXT`)
      await db.sql(`CREATE INDEX IF NOT EXISTS idx_comments_admin_replied_at ON comments(admin_replied_at)`)
    })())
  }
  await commentsReplySchemaReady.get(key)
}

async function ensureQuestionBankSchema(db: PostgresClient): Promise<void> {
  const key = (db as any).connectionString || 'question-bank'
  if (!questionBankSchemaReady.has(key)) {
    questionBankSchemaReady.set(key, (async () => {
      await db.sql(`
        CREATE TABLE IF NOT EXISTS question_bank (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255),
          statement_html TEXT NOT NULL DEFAULT '',
          question_type VARCHAR(32) NOT NULL DEFAULT 'multiple_choice',
          alternatives JSONB NOT NULL DEFAULT '[]'::jsonb,
          answer_key JSONB NOT NULL DEFAULT '{}'::jsonb,
          technical_comment_html TEXT,
          difficulty VARCHAR(32) NOT NULL DEFAULT 'medio',
          theme VARCHAR(160),
          subtheme VARCHAR(160),
          legal_basis TEXT,
          weight NUMERIC(8,2) NOT NULL DEFAULT 1,
          estimated_minutes INTEGER NOT NULL DEFAULT 5,
          tags JSONB NOT NULL DEFAULT '[]'::jsonb,
          status VARCHAR(32) NOT NULL DEFAULT 'draft',
          professor VARCHAR(160),
          course_id INTEGER,
          lesson_id INTEGER,
          source_transcript TEXT,
          ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
          version INTEGER NOT NULL DEFAULT 1,
          order_index INTEGER NOT NULL DEFAULT 0,
          usage_count INTEGER NOT NULL DEFAULT 0,
          attempts_count INTEGER NOT NULL DEFAULT 0,
          correct_count INTEGER NOT NULL DEFAULT 0,
          wrong_count INTEGER NOT NULL DEFAULT 0,
          created_by VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `)
      await db.sql(`
        CREATE TABLE IF NOT EXISTS question_bank_versions (
          id SERIAL PRIMARY KEY,
          question_id INTEGER NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
          version INTEGER NOT NULL,
          snapshot JSONB NOT NULL,
          changed_by VARCHAR(255),
          change_note TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `)
      await db.sql(`
        CREATE TABLE IF NOT EXISTS question_bank_exam_items (
          id SERIAL PRIMARY KEY,
          question_id INTEGER NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
          exam_title VARCHAR(255),
          used_at TIMESTAMPTZ DEFAULT NOW()
        )
      `)
      await db.sql(`CREATE INDEX IF NOT EXISTS idx_question_bank_status ON question_bank(status)`)
      await db.sql(`CREATE INDEX IF NOT EXISTS idx_question_bank_type ON question_bank(question_type)`)
      await db.sql(`CREATE INDEX IF NOT EXISTS idx_question_bank_theme ON question_bank(theme)`)
      await db.sql(`CREATE INDEX IF NOT EXISTS idx_question_bank_course ON question_bank(course_id)`)
      await db.sql(`CREATE INDEX IF NOT EXISTS idx_question_versions_question ON question_bank_versions(question_id)`)
    })())
  }

  await questionBankSchemaReady.get(key)
}

// Consulta a data de expiração do usuário no sistema suiteplus (produto ID 4)
async function getSuiteplusExpiration(email: string, connStr: string): Promise<Date | null> {
  try {
    const db = new PostgresClient(connStr)
    const rows = await db.sql(
      `SELECT expires_at FROM user_subscriptions
       WHERE user_email = $1 AND product_id = 4 AND status = 'active'
       ORDER BY expires_at DESC LIMIT 1`,
      [email.toLowerCase()]
    )
    if (rows.length > 0 && rows[0].expires_at) return new Date(rows[0].expires_at)
    return null
  } catch (err: any) {
    console.error('⚠️ Suiteplus subscription check failed:', err.message)
    return null
  }
}

// Enable CORS for API routes
app.use('/api/*', cors())

// Note: Static files are served by the Node.js server or Cloudflare Pages
// No need to add serveStatic here

// ============================================
// HEALTH CHECK & DEBUG
// ============================================

// Health check endpoint
app.get('/health', (c) => {
  const hasSupabaseUrl = !!c.env.SUPABASE_URL
  const hasSupabaseKey = !!c.env.SUPABASE_ANON_KEY
  
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      supabase_url: hasSupabaseUrl ? '✅ Configured' : '❌ Missing',
      supabase_key: hasSupabaseKey ? '✅ Configured' : '❌ Missing'
    }
  })
})

// ============================================
// SUPABASE AUTH HELPERS
// ============================================

async function verifySupabaseToken(token: string, supabaseUrl: string, supabaseKey: string) {
  try {
    // Check if this is an impersonation token
    if (token.startsWith('IMPERSONATE:')) {
      const impersonationData = JSON.parse(
        Buffer.from(token.replace('IMPERSONATE:', ''), 'base64').toString('utf-8')
      )
      
      // Verify signature
      const expectedSignature = Buffer.from(`${impersonationData.email}:${supabaseKey}`).toString('base64')
      if (impersonationData.signature !== expectedSignature) {
        console.error('❌ Invalid impersonation token signature')
        return null
      }
      
      // Check if token is not too old (24 hours)
      const tokenAge = Date.now() - new Date(impersonationData.impersonated_at).getTime()
      if (tokenAge > 24 * 60 * 60 * 1000) {
        console.error('❌ Impersonation token expired')
        return null
      }
      
      console.log(`🎭 Using impersonation token for ${impersonationData.email}`)
      
      // Return user object in same format as Supabase
      return {
        email: impersonationData.email,
        user_metadata: {
          name: impersonationData.nome
        },
        id: impersonationData.user_id,
        impersonated: true
      }
    }
    
    // Normal Supabase token verification
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseKey
      }
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Auth middleware
async function requireAuth(c: any, next: any) {
  const token = getCookie(c, 'sb-access-token')
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  
  if (!user) {
    return c.json({ error: 'Invalid token' }, 401)
  }
  
  c.set('user', user)
  await next()
}

app.get('/api/user/credits', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const connStr = c.env.DATABASE_URL_CREDITOS || c.env.DATABASE_SUITEPLUS
    if (!connStr) {
      console.warn('Credits DB not configured — returning 0')
      return c.json({ success: true, credits: 0, unavailable: true })
    }
    const credDb = getCreditsDB(c)
    const credits = await getUserCreditBalance(credDb, user.email)
    return c.json({ success: true, credits })
  } catch (error: any) {
    console.error('Get credits error:', error)
    return c.json({ success: true, credits: 0, unavailable: true })
  }
})

// ============================================
// API ROUTES - AUTH
// ============================================

// Login endpoint
app.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password } = body
    
    console.log('🔐 Login attempt:', { email, hasPassword: !!password })
    console.log('🌐 Supabase URL:', c.env.SUPABASE_URL)
    console.log('🔑 Supabase Key present:', !!c.env.SUPABASE_ANON_KEY)
    
    if (!email || !password) {
      console.error('❌ Missing email or password')
      return c.json({ error: 'Email e senha são obrigatórios' }, 400)
    }
    
    const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    console.log('📨 Supabase response:', { status: response.status, ok: response.ok })
    
    if (!response.ok) {
      console.error('❌ Login failed:', data)
      return c.json({ error: data.error_description || data.message || 'Login failed' }, 400)
    }
    
    console.log('✅ Login successful for:', email)
    
    // Set cookies
    setCookie(c, 'sb-access-token', data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 3600 // 1 hour
    })
    
    setCookie(c, 'sb-refresh-token', data.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 604800 // 7 days
    })
    
    return c.json({ 
      success: true,
      user: data.user
    })
  } catch (error) {
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Register endpoint
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json()

    if (!email || !password || !name) {
      return c.json({ error: 'Nome, email e senha são obrigatórios' }, 400)
    }
    
    const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ 
        email, 
        password,
        data: { name }
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      const errorMessage = data.error_description || data.message || data.msg || data.error || 'Registration failed'
      console.error('❌ Supabase signup failed:', {
        status: response.status,
        error: errorMessage,
        raw: data
      })
      return c.json({ error: errorMessage }, response.status as any)
    }
    
    // Create user record in users table
    try {
      const db = getDB(c)
      await db.insert('users', {
        email,
        nome: name,
        ativo: true,
        teste_gratis: false
      })
      console.log('✅ User record created in users table:', email)
    } catch (userError) {
      console.error('❌ Failed to create user record:', userError)
      // Don't fail registration if user table insert fails
      // The auth user was already created successfully
    }
    
    return c.json({ 
      success: true,
      message: 'Registration successful. Please check your email to confirm.',
      user: data.user
    })
  } catch (error) {
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// Logout endpoint
app.post('/api/auth/logout', async (c) => {
  deleteCookie(c, 'sb-access-token')
  deleteCookie(c, 'sb-refresh-token')
  return c.json({ success: true })
})

// Get current user
app.get('/api/auth/me', async (c) => {
  const token = getCookie(c, 'sb-access-token')
  
  if (!token) {
    return c.json({ user: null })
  }
  
  // CRITICAL: Validate that this is not a recovery token being used as session
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const hasOTPMethod = payload.amr?.some((item: any) => item.method === 'otp')
    
    // If token was issued via OTP (password recovery), it should NOT be used for session
    // User must reset password first
    if (hasOTPMethod) {
      // Delete the invalid session cookie
      deleteCookie(c, 'sb-access-token')
      deleteCookie(c, 'sb-refresh-token')
      
      return c.json({ 
        user: null,
        error: 'password_reset_required',
        message: 'Por favor, redefina sua senha antes de fazer login'
      }, 401)
    }
  } catch (e) {
    // If JWT parsing fails, continue with normal verification
  }
  
  const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  
  return c.json({ user })
})

// Get user profile data from users table
app.get('/api/user/profile', async (c) => {
  try {
    const token = getCookie(c, 'sb-access-token')
    
    if (!token) {
      return c.json({ error: 'Não autenticado' }, 401)
    }
    
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404)
    }
    
    const db = getDB(c)
    const userProfile = await db.query('users', {
      select: '*',
      filters: { email: user.email },
      single: true
    })
    
    if (!userProfile) {
      // Create user profile if doesn't exist
      await db.insert('users', {
        email: user.email,
        nome: user.user_metadata?.name || '',
        ativo: true,
        teste_gratis: false
      })
      
      // Fetch again
      const newProfile = await db.query('users', {
        select: '*',
        filters: { email: user.email },
        single: true
      })
      
      return c.json({ profile: newProfile })
    }
    
    return c.json({ profile: userProfile })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return c.json({ error: 'Erro ao buscar perfil' }, 500)
  }
})

// Update user profile (complete data)
app.put('/api/user/profile', async (c) => {
  try {
    const token = getCookie(c, 'sb-access-token')
    
    if (!token) {
      return c.json({ error: 'Não autenticado' }, 401)
    }
    
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404)
    }
    
    const {
      nome,
      first_name,
      last_name,
      cpf,
      telefone,
      whatsapp,
      end_cep,
      end_logradouro,
      end_numero,
      end_cidade,
      end_estado
    } = await c.req.json()
    
    const db = getDB(c)
    
    // Update users table
    await db.update('users', { email: user.email }, {
      nome: nome || null,
      first_name: first_name || null,
      last_name: last_name || null,
      cpf: cpf || null,
      telefone: telefone || null,
      whatsapp: whatsapp || null,
      end_cep: end_cep || null,
      end_logradouro: end_logradouro || null,
      end_numero: end_numero || null,
      end_cidade: end_cidade || null,
      end_estado: end_estado || null,
      updated_at: new Date().toISOString()
    })
    
    // Also update auth user metadata with name
    if (nome) {
      await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': c.env.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          data: { name: nome.trim() }
        })
      })
    }
    
    return c.json({ 
      success: true,
      message: 'Perfil atualizado com sucesso!'
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return c.json({ error: 'Erro ao atualizar perfil' }, 500)
  }
})

// Update user profile (name only - legacy endpoint)
app.put('/api/auth/profile', async (c) => {
  try {
    const token = getCookie(c, 'sb-access-token')
    
    if (!token) {
      return c.json({ error: 'Não autenticado' }, 401)
    }
    
    const { name } = await c.req.json()
    
    console.log('👤 Profile update attempt')
    console.log('   Name:', name)
    
    if (!name || name.trim().length === 0) {
      console.error('❌ Missing name')
      return c.json({ error: 'Nome é obrigatório' }, 400)
    }
    
    // Update user metadata in Supabase
    const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        data: { name: name.trim() }
      })
    })
    
    console.log('📨 Supabase response:', { status: response.status, ok: response.ok })
    
    if (!response.ok) {
      const data = await response.json()
      console.error('❌ Profile update failed:', data)
      return c.json({ error: data.error_description || data.message || 'Falha ao atualizar perfil' }, 400)
    }
    
    const data = await response.json()
    console.log('✅ Profile updated successfully')
    
    return c.json({ 
      success: true,
      user: data,
      message: 'Perfil atualizado com sucesso!'
    })
  } catch (error) {
    console.error('💥 Profile update error:', error)
    return c.json({ error: 'Erro ao atualizar perfil' }, 500)
  }
})

// Change password (for authenticated users)
app.post('/api/auth/change-password', async (c) => {
  try {
    const token = getCookie(c, 'sb-access-token')
    
    if (!token) {
      return c.json({ error: 'Não autenticado' }, 401)
    }
    
    const { currentPassword, newPassword } = await c.req.json()
    
    console.log('🔐 Password change attempt')
    console.log('   Has current password:', !!currentPassword)
    console.log('   New password length:', newPassword?.length)
    
    if (!currentPassword || !newPassword) {
      console.error('❌ Missing passwords')
      return c.json({ error: 'Senha atual e nova senha são obrigatórias' }, 400)
    }
    
    if (newPassword.length < 6) {
      console.error('❌ Password too short')
      return c.json({ error: 'A nova senha deve ter pelo menos 6 caracteres' }, 400)
    }
    
    // First, verify current password by attempting login
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (!user || !user.email) {
      return c.json({ error: 'Usuário não encontrado' }, 401)
    }
    
    // Verify current password
    const loginResponse = await fetch(`${c.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ 
        email: user.email, 
        password: currentPassword 
      })
    })
    
    if (!loginResponse.ok) {
      console.error('❌ Current password is incorrect')
      return c.json({ error: 'Senha atual incorreta' }, 400)
    }
    
    console.log('✅ Current password verified')
    
    // Update password
    const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ password: newPassword })
    })
    
    console.log('📨 Supabase response:', { status: response.status, ok: response.ok })
    
    if (!response.ok) {
      const data = await response.json()
      console.error('❌ Password change failed:', data)
      
      let errorMessage = 'Falha ao alterar senha'
      if (data.error_code === 'same_password') {
        errorMessage = 'A nova senha deve ser diferente da senha atual'
      } else if (data.msg) {
        errorMessage = data.msg
      } else if (data.error_description) {
        errorMessage = data.error_description
      }
      
      return c.json({ error: errorMessage }, 400)
    }
    
    const data = await response.json()
    console.log('✅ Password changed successfully')
    
    // Update session tokens
    if (data.access_token) {
      setCookie(c, 'sb-access-token', data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 3600
      })
    }
    
    if (data.refresh_token) {
      setCookie(c, 'sb-refresh-token', data.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 604800
      })
    }
    
    return c.json({ 
      success: true,
      message: 'Senha alterada com sucesso!'
    })
  } catch (error) {
    console.error('💥 Password change error:', error)
    return c.json({ error: 'Erro ao alterar senha' }, 500)
  }
})

// Get user access status (for banner and access control)
app.get('/api/user/access-status', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const userEmail = user.email
    
    if (!userEmail) {
      return c.json({ error: 'Email do usuário não encontrado' }, 400)
    }
    
    const db = getDB(c)
    let accessType = 'SEM_ACESSO'

    // Try RPC but don't fail if it errors (ambiguity or missing function)
    try {
      const accessTypeResult = await db.rpc('user_tipo_acesso', {
        email_usuario: userEmail
      })
      console.log('🔍 Access type result for', userEmail, ':', accessTypeResult)
      if (typeof accessTypeResult === 'string') {
        accessType = accessTypeResult
      } else if (Array.isArray(accessTypeResult) && accessTypeResult.length > 0) {
        accessType = accessTypeResult[0].user_tipo_acesso || accessTypeResult[0]
      } else if (accessTypeResult && typeof accessTypeResult === 'object') {
        accessType = accessTypeResult.user_tipo_acesso
      }
    } catch (rpcError: any) {
      console.log('⚠️ user_tipo_acesso RPC error, will fallback to member_subscriptions:', rpcError?.message)
    }

    console.log('🔍 RPC accessType:', accessType)

    // Check member_subscriptions directly — overrides RPC if active subscription exists
    const activeSubscription = await db.query('member_subscriptions', {
      select: 'data_expiracao, teste_gratis, detalhe',
      filters: {
        email_membro: userEmail,
        ativo: true
      },
      order: 'data_expiracao.desc',
      limit: 1
    })

    let expirationDate = null
    let subscriptionDetail = null

    if (activeSubscription && activeSubscription.length > 0) {
      const sub = activeSubscription[0]
      const expDate = new Date(sub.data_expiracao)

      if (expDate > new Date()) {
        expirationDate = sub.data_expiracao
        subscriptionDetail = sub.detalhe
        if (accessType === 'SEM_ACESSO') accessType = 'COMPLETO'
      }
    }

    // Verificar assinatura no suiteplus (produto ID 4) como fonte primária de expiração
    const suiteplusConn = c.env.DATABASE_SUITEPLUS
    if (suiteplusConn) {
      const suiteplusExpires = await getSuiteplusExpiration(userEmail, suiteplusConn)
      if (suiteplusExpires && suiteplusExpires > new Date()) {
        if (accessType === 'SEM_ACESSO') accessType = 'COMPLETO'
        if (!expirationDate || suiteplusExpires > new Date(expirationDate)) {
          expirationDate = suiteplusExpires.toISOString()
        }
      }
    }

    console.log('✅ Final accessType for', userEmail, ':', accessType)

    return c.json({
      email: userEmail,
      accessType: accessType,
      hasActiveSubscription: accessType !== 'SEM_ACESSO',
      hasFullAccess: accessType === 'COMPLETO',
      expirationDate: expirationDate,
      subscriptionDetail: subscriptionDetail
    })
  } catch (error: any) {
    console.error('Error loading access status:', error?.message || error)
    return c.json({
      email: c.get('user')?.email || '',
      accessType: 'SEM_ACESSO',
      hasActiveSubscription: false,
      hasFullAccess: false,
      expirationDate: null,
      subscriptionDetail: null
    }, 200)
  }
})

// Get user subscriptions history
app.get('/api/user/subscriptions', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const userEmail = user.email
    
    if (!userEmail) {
      return c.json({ error: 'Email do usuário não encontrado' }, 400)
    }
    
    // Buscar todas as assinaturas do usuário
    const db = getDB(c)
    const subscriptions = await db.query('member_subscriptions', {
      select: '*',
      filters: { email_membro: userEmail },
      order: 'data_expiracao.desc'
    })

    // Sobrepor data_expiracao com a do suiteplus (produto ID 4) quando for mais recente
    const suiteplusConn = c.env.DATABASE_SUITEPLUS
    if (suiteplusConn && subscriptions && subscriptions.length > 0) {
      const suiteplusExpires = await getSuiteplusExpiration(userEmail, suiteplusConn)
      if (suiteplusExpires) {
        for (const sub of subscriptions) {
          const current = new Date(sub.data_expiracao)
          if (suiteplusExpires > current) {
            sub.data_expiracao = suiteplusExpires.toISOString()
          }
        }
      }
    }

    return c.json({
      subscriptions: subscriptions || [],
      total: subscriptions?.length || 0
    })
  } catch (error: any) {
    console.error('Error loading subscriptions:', error)
    return c.json({ error: error.message || 'Erro ao carregar assinaturas' }, 500)
  }
})

// Catch malformed URLs with spaces or duplicates
app.get('/auth/callback*', async (c) => {
  const fullPath = c.req.path
  
  // If path contains space (%20) or duplicate URLs, extract only the first part
  if (fullPath.includes('%20') || fullPath.includes(' ')) {
    const cleanPath = fullPath.split(/(%20| )/)[0]
    const hash = c.req.url.split('#')[1]
    const query = c.req.url.split('?')[1]?.split('#')[0]
    
    let redirectUrl = cleanPath
    if (query) redirectUrl += '?' + query
    if (hash) redirectUrl += '#' + hash
    
    return c.redirect(redirectUrl)
  }
  
  return await handleAuthCallback(c)
})

// Auth callback - handles email confirmation, OAuth redirects, and password recovery
async function handleAuthCallback(c: any) {
  const url = new URL(c.req.url)
  
  // Check for errors in query params or hash
  const errorCode = url.searchParams.get('error_code') || url.hash.match(/error_code=([^&]+)/)?.[1]
  const errorDescription = url.searchParams.get('error_description') || url.hash.match(/error_description=([^&]+)/)?.[1]
  
  if (errorCode) {
    // Handle expired or invalid tokens
    if (errorCode === 'otp_expired') {
      return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Expirado - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div class="text-center mb-6">
            <div class="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-clock text-4xl text-red-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Link Expirado</h1>
            <p class="text-gray-600">
                O link de recuperação de senha expirou ou já foi usado.
            </p>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-blue-800">
                <i class="fas fa-info-circle mr-2"></i>
                Por motivos de segurança, os links de recuperação expiram rapidamente.
            </p>
        </div>
        
        <a href="/" 
           class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors">
            <i class="fas fa-redo mr-2"></i>
            Solicitar Novo Link
        </a>
        
        <p class="text-center text-sm text-gray-500 mt-4">
            Você será redirecionado para a tela de login onde pode solicitar um novo link.
        </p>
    </div>
</body>
</html>
      `)
    }
    
    return c.redirect(`/?error=${errorCode}`)
  }
  
  const accessToken = url.searchParams.get('access_token') || url.hash.match(/access_token=([^&]+)/)?.[1]
  const refreshToken = url.searchParams.get('refresh_token') || url.hash.match(/refresh_token=([^&]+)/)?.[1]
  const type = url.searchParams.get('type') || url.hash.match(/type=([^&]+)/)?.[1]
  
  if (!accessToken) {
    return c.redirect('/?error=no_token')
  }
  
  // CRITICAL: Check if this is a password recovery token
  // Recovery tokens should NEVER create a session automatically
  // They should only allow password reset
  
  // Check the JWT payload to determine if it's a recovery token
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    const hasRecoveryAMR = payload.amr?.some((item: any) => item.method === 'otp')
    
    // If type is recovery OR token was issued via OTP (password reset), go to reset page
    if (type === 'recovery' || hasRecoveryAMR) {
      // DO NOT set cookies - force user to reset password first
      return c.redirect(`/reset-password#access_token=${accessToken}&refresh_token=${refreshToken || ''}&type=recovery`)
    }
  } catch (e) {
    // If JWT parsing fails, default to recovery if type is present
    if (type === 'recovery') {
      return c.redirect(`/reset-password#access_token=${accessToken}&refresh_token=${refreshToken || ''}&type=recovery`)
    }
  }
  
  // Set cookies ONLY for normal auth (email confirmation, OAuth)
  setCookie(c, 'sb-access-token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 3600 // 1 hour
  })
  
  if (refreshToken) {
    setCookie(c, 'sb-refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 604800 // 7 days
    })
  }
  
  // Redirect to home with success message
  return c.redirect('/?auth=success')
}

// Auth callback POST - receives tokens from frontend
app.post('/api/auth/callback', async (c) => {
  try {
    const { access_token, refresh_token } = await c.req.json()
    
    if (!access_token) {
      return c.json({ error: 'No access token' }, 400)
    }
    
    // Set cookies
    setCookie(c, 'sb-access-token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 3600 // 1 hour
    })
    
    if (refresh_token) {
      setCookie(c, 'sb-refresh-token', refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 604800 // 7 days
      })
    }
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Callback failed' }, 500)
  }
})

// Request password reset
app.post('/api/auth/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    // Get the host from the request to build the redirect URL
    const host = c.req.header('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const redirectTo = `${protocol}://${host}/auth/callback`
    
    const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ 
        email,
        options: {
          redirectTo
        }
      })
    })
    
    // Supabase always returns 200 for security (don't reveal if email exists)
    if (response.ok) {
      return c.json({ 
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação. O link é válido por 1 hora.'
      })
    }
    
    const data = await response.json()
    return c.json({ error: data.error_description || 'Failed to send reset email' }, 400)
  } catch (error) {
    return c.json({ error: 'Failed to process request' }, 500)
  }
})

// Reset password with token
app.post('/api/auth/reset-password', async (c) => {
  try {
    const body = await c.req.json()
    const { token, password } = body
    
    console.log('🔐 Password reset attempt')
    console.log('   Token present:', !!token)
    console.log('   Token length:', token?.length)
    console.log('   Password length:', password?.length)
    
    if (!token || !password) {
      console.error('❌ Missing token or password')
      return c.json({ error: 'Token e senha são obrigatórios' }, 400)
    }
    
    if (password.length < 6) {
      console.error('❌ Password too short')
      return c.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, 400)
    }
    
    console.log('📨 Calling Supabase to update password...')
    const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ password })
    })
    
    console.log('📨 Supabase response:', { status: response.status, ok: response.ok })
    
    if (!response.ok) {
      const data = await response.json()
      console.error('❌ Password reset failed:', data)
      
      // Handle specific error cases
      let errorMessage = 'Falha ao redefinir senha'
      if (data.error_code === 'same_password') {
        errorMessage = 'A nova senha deve ser diferente da senha atual'
      } else if (data.msg) {
        errorMessage = data.msg
      } else if (data.error_description) {
        errorMessage = data.error_description
      } else if (data.message) {
        errorMessage = data.message
      }
      
      return c.json({ error: errorMessage }, 400)
    }
    
    const data = await response.json()
    console.log('✅ Password reset successful')
    
    // Set cookies with the new session
    if (data.access_token) {
      setCookie(c, 'sb-access-token', data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 3600 // 1 hour
      })
    }
    
    if (data.refresh_token) {
      setCookie(c, 'sb-refresh-token', data.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 604800 // 7 days
      })
    }
    
    return c.json({ 
      success: true,
      message: 'Senha alterada com sucesso!'
    })
  } catch (error) {
    return c.json({ error: 'Failed to reset password' }, 500)
  }
})

// ============================================
// ADMIN HELPERS
// ============================================

async function isAdmin(email: string, supabaseUrl: string, supabaseKey: string, token?: string) {
  try {
    const supabase = new SupabaseClient(supabaseUrl, supabaseKey)
    const result = await supabase.query('users', {
      select: 'id, email, isadmin',
      filters: {
        email,
        isadmin: true
      },
      single: true
    }, token)

    return result !== null
  } catch (error) {
    console.error('Error checking admin access in Supabase users:', error)
    return false
  }
}

// Admin middleware
async function requireAdmin(c: any, next: any) {
  const token = getCookie(c, 'sb-access-token')
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  
  if (!user) {
    return c.json({ error: 'Invalid token' }, 401)
  }
  
  const adminCheck = await isAdmin(user.email, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, token)
  
  if (!adminCheck) {
    return c.json({ error: 'Forbidden - Admin only' }, 403)
  }
  
  c.set('user', user)
  await next()
}

// ============================================
// API ROUTES - ADMIN
// ============================================

// Check if user is admin
app.get('/api/admin/check', async (c) => {
  const token = getCookie(c, 'sb-access-token')
  
  if (!token) {
    return c.json({ isAdmin: false })
  }
  
  const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  
  if (!user) {
    return c.json({ isAdmin: false })
  }
  
  const adminCheck = await isAdmin(user.email, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, token)
  return c.json({ isAdmin: adminCheck })
})

// Impersonate user (admin only)
app.post('/api/admin/impersonate', requireAdmin, async (c) => {
  try {
    const { user_email } = await c.req.json()

    if (!user_email) {
      return c.json({ error: 'user_email is required' }, 400)
    }

    console.log(`🎭 Admin impersonating user: ${user_email}`)

    // Check if user exists in users table or in imported member subscriptions
    const db = getDB(c)
    let users = await db.sql(
      `SELECT id, email, nome FROM users WHERE lower(email) = lower($1) LIMIT 1`,
      [user_email]
    )

    if (!users || users.length === 0) {
      users = await db.sql(
        `SELECT NULL::integer AS id, email_membro AS email, NULL::text AS nome
         FROM member_subscriptions
         WHERE lower(email_membro) = lower($1)
         ORDER BY data_expiracao DESC NULLS LAST
         LIMIT 1`,
        [user_email]
      )
    }

    if (!users || users.length === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    const targetUser = users[0]

    // Create impersonation token (base64 encoded JSON with special marker)
    const impersonationData = {
      email: user_email,
      nome: targetUser.nome || 'Usuário',
      impersonated: true,
      impersonated_at: new Date().toISOString(),
      user_id: targetUser.id,
      signature: Buffer.from(`${user_email}:${c.env.SUPABASE_ANON_KEY}`).toString('base64')
    }

    const impersonationToken = `IMPERSONATE:${Buffer.from(JSON.stringify(impersonationData)).toString('base64')}`

    // Back up admin's current token in a separate cookie, then set the impersonation token.
    // We do this server-side because the session cookie is HttpOnly and cannot be manipulated by JS.
    const adminToken = getCookie(c, 'sb-access-token')
    if (adminToken) {
      setCookie(c, 'sb-admin-backup-token', adminToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 86400
      })
    }
    setCookie(c, 'sb-access-token', impersonationToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 86400
    })

    console.log(`✅ Impersonation session set for ${user_email}`)

    return c.json({
      success: true,
      user_email,
      user_name: targetUser.nome
    })
  } catch (error: any) {
    console.error('Impersonation error:', error)
    return c.json({ error: error.message || 'Failed to impersonate user' }, 500)
  }
})

app.post('/api/admin/exit-impersonation', async (c) => {
  try {
    const backupToken = getCookie(c, 'sb-admin-backup-token')
    if (!backupToken) {
      return c.json({ error: 'No admin session to restore' }, 400)
    }
    setCookie(c, 'sb-access-token', backupToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 3600
    })
    deleteCookie(c, 'sb-admin-backup-token')
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Exit impersonation error:', error)
    return c.json({ error: error.message || 'Failed to exit impersonation' }, 500)
  }
})

// Create course (admin only)
app.post('/api/admin/courses', requireAdmin, async (c) => {
  try {
    const { title, description, duration_hours, instructor, offers_certificate, is_published } = await c.req.json()
    
    const db = getDB(c)
    const result = await db.insert('courses', {
      title,
      description: description || null,
      duration_hours: duration_hours || 0,
      instructor: instructor || 'Vicelmo',
      offers_certificate: offers_certificate !== undefined ? offers_certificate : true,
      is_published: is_published !== undefined ? is_published : true
    })
    
    return c.json({ 
      success: true, 
      course_id: result[0].id
    })
  } catch (error: any) {
    console.error('Create course error:', error)
    return c.json({ error: error.message || 'Failed to create course' }, 500)
  }
})

// Update course (admin only)
app.put('/api/admin/courses/:id', requireAdmin, async (c) => {
  try {
    const courseId = c.req.param('id')
    const { title, description, duration_hours, instructor, offers_certificate, is_published } = await c.req.json()
    
    const db = getDB(c)
    await db.update('courses', { id: courseId }, {
      title,
      description: description || null,
      duration_hours: duration_hours || 0,
      instructor: instructor || 'Vicelmo',
      offers_certificate: offers_certificate !== undefined ? offers_certificate : true,
      is_published: is_published !== undefined ? is_published : true
    })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update course' }, 500)
  }
})

// Delete course (admin only)
app.delete('/api/admin/courses/:id', requireAdmin, async (c) => {
  try {
    const courseId = c.req.param('id')
    
    const db = getDB(c)
    await db.delete('courses', { id: courseId })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to delete course' }, 500)
  }
})

// Find course by title (admin only - for duplicate checking)
app.get('/api/admin/courses/find', requireAdmin, async (c) => {
  try {
    const title = c.req.query('title')

    if (!title) {
      return c.json({ error: 'Title is required' }, 400)
    }

    const db = getDB(c)
    // Try exact case-insensitive match first
    const courses = await db.sql(
      `SELECT * FROM courses WHERE lower(title) = lower($1) LIMIT 1`,
      [title]
    )

    if (courses && courses.length > 0) {
      return c.json({ course: courses[0] })
    }

    // Fallback: partial ILIKE match (handles accents and partial titles)
    const partial = await db.sql(
      `SELECT * FROM courses WHERE lower(title) ILIKE lower($1) LIMIT 1`,
      [`%${title}%`]
    )

    return c.json({ course: partial && partial.length > 0 ? partial[0] : null })
  } catch (error: any) {
    console.error('Find course error:', error)
    return c.json({ error: error.message || 'Failed to find course' }, 500)
  }
})

// Create module (admin only)
app.post('/api/admin/modules', requireAdmin, async (c) => {
  try {
    const { course_id, title, description, order_index } = await c.req.json()
    
    const db = getDB(c)
    const result = await db.insert('modules', {
      course_id,
      title,
      description: description || null,
      order_index: order_index || 0
    })
    
    return c.json({ 
      success: true, 
      module_id: result[0].id
    })
  } catch (error: any) {
    console.error('Create module error:', error)
    return c.json({ error: error.message || 'Failed to create module' }, 500)
  }
})

// Reorder modules in bulk (admin only) - POST to avoid conflict with PUT /:id
app.post('/api/admin/modules-reorder', requireAdmin, async (c) => {
  try {
    const { modules } = await c.req.json()
    if (!Array.isArray(modules)) return c.json({ error: 'modules must be an array' }, 400)

    const db = getDB(c)
    for (const { id, order_index } of modules) {
      await db.update('modules', { id: Number(id) }, { order_index: Number(order_index) })
    }

    return c.json({ success: true })
  } catch (error: any) {
    console.error('Reorder modules error:', error)
    return c.json({ error: error.message || 'Failed to reorder modules' }, 500)
  }
})

// Update module (admin only)
app.put('/api/admin/modules/:id', requireAdmin, async (c) => {
  try {
    const moduleId = c.req.param('id')
    const { title, description, order_index } = await c.req.json()
    
    const db = getDB(c)
    await db.update('modules', { id: moduleId }, {
      title,
      description: description || null,
      order_index
    })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update module' }, 500)
  }
})

// Delete module (admin only)
app.delete('/api/admin/modules/:id', requireAdmin, async (c) => {
  try {
    const moduleId = c.req.param('id')
    
    const db = getDB(c)
    await db.delete('modules', { id: moduleId })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to delete module' }, 500)
  }
})

// Find module by title (admin only - for duplicate checking)
app.get('/api/admin/modules/find', requireAdmin, async (c) => {
  try {
    const courseId = c.req.query('course_id')
    const title = c.req.query('title')
    
    if (!courseId || !title) {
      return c.json({ error: 'course_id and title are required' }, 400)
    }
    
    const db = getDB(c)
    const modules = await db.query('modules', {
      select: '*',
      filters: { 
        course_id: courseId,
        title: title 
      },
      limit: 1
    })
    
    if (modules && modules.length > 0) {
      return c.json({ module: modules[0] })
    }
    
    return c.json({ module: null })
  } catch (error: any) {
    console.error('Find module error:', error)
    return c.json({ error: error.message || 'Failed to find module' }, 500)
  }
})

// Create lesson (admin only)
app.post('/api/admin/lessons', requireAdmin, async (c) => {
  try {
    const { module_id, title, description, video_provider, video_id, duration_minutes, order_index, free_trial, support_text, transcript, attachments, rentable, rental_credits } = await c.req.json()

    // Build video_url from provider and id
    let video_url = null
    if (video_provider && video_id) {
      if (video_provider === 'youtube') {
        video_url = `https://www.youtube.com/watch?v=${video_id}`
      } else if (video_provider === 'vimeo') {
        video_url = `https://vimeo.com/${video_id}`
      } else {
        video_url = video_id
      }
    }

    const db = getDB(c)
    const result = await db.insert('lessons', {
      module_id,
      title,
      description: description || null,
      video_url,
      video_provider: video_provider || null,
      video_id: video_id || null,
      duration_minutes: duration_minutes || 0,
      order_index: order_index || 0,
      teste_gratis: free_trial || false,
      support_text: support_text || null,
      transcript: transcript || null,
      attachments: JSON.stringify(attachments || []),
      rentable: rentable || false,
      rental_credits: rental_credits || 0
    })

    return c.json({
      success: true,
      lesson_id: result[0].id
    })
  } catch (error: any) {
    console.error('Create lesson error:', error)
    return c.json({ error: error.message || 'Failed to create lesson' }, 500)
  }
})

// Reorder lessons in bulk (admin only) — POST to avoid conflict with PUT /:id
app.post('/api/admin/lessons-reorder', requireAdmin, async (c) => {
  try {
    const { lessons } = await c.req.json()
    if (!Array.isArray(lessons)) return c.json({ error: 'lessons must be an array' }, 400)
    const db = getDB(c)
    for (const { id, order_index } of lessons) {
      await db.update('lessons', { id: Number(id) }, { order_index: Number(order_index) })
    }
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Reorder lessons error:', error)
    return c.json({ error: error.message || 'Failed to reorder lessons' }, 500)
  }
})

// Update lesson (admin only)
app.put('/api/admin/lessons/:id', requireAdmin, async (c) => {
  try {
    const lessonId = c.req.param('id')
    const { title, description, video_provider, video_id, duration_minutes, order_index, free_trial, support_text, transcript, attachments, rentable, rental_credits } = await c.req.json()
    
    // Build video_url from provider and id
    let video_url = null
    if (video_provider && video_id) {
      if (video_provider === 'youtube') {
        video_url = `https://www.youtube.com/watch?v=${video_id}`
      } else if (video_provider === 'vimeo') {
        video_url = `https://vimeo.com/${video_id}`
      } else {
        video_url = video_id
      }
    }
    
    const db = getDB(c)
    const id = parseInt(lessonId)

    // Update core fields (always present)
    await db.update('lessons', { id }, {
      title,
      description: description || null,
      video_url,
      video_provider: video_provider || null,
      video_id: video_id || null,
      duration_minutes: parseInt(duration_minutes) || 0,
      order_index: parseInt(order_index) || 0,
      teste_gratis: free_trial === true || free_trial === 'true',
    })

    // Update extra fields (added via migration — use individual try/catch to avoid blocking)
    try {
      await db.sql(
        `UPDATE lessons SET support_text = $1, transcript = $2, attachments = $3::jsonb WHERE id = $4`,
        [support_text || null, transcript || null, JSON.stringify(attachments || []), id]
      )
    } catch (e: any) {
      console.warn('support_text/transcript/attachments columns may not exist:', e.message)
    }

    // Update rental fields — always in a dedicated targeted query
    await db.sql(
      `UPDATE lessons SET rentable = $1, rental_credits = $2 WHERE id = $3`,
      [rentable === true || rentable === 'true', parseInt(rental_credits) || 0, id]
    )

    return c.json({ success: true })
  } catch (error: any) {
    console.error('Update lesson error:', error)
    return c.json({ error: error.message || 'Failed to update lesson' }, 500)
  }
})

// Generate transcript via OpenRouter (admin only)
app.post('/api/admin/lessons/:id/generate-transcript', requireAdmin, async (c) => {
  try {
    const lessonId = parseInt(c.req.param('id'))
    const { context } = await c.req.json()

    const db = getDB(c)
    const rows = await db.sql(
      `SELECT title, transcript FROM lessons WHERE id = $1`,
      [lessonId]
    )
    if (!rows.length) return c.json({ error: 'Aula não encontrada' }, 404)

    const lesson = rows[0]
    if (!lesson.transcript) return c.json({ error: 'Esta aula não possui transcrição para estruturar.' }, 400)

    const apiKey = (c.env as any).VITE_OPENROUTER_API_KEY
    if (!apiKey) return c.json({ error: 'VITE_OPENROUTER_API_KEY não configurada no ambiente' }, 500)

    const systemPrompt = `Você é um especialista em direito trabalhista, liquidação de sentença judicial e uso do software PJe-Calc. Sua tarefa é pegar transcrições brutas de aulas e organizá-las em Markdown estruturado, claro e didático.`

    const userPrompt = `Abaixo está a transcrição bruta de uma aula chamada "${lesson.title}".${context ? `\n\nInstruções adicionais: ${context}` : ''}

Organize essa transcrição em Markdown estruturado, sem inventar conteúdo. Apenas reorganize, agrupe por tópicos e formate o que já está no texto:
- Título principal com #
- Tópicos e subtópicos com ## e ###
- Conceitos importantes em **negrito**
- > Blockquote para trechos de destaque ou alertas
- Listas com - quando houver enumerações
- Um **Resumo** ao final com os pontos principais

Transcrição bruta:
---
${lesson.transcript}
---`

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://cct2026.com.br',
        'X-Title': 'CCT2026 Admin',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    if (!aiResponse.ok) {
      const err = await aiResponse.text()
      return c.json({ error: `Erro na API OpenRouter: ${err}` }, 500)
    }

    const aiData = await aiResponse.json() as any
    const transcript = aiData.choices?.[0]?.message?.content || ''
    return c.json({ transcript })
  } catch (error: any) {
    console.error('Generate transcript error:', error)
    return c.json({ error: error.message || 'Erro ao gerar transcrição' }, 500)
  }
})

// Structure transcript inline (sem lesson ID — para novas aulas)
app.post('/api/admin/structure-transcript', requireAdmin, async (c) => {
  try {
    const { title, transcript, context } = await c.req.json()
    if (!transcript?.trim()) return c.json({ error: 'Transcrição vazia' }, 400)

    const apiKey = (c.env as any).VITE_OPENROUTER_API_KEY
    if (!apiKey) return c.json({ error: 'VITE_OPENROUTER_API_KEY não configurada' }, 500)

    const systemPrompt = `Você é um especialista em direito trabalhista, liquidação de sentença judicial e uso do software PJe-Calc. Sua tarefa é pegar transcrições brutas de aulas e organizá-las em Markdown estruturado, claro e didático.`

    const userPrompt = `Abaixo está a transcrição bruta de uma aula${title ? ` chamada "${title}"` : ''}.${context ? `\n\nInstruções adicionais: ${context}` : ''}

Organize essa transcrição em Markdown estruturado, sem inventar conteúdo:
- Título principal com #
- Tópicos e subtópicos com ## e ###
- Conceitos importantes em **negrito**
- > Blockquote para destaques e alertas
- Listas com - quando houver enumerações
- Um ## Resumo ao final com os pontos principais

Transcrição bruta:
---
${transcript}
---`

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://cct2026.com.br',
        'X-Title': 'CCT2026 Admin',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })
    if (!aiRes.ok) return c.json({ error: `OpenRouter: ${await aiRes.text()}` }, 500)
    const aiData = await aiRes.json() as any
    return c.json({ transcript: aiData.choices?.[0]?.message?.content || '' })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Fetch Vimeo transcript via text tracks API (admin only)
app.post('/api/admin/vimeo-transcript', requireAdmin, async (c) => {
  try {
    const { video_id } = await c.req.json()
    if (!video_id) return c.json({ error: 'video_id obrigatório' }, 400)

    const token = (c.env as any).VIMEO_ACCESS_TOKEN
    if (!token) return c.json({ error: 'VIMEO_ACCESS_TOKEN não configurada' }, 500)

    const cleanId = String(video_id).replace(/^https?:\/\/(?:www\.)?vimeo\.com\//i, '').replace(/[?#].*$/, '').replace(/\/$/, '')

    const tracksRes = await fetch(`https://api.vimeo.com/videos/${cleanId}/texttracks?per_page=100`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.vimeo.*+json;version=3.4' },
    })
    if (!tracksRes.ok) return c.json({ error: `Vimeo API ${tracksRes.status}` }, 502)

    const tracksData = await tracksRes.json() as any
    const tracks: any[] = tracksData.data || []
    if (!tracks.length) return c.json({ error: 'Nenhuma legenda encontrada para este vídeo' }, 404)

    // Prefer PT tracks, then any active track
    const sorted = [...tracks].sort((a, b) => {
      const score = (t: any) => {
        let p = 0
        if (String(t.language || '').toLowerCase().startsWith('pt')) p += 40
        if (t.active !== false) p += 20
        if (t.type === 'captions') p += 10
        return p
      }
      return score(b) - score(a)
    })
    const track = sorted.find((t: any) => t.link) || null
    if (!track) return c.json({ error: 'Nenhuma legenda com link disponível' }, 404)

    const vttRes = await fetch(track.link)
    if (!vttRes.ok) return c.json({ error: `Download da legenda falhou: ${vttRes.status}` }, 502)
    const vtt = await vttRes.text()

    // VTT → plain text
    const lines = vtt.replace(/^﻿/, '').split(/\r?\n/).map((l: string) => l.trim())
    const textLines: string[] = []
    for (const line of lines) {
      if (!line || /^(WEBVTT|Kind:|Language:|NOTE|STYLE|REGION|\d+$)/.test(line) || line.includes('-->')) continue
      const cleaned = line.replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim()
      if (cleaned && textLines[textLines.length - 1] !== cleaned) textLines.push(cleaned)
    }
    const transcript = textLines.join(' ').replace(/\s+/g, ' ').trim()
    if (!transcript) return c.json({ error: 'Legenda encontrada mas está vazia' }, 404)

    return c.json({ transcript, language: track.language })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Transcribe Vimeo video with OpenAI Whisper + structure with AI (admin only)
app.post('/api/admin/lessons/:id/whisper-transcribe', requireAdmin, async (c) => {
  try {
    const lessonId = parseInt(c.req.param('id'))
    const db = getDB(c)

    const rows = await db.sql(
      'SELECT id, title, video_provider, video_id FROM lessons WHERE id = $1',
      [lessonId]
    )
    if (!rows.length) return c.json({ error: 'Aula não encontrada' }, 404)
    const lesson = rows[0]

    if (lesson.video_provider !== 'vimeo')
      return c.json({ error: 'Esta aula não usa Vimeo como provedor' }, 400)
    if (!lesson.video_id || !/^\d+$/.test(lesson.video_id))
      return c.json({ error: 'ID do vídeo Vimeo inválido' }, 400)

    const procEnv = (globalThis as any).process?.env || {}
    const vimeoToken = (c.env as any).VIMEO_ACCESS_TOKEN || procEnv.VIMEO_ACCESS_TOKEN
    const openaiKey = (c.env as any).OPENAI_API_KEY || procEnv.OPENAI_API_KEY || procEnv['OPENAI_API-KEY']
    const openrouterKey = (c.env as any).VITE_OPENROUTER_API_KEY || procEnv.VITE_OPENROUTER_API_KEY
    if (!vimeoToken) return c.json({ error: 'VIMEO_ACCESS_TOKEN não configurado' }, 500)
    if (!openaiKey) {
      const keys = Object.keys(procEnv).filter(k => k.toLowerCase().includes('openai'))
      return c.json({ error: `OPENAI_API_KEY não configurado. Chaves OPENAI encontradas: [${keys.join(', ')}]` }, 500)
    }

    // 1. Get Vimeo download URL (smallest quality)
    const vimeoRes = await fetch(`https://api.vimeo.com/videos/${lesson.video_id}?fields=download`, {
      headers: { Authorization: `Bearer ${vimeoToken}` }
    })
    if (!vimeoRes.ok) return c.json({ error: `Vimeo API ${vimeoRes.status}` }, 502)
    const vimeoData = await vimeoRes.json() as any
    const downloads = (vimeoData.download || [])
      .filter((d: any) => d.link && d.size)
      .sort((a: any, b: any) => a.size - b.size)
    if (!downloads.length) return c.json({ error: 'Download não disponível para este vídeo' }, 400)
    const chosen = downloads[0]
    const sizeMB = (chosen.size / 1024 / 1024).toFixed(1)

    // 2. Download video to buffer
    const videoRes = await fetch(chosen.link)
    if (!videoRes.ok) return c.json({ error: `Download falhou: HTTP ${videoRes.status}` }, 502)
    let audioBuffer = Buffer.from(await videoRes.arrayBuffer())
    let fileName = 'video.mp4'
    const MAX_BYTES = 24 * 1024 * 1024

    // 3. If large, try ffmpeg to extract compressed audio
    if (audioBuffer.length > MAX_BYTES) {
      try {
        const os = await import('os')
        const path = await import('path')
        const fs = await import('fs')
        const cp = await import('child_process')
        const tmpIn = path.join(os.tmpdir(), `cct_w_${lessonId}.mp4`)
        const tmpOut = path.join(os.tmpdir(), `cct_w_${lessonId}.mp3`)
        fs.writeFileSync(tmpIn, audioBuffer)
        const r = cp.spawnSync('ffmpeg', ['-y', '-i', tmpIn, '-vn', '-ar', '16000', '-ac', '1', '-b:a', '32k', tmpOut], { stdio: 'pipe' })
        if (r.status === 0 && fs.existsSync(tmpOut)) {
          audioBuffer = fs.readFileSync(tmpOut)
          fileName = 'audio.mp3'
          fs.unlinkSync(tmpOut)
        }
        fs.unlinkSync(tmpIn)
      } catch (_) { /* ffmpeg não disponível */ }

      if (audioBuffer.length > MAX_BYTES) {
        return c.json({ error: `Arquivo muito grande (${sizeMB} MB). Use o script de transcrição em lote.` }, 400)
      }
    }

    // 4. Transcribe with OpenAI Whisper
    const boundary = '----WhisperBoundary' + Date.now().toString(16)
    const CRLF = '\r\n'
    const mimeType = fileName.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4'
    const formBody = Buffer.concat([
      Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="${fileName}"${CRLF}Content-Type: ${mimeType}${CRLF}${CRLF}`),
      audioBuffer,
      Buffer.from(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="model"${CRLF}${CRLF}whisper-1`),
      Buffer.from(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="language"${CRLF}${CRLF}pt`),
      Buffer.from(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="response_format"${CRLF}${CRLF}text`),
      Buffer.from(`${CRLF}--${boundary}--${CRLF}`),
    ])
    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': String(formBody.length),
      },
      body: formBody,
    })
    if (!whisperRes.ok) return c.json({ error: `OpenAI Whisper ${whisperRes.status}: ${await whisperRes.text()}` }, 502)
    let transcript = (await whisperRes.text()).trim()

    // 5. Structure with AI
    let description: string | null = null
    if (openrouterKey && transcript) {
      const prompt = `Você é um assistente especializado em cursos de PJe-Calc (cálculos trabalhistas no sistema judicial brasileiro).\n\nRecebi a transcrição bruta de uma aula chamada "${lesson.title}". Organize esta transcrição em Markdown estruturado com:\n- Um resumo em ## Resumo (3-4 linhas)\n- Tópicos principais com ## e subtópicos com ###\n- **Negrito** para termos técnicos e ações importantes\n- Listas com - para passos ou itens\n- > Destaques para avisos, dicas e pontos críticos\n\nMantenha o idioma português do Brasil. Não adicione conteúdo que não esteja na transcrição.\n\nTRANSCRIÇÃO:\n${transcript}`
      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${openrouterKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages: [{ role: 'user', content: prompt }] })
      })
      if (aiRes.ok) {
        const aiData = await aiRes.json() as any
        const structured = aiData.choices?.[0]?.message?.content || ''
        if (structured) {
          transcript = structured
          const match = structured.match(/##\s*Resumo\s*\n([\s\S]*?)(?=\n##\s|\n*$)/)
          if (match) description = match[1].trim()
        }
      }
    }

    // 6. Save to DB
    await db.sql(
      `UPDATE lessons SET transcript = $1, description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END WHERE id = $3`,
      [transcript, description, lessonId]
    )

    return c.json({ transcript, description, sizeMB })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Transcribe Vimeo video with Groq Whisper + structure with AI (admin only)
app.post('/api/admin/lessons/:id/groq-transcribe', requireAdmin, async (c) => {
  try {
    const lessonId = parseInt(c.req.param('id'))
    const db = getDB(c)

    const rows = await db.sql(
      'SELECT id, title, video_provider, video_id FROM lessons WHERE id = $1',
      [lessonId]
    )
    if (!rows.length) return c.json({ error: 'Aula não encontrada' }, 404)
    const lesson = rows[0]

    if (lesson.video_provider !== 'vimeo')
      return c.json({ error: 'Esta aula não usa Vimeo como provedor' }, 400)
    if (!lesson.video_id || !/^\d+$/.test(lesson.video_id))
      return c.json({ error: 'ID do vídeo Vimeo inválido' }, 400)

    const procEnv = (globalThis as any).process?.env || {}
    const vimeoToken = (c.env as any).VIMEO_ACCESS_TOKEN || procEnv.VIMEO_ACCESS_TOKEN
    const groqKey = (c.env as any).GROQ_API_KEY || procEnv.GROQ_API_KEY
    const openrouterKey = (c.env as any).VITE_OPENROUTER_API_KEY || procEnv.VITE_OPENROUTER_API_KEY
    if (!vimeoToken) return c.json({ error: 'VIMEO_ACCESS_TOKEN não configurado' }, 500)
    if (!groqKey) {
      const keys = Object.keys(procEnv).filter(k => k.toLowerCase().includes('groq'))
      return c.json({ error: `GROQ_API_KEY não configurado. Chaves GROQ encontradas: [${keys.join(', ')}]` }, 500)
    }

    // 1. Get Vimeo download URL (smallest quality)
    const vimeoRes = await fetch(`https://api.vimeo.com/videos/${lesson.video_id}?fields=download`, {
      headers: { Authorization: `Bearer ${vimeoToken}` }
    })
    if (!vimeoRes.ok) return c.json({ error: `Vimeo API ${vimeoRes.status}` }, 502)
    const vimeoData = await vimeoRes.json() as any
    const downloads = (vimeoData.download || [])
      .filter((d: any) => d.link && d.size)
      .sort((a: any, b: any) => a.size - b.size)
    if (!downloads.length) return c.json({ error: 'Download não disponível para este vídeo' }, 400)
    const chosen = downloads[0]
    const sizeMB = (chosen.size / 1024 / 1024).toFixed(1)

    // 2. Download video to buffer
    const videoRes = await fetch(chosen.link)
    if (!videoRes.ok) return c.json({ error: `Download falhou: HTTP ${videoRes.status}` }, 502)
    let audioBuffer = Buffer.from(await videoRes.arrayBuffer())
    let fileName = 'video.mp4'
    const MAX_BYTES = 24 * 1024 * 1024

    // 3. If large, try ffmpeg to extract compressed audio
    if (audioBuffer.length > MAX_BYTES) {
      try {
        const os = await import('os')
        const path = await import('path')
        const fs = await import('fs')
        const cp = await import('child_process')
        const tmpIn = path.join(os.tmpdir(), `cct_g_${lessonId}.mp4`)
        const tmpOut = path.join(os.tmpdir(), `cct_g_${lessonId}.mp3`)
        fs.writeFileSync(tmpIn, audioBuffer)
        const r = cp.spawnSync('ffmpeg', ['-y', '-i', tmpIn, '-vn', '-ar', '16000', '-ac', '1', '-b:a', '32k', tmpOut], { stdio: 'pipe' })
        if (r.status === 0 && fs.existsSync(tmpOut)) {
          audioBuffer = fs.readFileSync(tmpOut)
          fileName = 'audio.mp3'
          fs.unlinkSync(tmpOut)
        }
        fs.unlinkSync(tmpIn)
      } catch (_) { /* ffmpeg não disponível */ }

      if (audioBuffer.length > MAX_BYTES) {
        return c.json({ error: `Arquivo muito grande (${sizeMB} MB). Use o script de transcrição em lote.` }, 400)
      }
    }

    // 4. Transcribe with Groq Whisper
    const boundary = '----GroqBoundary' + Date.now().toString(16)
    const CRLF = '\r\n'
    const mimeType = fileName.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4'
    const formBody = Buffer.concat([
      Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="${fileName}"${CRLF}Content-Type: ${mimeType}${CRLF}${CRLF}`),
      audioBuffer,
      Buffer.from(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="model"${CRLF}${CRLF}whisper-large-v3-turbo`),
      Buffer.from(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="language"${CRLF}${CRLF}pt`),
      Buffer.from(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="response_format"${CRLF}${CRLF}text`),
      Buffer.from(`${CRLF}--${boundary}--${CRLF}`),
    ])
    const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': String(formBody.length),
      },
      body: formBody,
    })
    if (!groqRes.ok) return c.json({ error: `Groq Whisper ${groqRes.status}: ${await groqRes.text()}` }, 502)
    let transcript = (await groqRes.text()).trim()

    // 5. Structure with AI
    let description: string | null = null
    if (openrouterKey && transcript) {
      const prompt = `Você é um assistente especializado em cursos de PJe-Calc (cálculos trabalhistas no sistema judicial brasileiro).\n\nRecebi a transcrição bruta de uma aula chamada "${lesson.title}". Organize esta transcrição em Markdown estruturado com:\n- Um resumo em ## Resumo (3-4 linhas)\n- Tópicos principais com ## e subtópicos com ###\n- **Negrito** para termos técnicos e ações importantes\n- Listas com - para passos ou itens\n- > Destaques para avisos, dicas e pontos críticos\n\nMantenha o idioma português do Brasil. Não adicione conteúdo que não esteja na transcrição.\n\nTRANSCRIÇÃO:\n${transcript}`
      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${openrouterKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages: [{ role: 'user', content: prompt }] })
      })
      if (aiRes.ok) {
        const aiData = await aiRes.json() as any
        const structured = aiData.choices?.[0]?.message?.content || ''
        if (structured) {
          transcript = structured
          const match = structured.match(/##\s*Resumo\s*\n([\s\S]*?)(?=\n##\s|\n*$)/)
          if (match) description = match[1].trim()
        }
      }
    }

    // 6. Save to DB
    await db.sql(
      `UPDATE lessons SET transcript = $1, description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END WHERE id = $3`,
      [transcript, description, lessonId]
    )

    return c.json({ transcript, description, sizeMB })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Delete lesson (admin only)
app.delete('/api/admin/lessons/:id', requireAdmin, async (c) => {
  try {
    const lessonId = c.req.param('id')
    
    const db = getDB(c)
    await db.delete('lessons', { id: lessonId })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to delete lesson' }, 500)
  }
})

// Rent a lesson (authenticated users without active subscription)
app.post('/api/lessons/:id/rent', requireAuth, async (c) => {
  try {
    const lessonId = parseInt(c.req.param('id'))
    const user = c.get('user')
    const userEmail = user.email

    const db = getDB(c)
    await ensureLessonRentalSchema(db)

    // Get lesson rental info
    const rows = await db.sql(
      'SELECT id, title, rentable, rental_credits FROM lessons WHERE id = $1',
      [lessonId]
    )
    if (!rows.length || !rows[0].rentable) {
      return c.json({ error: 'Esta aula não está disponível para aluguel' }, 400)
    }
    const lesson = rows[0]
    const cost = parseInt(lesson.rental_credits)
    if (!Number.isFinite(cost) || cost <= 0) {
      return c.json({ error: 'Créditos de aluguel inválidos para esta aula' }, 400)
    }

    // Check for existing active rental
    const existing = await db.sql(
      'SELECT expires_at FROM lesson_rentals WHERE user_email = $1 AND lesson_id = $2 AND expires_at > NOW()',
      [userEmail, lessonId]
    )
    if (existing.length > 0) {
      return c.json({ error: 'Você já possui acesso ativo a esta aula', expires_at: existing[0].expires_at }, 400)
    }

    // Check credit balance
    const credConnStr = c.env.DATABASE_URL_CREDITOS || c.env.DATABASE_SUITEPLUS
    console.log('Credits DB configured:', !!credConnStr, '| prefix:', credConnStr?.substring(0, 30))
    const credDb = getCreditsDB(c)
    const balance = await getUserCreditBalance(credDb, userEmail)
    if (balance < cost) {
      return c.json({ error: 'Créditos insuficientes', available: balance, required: cost }, 400)
    }

    // Deduct credits with a balance guard to avoid double-spending.
    const debited = await deductCredits(credDb, userEmail, cost)
    if (!debited) {
      const currentBalance = await getUserCreditBalance(credDb, userEmail)
      return c.json({ error: 'Créditos insuficientes', available: currentBalance, required: cost }, 400)
    }

    // Create rental (upsert — renews if expired)
    await db.sql(
      `INSERT INTO lesson_rentals (user_email, lesson_id, credits_paid, rented_at, expires_at)
       VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '30 days')
       ON CONFLICT (user_email, lesson_id)
       DO UPDATE SET credits_paid = $3, rented_at = NOW(), expires_at = NOW() + INTERVAL '30 days'`,
      [userEmail, lessonId, cost]
    )

    return c.json({ success: true, message: 'Aula alugada com sucesso! Acesso liberado por 30 dias.' })
  } catch (error: any) {
    console.error('Rent lesson error:', error)
    return c.json({ error: error.message || 'Erro ao processar aluguel' }, 500)
  }
})

// Get user's rented lessons
app.get('/api/user/rentals', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const db = getDB(c)
    await ensureLessonRentalSchema(db)

    const rentals = await db.sql(
      `SELECT lr.id, lr.lesson_id, lr.credits_paid, lr.rented_at, lr.expires_at,
              lr.expires_at > NOW() AS is_active,
              l.title AS lesson_title, l.description AS lesson_description,
              l.duration_minutes, l.video_provider,
              m.title AS module_title,
              co.title AS course_title, co.id AS course_id
       FROM lesson_rentals lr
       JOIN lessons l ON l.id = lr.lesson_id
       JOIN modules m ON m.id = l.module_id
       JOIN courses co ON co.id = m.course_id
       WHERE lr.user_email = $1
       ORDER BY lr.expires_at DESC`,
      [user.email]
    )

    return c.json({ rentals })
  } catch (error: any) {
    console.error('Get rentals error:', error)
    return c.json({ error: error.message || 'Erro ao buscar aluguéis' }, 500)
  }
})

// ============================================
// TRAILS (LEARNING PATHS)
// ============================================

async function ensureTrailsSchema(db: PostgresClient): Promise<void> {
  await db.sql(`
    CREATE TABLE IF NOT EXISTS trails (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      is_published BOOLEAN DEFAULT FALSE,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  await db.sql(`
    CREATE TABLE IF NOT EXISTS trail_lessons (
      id SERIAL PRIMARY KEY,
      trail_id INTEGER NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
      lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(trail_id, lesson_id)
    )
  `)
  await db.sql(`CREATE INDEX IF NOT EXISTS idx_trail_lessons_trail ON trail_lessons(trail_id)`)
  await db.sql(`CREATE INDEX IF NOT EXISTS idx_trail_lessons_lesson ON trail_lessons(lesson_id)`)
}

// List published trails (user)
app.get('/api/trails', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const db = getDB(c)
    await ensureTrailsSchema(db)

    const trails = await db.sql(`
      SELECT t.*,
             COUNT(tl.id)::int AS lessons_count,
             COUNT(up.id)::int AS completed_count
      FROM trails t
      LEFT JOIN trail_lessons tl ON tl.trail_id = t.id
      LEFT JOIN lessons l ON l.id = tl.lesson_id
      LEFT JOIN user_progress up ON up.lesson_id = tl.lesson_id AND up.user_email = $1 AND up.completed = true
      WHERE t.is_published = true
      GROUP BY t.id
      ORDER BY t.order_index ASC, t.created_at DESC
    `, [user.email])

    return c.json({ trails })
  } catch (error: any) {
    console.error('Get trails error:', error)
    return c.json({ error: error.message || 'Erro ao buscar trilhas' }, 500)
  }
})

// Get single trail with lessons and progress (user)
app.get('/api/trails/:id', requireAuth, async (c) => {
  try {
    const trailId = c.req.param('id')
    const user = c.get('user')
    const db = getDB(c)
    await ensureTrailsSchema(db)

    const trailRows = await db.sql(`SELECT * FROM trails WHERE id = $1`, [trailId])
    if (!trailRows.length) return c.json({ error: 'Trilha não encontrada' }, 404)
    const trail = trailRows[0]

    const lessons = await db.sql(`
      SELECT tl.order_index, tl.lesson_id,
             l.title, l.description, l.duration_minutes, l.video_provider, l.teste_gratis, l.rentable, l.rental_credits,
             m.title AS module_title,
             co.id AS course_id, co.title AS course_title,
             CASE WHEN up.completed = true THEN true ELSE false END AS is_completed
      FROM trail_lessons tl
      JOIN lessons l ON l.id = tl.lesson_id
      JOIN modules m ON m.id = l.module_id
      JOIN courses co ON co.id = m.course_id
      LEFT JOIN user_progress up ON up.lesson_id = tl.lesson_id AND up.user_email = $2 AND up.completed = true
      WHERE tl.trail_id = $1
      ORDER BY tl.order_index ASC
    `, [trailId, user.email])

    return c.json({ trail, lessons })
  } catch (error: any) {
    console.error('Get trail error:', error)
    return c.json({ error: error.message || 'Erro ao buscar trilha' }, 500)
  }
})

// Admin: list all trails
app.get('/api/admin/trails', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    await ensureTrailsSchema(db)

    const trails = await db.sql(`
      SELECT t.*, COUNT(tl.id)::int AS lessons_count
      FROM trails t
      LEFT JOIN trail_lessons tl ON tl.trail_id = t.id
      GROUP BY t.id
      ORDER BY t.order_index ASC, t.created_at DESC
    `)

    return c.json({ trails })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Admin: create trail
app.post('/api/admin/trails', requireAdmin, async (c) => {
  try {
    const { title, description, is_published, order_index } = await c.req.json()
    if (!title) return c.json({ error: 'title is required' }, 400)
    const db = getDB(c)
    await ensureTrailsSchema(db)

    const rows = await db.insert('trails', {
      title,
      description: description || null,
      is_published: is_published ?? false,
      order_index: order_index ?? 0,
    })
    return c.json({ success: true, trail_id: rows[0].id, trail: rows[0] })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Admin: update trail
app.put('/api/admin/trails/:id', requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const db = getDB(c)
    await ensureTrailsSchema(db)

    const allowed = ['title', 'description', 'is_published', 'order_index']
    const data: Record<string, any> = { updated_at: new Date().toISOString() }
    for (const k of allowed) if (k in body) data[k] = body[k]

    await db.update('trails', { id }, data)
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Admin: delete trail
app.delete('/api/admin/trails/:id', requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    await ensureTrailsSchema(db)
    await db.delete('trails', { id })
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Admin: add lesson to trail
app.post('/api/admin/trails/:id/lessons', requireAdmin, async (c) => {
  try {
    const trail_id = parseInt(c.req.param('id'))
    const { lesson_id } = await c.req.json()
    if (!lesson_id) return c.json({ error: 'lesson_id required' }, 400)
    const db = getDB(c)
    await ensureTrailsSchema(db)

    // Auto order_index = max + 1
    const maxRows = await db.sql(
      `SELECT COALESCE(MAX(order_index), -1) AS max_idx FROM trail_lessons WHERE trail_id = $1`,
      [trail_id]
    )
    const order_index = (maxRows[0]?.max_idx ?? -1) + 1

    await db.sql(
      `INSERT INTO trail_lessons (trail_id, lesson_id, order_index) VALUES ($1, $2, $3) ON CONFLICT (trail_id, lesson_id) DO NOTHING`,
      [trail_id, lesson_id, order_index]
    )
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Admin: remove lesson from trail
app.delete('/api/admin/trails/:id/lessons/:lessonId', requireAdmin, async (c) => {
  try {
    const trail_id = parseInt(c.req.param('id'))
    const lesson_id = parseInt(c.req.param('lessonId'))
    const db = getDB(c)
    await db.sql(`DELETE FROM trail_lessons WHERE trail_id = $1 AND lesson_id = $2`, [trail_id, lesson_id])
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Admin: reorder lessons in trail
app.post('/api/admin/trails/:id/reorder', requireAdmin, async (c) => {
  try {
    const trail_id = parseInt(c.req.param('id'))
    const { lessons } = await c.req.json() // [{lesson_id, order_index}]
    if (!Array.isArray(lessons)) return c.json({ error: 'lessons array required' }, 400)
    const db = getDB(c)

    for (const item of lessons) {
      await db.sql(
        `UPDATE trail_lessons SET order_index = $1 WHERE trail_id = $2 AND lesson_id = $3`,
        [item.order_index, trail_id, item.lesson_id]
      )
    }
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Admin: search lessons across all courses (for trail builder)
app.get('/api/admin/trails/search-lessons', requireAdmin, async (c) => {
  try {
    const q = c.req.query('q') || ''
    const courseId = c.req.query('course_id')
    const db = getDB(c)

    const courseFilter = courseId ? `AND co.id = ${parseInt(courseId)}` : ''
    const textFilter = q ? `AND (l.title ILIKE $1)` : ''
    const values: any[] = q ? [`%${q}%`] : []

    const lessons = await db.sql(`
      SELECT l.id, l.title, l.duration_minutes, l.teste_gratis, l.rentable, l.rental_credits,
             m.title AS module_title,
             co.id AS course_id, co.title AS course_title
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN courses co ON co.id = m.course_id
      WHERE 1=1 ${courseFilter} ${textFilter}
      ORDER BY co.title ASC, m.order_index ASC, l.order_index ASC
      LIMIT 50
    `, values)

    return c.json({ lessons })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Find lesson by title (admin only - for duplicate checking)
app.get('/api/admin/lessons/find', requireAdmin, async (c) => {
  try {
    const moduleId = c.req.query('module_id')
    const title = c.req.query('title')
    
    if (!moduleId || !title) {
      return c.json({ error: 'module_id and title are required' }, 400)
    }
    
    const db = getDB(c)
    const lessons = await db.query('lessons', {
      select: '*',
      filters: { 
        module_id: moduleId,
        title: title 
      },
      limit: 1
    })
    
    if (lessons && lessons.length > 0) {
      return c.json({ lesson: lessons[0] })
    }
    
    return c.json({ lesson: null })
  } catch (error: any) {
    console.error('Find lesson error:', error)
    return c.json({ error: error.message || 'Failed to find lesson' }, 500)
  }
})

function normalizeQuestionPayload(body: any, userEmail?: string) {
  const alternatives = Array.isArray(body.alternatives) ? body.alternatives : []
  const tags = Array.isArray(body.tags) ? body.tags : String(body.tags || '')
    .split(',')
    .map((tag: string) => tag.trim())
    .filter(Boolean)

  return {
    title: body.title || null,
    statement_html: body.statement_html || '',
    question_type: body.question_type || 'multiple_choice',
    alternatives: JSON.stringify(alternatives),
    answer_key: JSON.stringify(body.answer_key || {}),
    technical_comment_html: body.technical_comment_html || null,
    difficulty: body.difficulty || 'medio',
    theme: body.theme || null,
    subtheme: body.subtheme || null,
    legal_basis: body.legal_basis || null,
    weight: Number(body.weight || 1),
    estimated_minutes: parseInt(body.estimated_minutes) || 5,
    tags: JSON.stringify(tags),
    status: body.status || 'draft',
    professor: body.professor || null,
    course_id: body.course_id ? parseInt(body.course_id) : null,
    lesson_id: body.lesson_id ? parseInt(body.lesson_id) : null,
    source_transcript: body.source_transcript || null,
    ai_generated: body.ai_generated === true || body.ai_generated === 'true',
    order_index: parseInt(body.order_index) || 0,
    usage_count: parseInt(body.usage_count) || 0,
    attempts_count: parseInt(body.attempts_count) || 0,
    correct_count: parseInt(body.correct_count) || 0,
    wrong_count: parseInt(body.wrong_count) || 0,
    created_by: userEmail || body.created_by || null
  }
}

function removeTranscriptMentions(value: any): any {
  if (typeof value === 'string') {
    return value
      .replace(/\b(conforme|segundo|de acordo com|com base na|a partir da)\s+a\s+transcri[cç][aã]o\b/gi, '')
      .replace(/\bna\s+transcri[cç][aã]o\b/gi, 'no material de estudo')
      .replace(/\bda\s+transcri[cç][aã]o\b/gi, 'do material de estudo')
      .replace(/\btranscri[cç][aã]o\b/gi, 'material de estudo')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
      .trim()
  }
  if (Array.isArray(value)) {
    return value
      .map(removeTranscriptMentions)
      .filter((item) => !(typeof item === 'string' && /transcri[cç][aã]o/i.test(item)))
  }
  if (value && typeof value === 'object') {
    const cleaned: any = {}
    for (const [key, item] of Object.entries(value)) {
      cleaned[key] = removeTranscriptMentions(item)
    }
    return cleaned
  }
  return value
}

// Question bank - admin only
app.get('/api/admin/questions', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    await ensureQuestionBankSchema(db)

    const filters: string[] = []
    const values: any[] = []
    let idx = 1
    const addFilter = (sql: string, value: any) => {
      filters.push(sql.replace('?', `$${idx++}`))
      values.push(value)
    }

    const q = c.req.query('q')
    const theme = c.req.query('theme')
    const professor = c.req.query('professor')
    const course = c.req.query('course_id')
    const difficulty = c.req.query('difficulty')
    const type = c.req.query('question_type')
    const status = c.req.query('status')
    const from = c.req.query('from')
    const to = c.req.query('to')

    if (q) {
      filters.push(`(title ILIKE $${idx} OR statement_html ILIKE $${idx + 1} OR legal_basis ILIKE $${idx + 2})`)
      values.push(`%${q}%`, `%${q}%`, `%${q}%`)
      idx += 3
    }
    if (theme) addFilter('theme = ?', theme)
    if (professor) addFilter('professor = ?', professor)
    if (course) addFilter('course_id = ?', parseInt(course))
    if (difficulty) addFilter('difficulty = ?', difficulty)
    if (type) addFilter('question_type = ?', type)
    if (status) addFilter('status = ?', status)
    if (from) addFilter('created_at >= ?', from)
    if (to) addFilter('created_at <= ?', to)

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const questions = await db.sql(`
      SELECT q.*,
             c.title AS course_title,
             l.title AS lesson_title,
             CASE WHEN q.attempts_count > 0 THEN ROUND((q.correct_count::numeric / q.attempts_count::numeric) * 100, 1) ELSE NULL END AS success_rate,
             CASE WHEN q.attempts_count > 0 THEN ROUND((q.wrong_count::numeric / q.attempts_count::numeric) * 100, 1) ELSE NULL END AS real_difficulty_index
      FROM question_bank q
      LEFT JOIN courses c ON c.id = q.course_id
      LEFT JOIN lessons l ON l.id = q.lesson_id
      ${where}
      ORDER BY q.order_index ASC, q.updated_at DESC
      LIMIT 500
    `, values)
    return c.json({ questions })
  } catch (error: any) {
    console.error('List questions error:', error)
    return c.json({ error: error.message || 'Failed to list questions' }, 500)
  }
})

app.get('/api/admin/questions/stats', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    const rows = await db.sql(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'published')::int AS published,
        COUNT(*) FILTER (WHERE ai_generated)::int AS ai_generated,
        COALESCE(SUM(usage_count), 0)::int AS total_usage,
        ROUND(AVG(CASE WHEN attempts_count > 0 THEN correct_count::numeric / attempts_count::numeric * 100 END), 1) AS avg_success_rate
      FROM question_bank
    `)
    const mostWrong = await db.sql(`SELECT id, title, wrong_count, attempts_count FROM question_bank ORDER BY wrong_count DESC, attempts_count DESC LIMIT 5`)
    const mostUsed = await db.sql(`SELECT id, title, usage_count FROM question_bank ORDER BY usage_count DESC LIMIT 5`)
    return c.json({ stats: rows[0] || {}, mostWrong, mostUsed })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.get('/api/admin/questions/:id/versions', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    const versions = await db.sql(
      `SELECT * FROM question_bank_versions WHERE question_id = $1 ORDER BY version DESC, created_at DESC`,
      [parseInt(c.req.param('id'))]
    )
    return c.json({ versions })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.post('/api/admin/questions', requireAdmin, async (c) => {
  try {
    const user = c.get('user')
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    const payload = normalizeQuestionPayload(await c.req.json(), user?.email)
    const rows = await db.sql(`
      INSERT INTO question_bank (
        title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
        difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
        professor, course_id, lesson_id, source_transcript, ai_generated, order_index,
        usage_count, attempts_count, correct_count, wrong_count, created_by
      )
      VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
      RETURNING *
    `, [
      payload.title, payload.statement_html, payload.question_type, payload.alternatives, payload.answer_key,
      payload.technical_comment_html, payload.difficulty, payload.theme, payload.subtheme, payload.legal_basis,
      payload.weight, payload.estimated_minutes, payload.tags, payload.status, payload.professor, payload.course_id,
      payload.lesson_id, payload.source_transcript, payload.ai_generated, payload.order_index, payload.usage_count,
      payload.attempts_count, payload.correct_count, payload.wrong_count, payload.created_by
    ])
    const question = rows[0]
    await db.sql(
      `INSERT INTO question_bank_versions (question_id, version, snapshot, changed_by, change_note) VALUES ($1, $2, $3::jsonb, $4, $5)`,
      [question.id, 1, JSON.stringify(question), user?.email || null, 'Criacao']
    )
    return c.json({ success: true, question })
  } catch (error: any) {
    console.error('Create question error:', error)
    return c.json({ error: error.message || 'Failed to create question' }, 500)
  }
})

app.put('/api/admin/questions/:id', requireAdmin, async (c) => {
  try {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    const currentRows = await db.sql(`SELECT * FROM question_bank WHERE id = $1`, [id])
    if (!currentRows.length) return c.json({ error: 'Question not found' }, 404)
    const current = currentRows[0]
    const payload = normalizeQuestionPayload(await c.req.json(), user?.email)
    const nextVersion = parseInt(current.version || 1) + 1
    const rows = await db.sql(`
      UPDATE question_bank SET
        title=$1, statement_html=$2, question_type=$3, alternatives=$4::jsonb, answer_key=$5::jsonb,
        technical_comment_html=$6, difficulty=$7, theme=$8, subtheme=$9, legal_basis=$10,
        weight=$11, estimated_minutes=$12, tags=$13::jsonb, status=$14, professor=$15,
        course_id=$16, lesson_id=$17, source_transcript=$18, ai_generated=$19, order_index=$20,
        usage_count=$21, attempts_count=$22, correct_count=$23, wrong_count=$24,
        version=$25, updated_at=NOW()
      WHERE id=$26
      RETURNING *
    `, [
      payload.title, payload.statement_html, payload.question_type, payload.alternatives, payload.answer_key,
      payload.technical_comment_html, payload.difficulty, payload.theme, payload.subtheme, payload.legal_basis,
      payload.weight, payload.estimated_minutes, payload.tags, payload.status, payload.professor, payload.course_id,
      payload.lesson_id, payload.source_transcript, payload.ai_generated, payload.order_index, payload.usage_count,
      payload.attempts_count, payload.correct_count, payload.wrong_count, nextVersion, id
    ])
    await db.sql(
      `INSERT INTO question_bank_versions (question_id, version, snapshot, changed_by, change_note) VALUES ($1, $2, $3::jsonb, $4, $5)`,
      [id, nextVersion, JSON.stringify(rows[0]), user?.email || null, 'Edicao manual']
    )
    return c.json({ success: true, question: rows[0] })
  } catch (error: any) {
    console.error('Update question error:', error)
    return c.json({ error: error.message || 'Failed to update question' }, 500)
  }
})

app.post('/api/admin/questions/:id/duplicate', requireAdmin, async (c) => {
  try {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    const rows = await db.sql(`SELECT * FROM question_bank WHERE id = $1`, [id])
    if (!rows.length) return c.json({ error: 'Question not found' }, 404)
    const q = rows[0]
    const copy = await db.sql(`
      INSERT INTO question_bank (
        title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
        difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
        professor, course_id, lesson_id, source_transcript, ai_generated, order_index, created_by
      )
      VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,'draft',$14,$15,$16,$17,$18,$19,$20)
      RETURNING *
    `, [
      `${q.title || 'Questao'} (copia)`, q.statement_html, q.question_type, JSON.stringify(q.alternatives || []),
      JSON.stringify(q.answer_key || {}), q.technical_comment_html, q.difficulty, q.theme, q.subtheme, q.legal_basis,
      q.weight, q.estimated_minutes, JSON.stringify(q.tags || []), q.professor, q.course_id, q.lesson_id,
      q.source_transcript, q.ai_generated, q.order_index + 1, user?.email || null
    ])
    return c.json({ success: true, question: copy[0] })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.delete('/api/admin/questions/:id', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    await db.sql(`DELETE FROM question_bank WHERE id = $1`, [parseInt(c.req.param('id'))])
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.post('/api/admin/questions-reorder', requireAdmin, async (c) => {
  try {
    const { questions } = await c.req.json()
    if (!Array.isArray(questions)) return c.json({ error: 'questions must be an array' }, 400)
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    for (const item of questions) {
      await db.sql(`UPDATE question_bank SET order_index = $1, updated_at = NOW() WHERE id = $2`, [parseInt(item.order_index), parseInt(item.id)])
    }
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.post('/api/admin/questions/import', requireAdmin, async (c) => {
  try {
    const { questions } = await c.req.json()
    if (!Array.isArray(questions)) return c.json({ error: 'questions array required' }, 400)
    const user = c.get('user')
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    let created = 0
    for (const question of questions) {
      const payload = normalizeQuestionPayload(question, user?.email)
      await db.sql(`
        INSERT INTO question_bank (
          title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
          difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
          professor, course_id, lesson_id, source_transcript, ai_generated, order_index, created_by
        )
        VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,$19,$20,$21)
      `, [
        payload.title, payload.statement_html, payload.question_type, payload.alternatives, payload.answer_key,
        payload.technical_comment_html, payload.difficulty, payload.theme, payload.subtheme, payload.legal_basis,
        payload.weight, payload.estimated_minutes, payload.tags, payload.status, payload.professor, payload.course_id,
        payload.lesson_id, payload.source_transcript, payload.ai_generated, payload.order_index, payload.created_by
      ])
      created++
    }
    return c.json({ success: true, created })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.post('/api/admin/questions/generate-ai', requireAdmin, async (c) => {
  try {
    const { lesson_id, transcript, count = 5, types = ['multiple_choice', 'true_false', 'discursive'], difficulty = 'misto', context = '' } = await c.req.json()
    const db = getDB(c)
    await ensureQuestionBankSchema(db)
    let sourceText = transcript || ''
    let lesson: any = null
    if (lesson_id) {
      const rows = await db.sql(`
        SELECT l.id, l.title, l.transcript, c.title AS course_title, c.instructor, c.id AS course_id
        FROM lessons l
        JOIN modules m ON m.id = l.module_id
        JOIN courses c ON c.id = m.course_id
        WHERE l.id = $1
      `, [parseInt(lesson_id)])
      lesson = rows[0] || null
      sourceText = sourceText || lesson?.transcript || ''
    }
    if (!sourceText?.trim()) return c.json({ error: 'Informe uma transcricao ou selecione uma aula com transcricao.' }, 400)

    const apiKey = (c.env as any).VITE_OPENROUTER_API_KEY
    if (!apiKey) return c.json({ error: 'VITE_OPENROUTER_API_KEY nao configurada' }, 500)

    const prompt = `Gere questoes para prova de proficiencia e certificacao em calculos trabalhistas usando exclusivamente o conteudo-base fornecido abaixo.
Retorne somente JSON valido, sem markdown, no formato {"questions":[...]}.
Cada item deve conter: title, statement_html, question_type ("discursive", "multiple_choice" ou "true_false"), alternatives (array com {label,text_html,is_correct}), answer_key, technical_comment_html, difficulty ("facil","medio","dificil"), theme, subtheme, legal_basis, weight, estimated_minutes, tags.
Crie alternativas plausiveis, gabarito comentado e fundamentacao tecnica. Tipos desejados: ${types.join(', ')}. Dificuldade: ${difficulty}. Quantidade: ${count}.
Nao mencione "transcricao", "aula transcrita", "texto transcrito" ou a origem do conteudo em nenhum enunciado, alternativa, comentario, gabarito, tag, tema ou titulo. As questoes devem parecer itens independentes de prova.
Contexto adicional: ${context || 'nenhum'}.
Conteudo-base:
---
${sourceText.slice(0, 24000)}
---`

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://cct2026.com.br',
        'X-Title': 'CCT2026 Admin',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Voce e especialista em direito do trabalho, calculos trabalhistas, PJe-Calc e avaliacao educacional. Responda apenas JSON valido.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' }
      }),
    })
    if (!aiRes.ok) return c.json({ error: `OpenRouter: ${await aiRes.text()}` }, 500)
    const data = await aiRes.json() as any
    const raw = data.choices?.[0]?.message?.content || '{"questions":[]}'
    const parsed = JSON.parse(raw)
    const questions = (parsed.questions || []).map((q: any) => ({
      ...removeTranscriptMentions(q),
      lesson_id: lesson?.id || lesson_id || null,
      course_id: lesson?.course_id || null,
      professor: lesson?.instructor || null,
      source_transcript: sourceText,
      ai_generated: true,
      status: 'review'
    }))
    return c.json({ questions })
  } catch (error: any) {
    console.error('Generate questions error:', error)
    return c.json({ error: error.message || 'Erro ao gerar questoes' }, 500)
  }
})

// Run migration: add lesson extra fields (one-time endpoint)
app.post('/api/admin/run-migration-lesson-fields', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    await db.sql(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS support_text TEXT`)
    await db.sql(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS transcript TEXT`)
    await db.sql(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb`)
    await ensureLessonRentalSchema(db)
    return c.json({ success: true, message: 'Migration applied successfully' })
  } catch (error: any) {
    console.error('Migration error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// ============================================
// API ROUTES - AI ADMIN AGENT
// ============================================

const AGENT_WRITE_TOOLS = new Set([
  'update_user', 'update_member_subscription', 'create_member_subscription',
  'expire_subscription', 'update_lesson', 'update_course', 'update_certificate',
  'reply_comment', 'delete_comment', 'generate_certificate', 'add_credits', 'bulk_extend_subscriptions',
])

const AGENT_TOOLS = [
  { type: 'function', function: {
    name: 'search_users',
    description: 'Busca usuários por email ou nome parcial. Retorna lista com dados básicos e status de assinatura.',
    parameters: { type: 'object', properties: {
      query: { type: 'string', description: 'Email ou nome para buscar (parcial)' },
      limit: { type: 'number', description: 'Máximo de resultados (padrão 10)' },
    }, required: ['query'] },
  }},
  { type: 'function', function: {
    name: 'get_user_details',
    description: 'Retorna dados completos de um usuário: perfil, assinaturas (member_subscriptions) e certificados.',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email exato do usuário' },
    }, required: ['email'] },
  }},
  { type: 'function', function: {
    name: 'list_courses',
    description: 'Lista todos os cursos com id, título, instrutor e carga horária.',
    parameters: { type: 'object', properties: {} },
  }},
  { type: 'function', function: {
    name: 'get_course_details',
    description: 'Retorna detalhes de um curso: módulos, contagem de aulas, configurações.',
    parameters: { type: 'object', properties: {
      course_id: { type: 'number', description: 'ID do curso' },
    }, required: ['course_id'] },
  }},
  { type: 'function', function: {
    name: 'search_subscriptions',
    description: 'Busca assinaturas por email do usuário (tabela member_subscriptions).',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do usuário' },
    }, required: ['email'] },
  }},
  { type: 'function', function: {
    name: 'list_certificates',
    description: 'Lista certificados. Se email fornecido, filtra por usuário.',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do usuário (opcional)' },
      limit: { type: 'number', description: 'Máximo de resultados (padrão 20)' },
    } },
  }},
  { type: 'function', function: {
    name: 'get_lesson',
    description: 'Retorna dados de uma aula pelo ID (título, video, duração, configurações de acesso).',
    parameters: { type: 'object', properties: {
      lesson_id: { type: 'number', description: 'ID da aula' },
    }, required: ['lesson_id'] },
  }},
  { type: 'function', function: {
    name: 'list_comments',
    description: 'Lista comentários recentes, opcionalmente filtrado por aula.',
    parameters: { type: 'object', properties: {
      lesson_id: { type: 'number', description: 'ID da aula (opcional)' },
      limit: { type: 'number', description: 'Máximo de resultados (padrão 20)' },
    } },
  }},
  { type: 'function', function: {
    name: 'dashboard_stats',
    description: 'Retorna estatísticas gerais do sistema: total de usuários, assinaturas ativas, certificados emitidos, comentários sem resposta, total de cursos e aulas.',
    parameters: { type: 'object', properties: {} },
  }},
  { type: 'function', function: {
    name: 'get_user_progress',
    description: 'Retorna o progresso de um usuário em todos os cursos: % concluído, aulas completadas e aulas totais por curso.',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do usuário' },
    }, required: ['email'] },
  }},
  { type: 'function', function: {
    name: 'list_recent_signups',
    description: 'Lista usuários cadastrados recentemente.',
    parameters: { type: 'object', properties: {
      days: { type: 'number', description: 'Últimos X dias (padrão 7)' },
      limit: { type: 'number', description: 'Máximo de resultados (padrão 20)' },
    } },
  }},
  { type: 'function', function: {
    name: 'search_lessons',
    description: 'Busca aulas por título ou palavra-chave, opcionalmente filtrado por curso.',
    parameters: { type: 'object', properties: {
      query: { type: 'string', description: 'Termo de busca no título da aula' },
      course_id: { type: 'number', description: 'Filtrar por curso (opcional)' },
      limit: { type: 'number', description: 'Máximo de resultados (padrão 20)' },
    }, required: ['query'] },
  }},
  { type: 'function', function: {
    name: 'search_suiteplus_subscriptions',
    description: 'Busca assinaturas no banco SuitePlus (sistema externo de pagamentos). Se email fornecido, filtra por usuário; caso contrário lista as mais recentes.',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do usuário (opcional)' },
      status: { type: 'string', description: 'Filtrar por status: active, expired, cancelled (opcional)' },
      limit: { type: 'number', description: 'Máximo de resultados (padrão 20)' },
    } },
  }},
  { type: 'function', function: {
    name: 'reply_comment',
    description: 'Responde a um comentário de aluno.',
    parameters: { type: 'object', properties: {
      comment_id: { type: 'number', description: 'ID do comentário' },
      reply: { type: 'string', description: 'Texto da resposta' },
    }, required: ['comment_id', 'reply'] },
  }},
  { type: 'function', function: {
    name: 'delete_comment',
    description: 'Remove um comentário.',
    parameters: { type: 'object', properties: {
      comment_id: { type: 'number', description: 'ID do comentário a remover' },
    }, required: ['comment_id'] },
  }},
  { type: 'function', function: {
    name: 'generate_certificate',
    description: 'Emite um certificado manualmente para um usuário em um curso.',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do usuário' },
      user_name: { type: 'string', description: 'Nome completo do usuário no certificado' },
      course_title: { type: 'string', description: 'Título do curso' },
      carga_horaria: { type: 'number', description: 'Carga horária em horas' },
      completion_date: { type: 'string', description: 'Data de conclusão ISO 8601 (padrão: hoje)' },
    }, required: ['email', 'user_name', 'course_title', 'carga_horaria'] },
  }},
  { type: 'function', function: {
    name: 'add_credits',
    description: 'Adiciona créditos de aluguel ao saldo de um usuário.',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do usuário' },
      amount: { type: 'number', description: 'Quantidade de créditos a adicionar' },
    }, required: ['email', 'amount'] },
  }},
  { type: 'function', function: {
    name: 'bulk_extend_subscriptions',
    description: 'Estende a data de expiração de assinaturas de múltiplos usuários de uma só vez.',
    parameters: { type: 'object', properties: {
      emails: { type: 'array', items: { type: 'string' }, description: 'Lista de emails dos usuários' },
      days: { type: 'number', description: 'Número de dias para estender' },
    }, required: ['emails', 'days'] },
  }},
  { type: 'function', function: {
    name: 'list_expiring_subscriptions',
    description: 'Lista assinaturas da tabela member_subscriptions que expiram nos próximos N dias (ou que já expiraram nos últimos N dias se days_ago for passado). Use esta ferramenta para perguntas como "quem expira essa semana", "assinaturas vencendo hoje", etc.',
    parameters: { type: 'object', properties: {
      days_ahead: { type: 'number', description: 'Buscar assinaturas expirando nos próximos X dias (ex: 7 para esta semana, 30 para este mês). Padrão: 7.' },
      include_expired_days: { type: 'number', description: 'Também incluir assinaturas que expiraram nos últimos X dias. Padrão: 0 (não incluir).' },
      only_active: { type: 'boolean', description: 'Se true, filtra apenas onde ativo=true. Padrão: true.' },
    } },
  }},
  { type: 'function', function: {
    name: 'update_user',
    description: 'Atualiza campos de um usuário na tabela users (nome, telefone, ativo, dt_expiracao).',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do usuário' },
      fields: { type: 'object', description: 'Campos a atualizar (nome, telefone, ativo, dt_expiracao)' },
    }, required: ['email', 'fields'] },
  }},
  { type: 'function', function: {
    name: 'update_member_subscription',
    description: 'Atualiza assinatura de membro (data_expiracao, ativo, detalhe).',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do membro' },
      fields: { type: 'object', description: 'Campos a atualizar (data_expiracao, ativo, detalhe)' },
    }, required: ['email', 'fields'] },
  }},
  { type: 'function', function: {
    name: 'create_member_subscription',
    description: 'Cria nova assinatura para um membro.',
    parameters: { type: 'object', properties: {
      email_membro: { type: 'string', description: 'Email do membro' },
      data_expiracao: { type: 'string', description: 'Data de expiração ISO 8601 (ex: 2026-12-31)' },
      detalhe: { type: 'string', description: 'Descrição do plano (ex: Plano Anual)' },
      ativo: { type: 'boolean', description: 'Ativo (padrão true)' },
    }, required: ['email_membro', 'data_expiracao'] },
  }},
  { type: 'function', function: {
    name: 'expire_subscription',
    description: 'Expira imediatamente a assinatura de um usuário (define data_expiracao para agora e ativo=false).',
    parameters: { type: 'object', properties: {
      email: { type: 'string', description: 'Email do usuário' },
    }, required: ['email'] },
  }},
  { type: 'function', function: {
    name: 'update_lesson',
    description: 'Atualiza dados de uma aula (title, description, teste_gratis, rentable, duration_minutes).',
    parameters: { type: 'object', properties: {
      lesson_id: { type: 'number', description: 'ID da aula' },
      fields: { type: 'object', description: 'Campos: title, description, teste_gratis, rentable, duration_minutes' },
    }, required: ['lesson_id', 'fields'] },
  }},
  { type: 'function', function: {
    name: 'update_course',
    description: 'Atualiza dados de um curso (title, description, instructor, duration_hours).',
    parameters: { type: 'object', properties: {
      course_id: { type: 'number', description: 'ID do curso' },
      fields: { type: 'object', description: 'Campos: title, description, instructor, duration_hours' },
    }, required: ['course_id', 'fields'] },
  }},
  { type: 'function', function: {
    name: 'update_certificate',
    description: 'Atualiza dados de um certificado (user_name, course_title, carga_horaria, generated_at).',
    parameters: { type: 'object', properties: {
      certificate_id: { type: 'number', description: 'ID do certificado' },
      fields: { type: 'object', description: 'Campos: user_name, course_title, carga_horaria, generated_at' },
    }, required: ['certificate_id', 'fields'] },
  }},
]

function buildWriteDescription(tool: string, args: any): string {
  switch (tool) {
    case 'update_user':
      return `Atualizar usuário **${args.email}** com os campos:\n${JSON.stringify(args.fields, null, 2)}`
    case 'update_member_subscription':
      return `Atualizar assinatura de **${args.email}** com:\n${JSON.stringify(args.fields, null, 2)}`
    case 'create_member_subscription':
      return `Criar assinatura para **${args.email_membro}** com expiração em **${args.data_expiracao}** (${args.detalhe || 'sem detalhe'})`
    case 'expire_subscription':
      return `Expirar imediatamente a assinatura de **${args.email}** (ativo = false, data_expiracao = agora)`
    case 'update_lesson':
      return `Atualizar aula ID **${args.lesson_id}** com:\n${JSON.stringify(args.fields, null, 2)}`
    case 'update_course':
      return `Atualizar curso ID **${args.course_id}** com:\n${JSON.stringify(args.fields, null, 2)}`
    case 'update_certificate':
      return `Atualizar certificado ID **${args.certificate_id}** com:\n${JSON.stringify(args.fields, null, 2)}`
    case 'reply_comment':
      return `Responder ao comentário ID **${args.comment_id}** com:\n"${args.reply}"`
    case 'delete_comment':
      return `Excluir permanentemente o comentário ID **${args.comment_id}**`
    case 'generate_certificate':
      return `Emitir certificado para **${args.user_name}** (${args.email})\nCurso: **${args.course_title}** — ${args.carga_horaria}h\nData de conclusão: ${args.completion_date || 'hoje'}`
    case 'add_credits':
      return `Adicionar **${args.amount} créditos** ao saldo de **${args.email}**`
    case 'bulk_extend_subscriptions':
      return `Estender assinaturas de **${(args.emails || []).length} usuários** por **${args.days} dias**:\n${(args.emails || []).join('\n')}`
    default:
      return `Executar ação **${tool}** com args: ${JSON.stringify(args)}`
  }
}

async function executeAgentReadTool(tool: string, args: any, db: any, c: any): Promise<any> {
  switch (tool) {
    case 'search_users': {
      const q = `%${args.query}%`
      const lim = Math.min(args.limit || 10, 50)
      const rows = await db.sql(
        `SELECT u.id, u.email, u.nome, u.ativo, u.dt_expiracao,
                ms.data_expiracao as sub_expiracao, ms.ativo as sub_ativo, ms.detalhe as sub_detalhe
         FROM users u
         LEFT JOIN member_subscriptions ms ON lower(ms.email_membro) = lower(u.email)
         WHERE u.email ILIKE $1 OR u.nome ILIKE $1
         ORDER BY u.created_at DESC LIMIT $2`,
        [q, lim]
      )
      return { users: rows, total: rows.length }
    }
    case 'get_user_details': {
      const [user, subs, certs] = await Promise.all([
        db.sql(`SELECT * FROM users WHERE lower(email) = lower($1) LIMIT 1`, [args.email]),
        db.sql(`SELECT * FROM member_subscriptions WHERE lower(email_membro) = lower($1) ORDER BY data_expiracao DESC`, [args.email]),
        db.sql(`SELECT * FROM certificates WHERE lower(user_email) = lower($1) ORDER BY created_at DESC`, [args.email]),
      ])
      return { user: user[0] || null, subscriptions: subs, certificates: certs }
    }
    case 'list_courses': {
      const rows = await db.sql(`SELECT id, title, instructor, duration_hours, created_at FROM courses ORDER BY title`)
      return { courses: rows }
    }
    case 'get_course_details': {
      const [course, modules] = await Promise.all([
        db.sql(`SELECT * FROM courses WHERE id = $1`, [args.course_id]),
        db.sql(
          `SELECT m.id, m.title, m.order_index, COUNT(l.id)::int as lesson_count
           FROM modules m LEFT JOIN lessons l ON l.module_id = m.id
           WHERE m.course_id = $1 GROUP BY m.id ORDER BY m.order_index`,
          [args.course_id]
        ),
      ])
      return { course: course[0] || null, modules }
    }
    case 'search_subscriptions': {
      const rows = await db.sql(
        `SELECT * FROM member_subscriptions WHERE lower(email_membro) = lower($1) ORDER BY data_expiracao DESC`,
        [args.email]
      )
      return { subscriptions: rows }
    }
    case 'list_certificates': {
      const lim = Math.min(args.limit || 20, 100)
      const rows = args.email
        ? await db.sql(`SELECT * FROM certificates WHERE lower(user_email) = lower($1) ORDER BY created_at DESC LIMIT $2`, [args.email, lim])
        : await db.sql(`SELECT * FROM certificates ORDER BY created_at DESC LIMIT $1`, [lim])
      return { certificates: rows }
    }
    case 'get_lesson': {
      const rows = await db.sql(
        `SELECT l.*, m.title as module_title, c.title as course_title
         FROM lessons l LEFT JOIN modules m ON m.id = l.module_id LEFT JOIN courses c ON c.id = m.course_id
         WHERE l.id = $1`,
        [args.lesson_id]
      )
      return { lesson: rows[0] || null }
    }
    case 'list_comments': {
      const lim = Math.min(args.limit || 20, 100)
      const rows = args.lesson_id
        ? await db.sql(`SELECT * FROM comments WHERE lesson_id = $1 ORDER BY created_at DESC LIMIT $2`, [args.lesson_id, lim])
        : await db.sql(`SELECT * FROM comments ORDER BY created_at DESC LIMIT $1`, [lim])
      return { comments: rows }
    }
    case 'dashboard_stats': {
      const [users, activeSubs, totalCerts, pendingComments, courses, lessons, suiteplusActive] = await Promise.all([
        db.sql(`SELECT COUNT(*)::int as total FROM users`),
        db.sql(`SELECT COUNT(*)::int as total FROM member_subscriptions WHERE data_expiracao > NOW() AND ativo = true`),
        db.sql(`SELECT COUNT(*)::int as total FROM certificates`),
        db.sql(`SELECT COUNT(*)::int as total FROM comments WHERE admin_reply IS NULL`),
        db.sql(`SELECT COUNT(*)::int as total FROM courses`),
        db.sql(`SELECT COUNT(*)::int as total FROM lessons`),
        (() => {
          const spConn = (c.env as any).DATABASE_SUITEPLUS
          if (!spConn) return Promise.resolve([{ total: null }])
          const spDb = new PostgresClient(spConn)
          return spDb.sql(`SELECT COUNT(*)::int as total FROM user_subscriptions WHERE status = 'active' AND product_id = 4 AND expires_at > NOW()`).catch(() => [{ total: null }])
        })(),
      ])
      return {
        total_users: users[0]?.total,
        active_subscriptions_cct: activeSubs[0]?.total,
        active_subscriptions_suiteplus: suiteplusActive[0]?.total,
        total_certificates: totalCerts[0]?.total,
        pending_comments: pendingComments[0]?.total,
        total_courses: courses[0]?.total,
        total_lessons: lessons[0]?.total,
      }
    }
    case 'get_user_progress': {
      const rows = await db.sql(
        `SELECT c.id as course_id, c.title as course_title,
                COUNT(l.id)::int as total_lessons,
                COUNT(up.lesson_id) FILTER (WHERE up.completed = true)::int as completed_lessons
         FROM courses c
         JOIN modules m ON m.course_id = c.id
         JOIN lessons l ON l.module_id = m.id
         LEFT JOIN user_progress up ON up.lesson_id = l.id AND lower(up.user_email) = lower($1)
         GROUP BY c.id, c.title
         HAVING COUNT(up.lesson_id) FILTER (WHERE up.completed = true) > 0
         ORDER BY completed_lessons DESC`,
        [args.email]
      )
      const withPct = rows.map((r: any) => ({
        ...r,
        progress_pct: r.total_lessons > 0 ? Math.round((r.completed_lessons / r.total_lessons) * 100) : 0,
      }))
      return { email: args.email, courses_with_progress: withPct, total_courses: withPct.length }
    }
    case 'list_recent_signups': {
      const days = Math.min(args.days || 7, 365)
      const lim = Math.min(args.limit || 20, 100)
      const rows = await db.sql(
        `SELECT email, nome, created_at FROM users
         WHERE created_at > NOW() - INTERVAL '${days} days'
         ORDER BY created_at DESC LIMIT $1`,
        [lim]
      )
      return { signups: rows, count: rows.length, days }
    }
    case 'search_lessons': {
      const lim = Math.min(args.limit || 20, 50)
      const q = `%${args.query}%`
      const rows = args.course_id
        ? await db.sql(
            `SELECT l.id, l.title, l.duration_minutes, l.teste_gratis, l.rentable, l.order_index,
                    m.title as module_title, c.title as course_title, c.id as course_id
             FROM lessons l JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id
             WHERE l.title ILIKE $1 AND c.id = $2
             ORDER BY c.title, m.order_index, l.order_index LIMIT $3`,
            [q, args.course_id, lim]
          )
        : await db.sql(
            `SELECT l.id, l.title, l.duration_minutes, l.teste_gratis, l.rentable, l.order_index,
                    m.title as module_title, c.title as course_title, c.id as course_id
             FROM lessons l JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id
             WHERE l.title ILIKE $1
             ORDER BY c.title, m.order_index, l.order_index LIMIT $2`,
            [q, lim]
          )
      return { lessons: rows, count: rows.length }
    }
    case 'search_suiteplus_subscriptions': {
      const spConn = (c.env as any).DATABASE_SUITEPLUS
      if (!spConn) return { error: 'DATABASE_SUITEPLUS não configurada' }
      const spDb = new PostgresClient(spConn)
      const lim = Math.min(args.limit || 20, 100)
      let rows: any[]
      if (args.email) {
        rows = await spDb.sql(
          `SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
           FROM user_subscriptions WHERE lower(user_email) = lower($1) ORDER BY expires_at DESC LIMIT $2`,
          [args.email, lim]
        )
      } else if (args.status) {
        rows = await spDb.sql(
          `SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
           FROM user_subscriptions WHERE status = $1 AND product_id = 4 ORDER BY expires_at DESC LIMIT $2`,
          [args.status, lim]
        )
      } else {
        rows = await spDb.sql(
          `SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
           FROM user_subscriptions WHERE product_id = 4 ORDER BY expires_at DESC LIMIT $1`,
          [lim]
        )
      }
      return { subscriptions: rows, count: rows.length, source: 'SuitePlus' }
    }
    case 'list_expiring_subscriptions': {
      const daysAhead = Math.min(Math.max(args.days_ahead ?? 7, 0), 365)
      const daysAgo = Math.min(Math.max(args.include_expired_days ?? 0, 0), 365)
      const onlyActive = args.only_active !== false
      const activeClause = onlyActive ? 'AND ativo = true' : ''
      const rows = await db.sql(
        `SELECT ms.email_membro, ms.data_expiracao, ms.ativo, ms.detalhe, ms.origem,
                u.nome
         FROM member_subscriptions ms
         LEFT JOIN users u ON lower(u.email) = lower(ms.email_membro)
         WHERE ms.data_expiracao BETWEEN (NOW() - INTERVAL '${daysAgo} days') AND (NOW() + INTERVAL '${daysAhead} days')
         ${activeClause.replace('ativo', 'ms.ativo')}
         ORDER BY ms.data_expiracao ASC`,
        []
      )
      return { subscriptions: rows, count: rows.length, query: { days_ahead: daysAhead, include_expired_days: daysAgo } }
    }
    default:
      return { error: `Ferramenta desconhecida: ${tool}` }
  }
}

async function executeAgentWriteTool(tool: string, args: any, db: any, c: any): Promise<any> {
  const ALLOWED_USER_FIELDS = new Set(['nome', 'telefone', 'whatsapp', 'ativo', 'dt_expiracao'])
  const ALLOWED_SUB_FIELDS = new Set(['data_expiracao', 'ativo', 'detalhe', 'origem'])
  const ALLOWED_LESSON_FIELDS = new Set(['title', 'description', 'teste_gratis', 'rentable', 'duration_minutes', 'order_index'])
  const ALLOWED_COURSE_FIELDS = new Set(['title', 'description', 'instructor', 'duration_hours'])
  const ALLOWED_CERT_FIELDS = new Set(['user_name', 'course_title', 'carga_horaria', 'generated_at'])

  switch (tool) {
    case 'update_user': {
      const safe: any = {}
      for (const [k, v] of Object.entries(args.fields || {})) if (ALLOWED_USER_FIELDS.has(k)) safe[k] = v
      if (Object.keys(safe).length === 0) return { error: 'Nenhum campo válido para atualizar' }
      const cols = Object.keys(safe).map((k, i) => `"${k}" = $${i + 2}`).join(', ')
      const vals = [args.email, ...Object.values(safe)]
      const rows = await db.sql(`UPDATE users SET ${cols} WHERE lower(email) = lower($1) RETURNING *`, vals)
      return { updated: rows.length, user: rows[0] || null }
    }
    case 'update_member_subscription': {
      const safe: any = {}
      for (const [k, v] of Object.entries(args.fields || {})) if (ALLOWED_SUB_FIELDS.has(k)) safe[k] = v
      if (Object.keys(safe).length === 0) return { error: 'Nenhum campo válido para atualizar' }
      const cols = Object.keys(safe).map((k, i) => `"${k}" = $${i + 2}`).join(', ')
      const vals = [args.email, ...Object.values(safe)]
      const rows = await db.sql(
        `UPDATE member_subscriptions SET ${cols}, updated_at = NOW() WHERE lower(email_membro) = lower($1) RETURNING *`,
        vals
      )
      return { updated: rows.length, subscription: rows[0] || null }
    }
    case 'create_member_subscription': {
      const rows = await db.sql(
        `INSERT INTO member_subscriptions (email_membro, data_expiracao, detalhe, ativo, origem, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'agente_ia', NOW(), NOW()) RETURNING *`,
        [args.email_membro, args.data_expiracao, args.detalhe || null, args.ativo !== false]
      )
      return { created: true, subscription: rows[0] }
    }
    case 'expire_subscription': {
      const rows = await db.sql(
        `UPDATE member_subscriptions SET data_expiracao = NOW(), ativo = false, updated_at = NOW()
         WHERE lower(email_membro) = lower($1) RETURNING *`,
        [args.email]
      )
      return { updated: rows.length, expired: true }
    }
    case 'update_lesson': {
      const safe: any = {}
      for (const [k, v] of Object.entries(args.fields || {})) if (ALLOWED_LESSON_FIELDS.has(k)) safe[k] = v
      if (Object.keys(safe).length === 0) return { error: 'Nenhum campo válido para atualizar' }
      const cols = Object.keys(safe).map((k, i) => `"${k}" = $${i + 2}`).join(', ')
      const vals = [args.lesson_id, ...Object.values(safe)]
      const rows = await db.sql(`UPDATE lessons SET ${cols} WHERE id = $1 RETURNING id, title`, vals)
      return { updated: rows.length, lesson: rows[0] || null }
    }
    case 'update_course': {
      const safe: any = {}
      for (const [k, v] of Object.entries(args.fields || {})) if (ALLOWED_COURSE_FIELDS.has(k)) safe[k] = v
      if (Object.keys(safe).length === 0) return { error: 'Nenhum campo válido para atualizar' }
      const cols = Object.keys(safe).map((k, i) => `"${k}" = $${i + 2}`).join(', ')
      const vals = [args.course_id, ...Object.values(safe)]
      const rows = await db.sql(`UPDATE courses SET ${cols}, updated_at = NOW() WHERE id = $1 RETURNING id, title`, vals)
      return { updated: rows.length, course: rows[0] || null }
    }
    case 'update_certificate': {
      const safe: any = {}
      for (const [k, v] of Object.entries(args.fields || {})) if (ALLOWED_CERT_FIELDS.has(k)) safe[k] = v
      if (Object.keys(safe).length === 0) return { error: 'Nenhum campo válido para atualizar' }
      const cols = Object.keys(safe).map((k, i) => `"${k}" = $${i + 2}`).join(', ')
      const vals = [args.certificate_id, ...Object.values(safe)]
      const rows = await db.sql(`UPDATE certificates SET ${cols}, updated_at = NOW() WHERE id = $1 RETURNING *`, vals)
      return { updated: rows.length, certificate: rows[0] || null }
    }
    case 'reply_comment': {
      const adminUser = c.get('user')
      const rows = await db.sql(
        `UPDATE comments SET admin_reply = $1, admin_replied_at = NOW(), admin_replied_by = $2 WHERE id = $3 RETURNING id, user_name, comment_text, admin_reply`,
        [args.reply, adminUser?.email || 'admin', args.comment_id]
      )
      if (rows.length === 0) return { error: `Comentário ID ${args.comment_id} não encontrado` }
      return { replied: true, comment: rows[0] }
    }
    case 'delete_comment': {
      const rows = await db.sql(`DELETE FROM comments WHERE id = $1 RETURNING id, user_name, comment_text`, [args.comment_id])
      if (rows.length === 0) return { error: `Comentário ID ${args.comment_id} não encontrado` }
      return { deleted: true, comment: rows[0] }
    }
    case 'generate_certificate': {
      const codeBytes = new Uint8Array(4)
      crypto.getRandomValues(codeBytes)
      const code = 'CCT-' + new Date().getFullYear() + '-' +
        Array.from(codeBytes).map((b: number) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
      const now = new Date().toISOString()
      const completionDate = args.completion_date || now.split('T')[0]
      const rows = await db.sql(
        `INSERT INTO certificates (user_email, user_name, course_title, carga_horaria, certificate_code, verification_code, issued_at, completion_date, created_at)
         VALUES ($1, $2, $3, $4, $5, $5, $6, $7::date, $6)
         RETURNING id, certificate_code`,
        [args.email, args.user_name, args.course_title, args.carga_horaria, code, now, completionDate]
      )
      return { created: true, certificate_id: rows[0]?.id, certificate_code: rows[0]?.certificate_code }
    }
    case 'add_credits': {
      const credDb = getCreditsDB(c)
      await ensureCreditsSchema(credDb)
      const rows = await credDb.sql(
        `INSERT INTO users_credits (user_email, credits_balance, total_credits_used, updated_at)
         VALUES (lower($1), $2, 0, NOW())
         ON CONFLICT (user_email) DO UPDATE
           SET credits_balance = users_credits.credits_balance + $2, updated_at = NOW()
         RETURNING user_email, credits_balance`,
        [args.email, args.amount]
      )
      return { added: args.amount, new_balance: rows[0]?.credits_balance, email: args.email }
    }
    case 'bulk_extend_subscriptions': {
      const emails = (args.emails || []).map((e: string) => e.toLowerCase())
      if (emails.length === 0) return { error: 'Nenhum email fornecido' }
      const days = Math.min(Math.max(args.days || 0, 1), 3650)
      const rows = await db.sql(
        `UPDATE member_subscriptions
         SET data_expiracao = data_expiracao + ($1 || ' days')::INTERVAL, updated_at = NOW()
         WHERE lower(email_membro) = ANY($2)
         RETURNING email_membro, data_expiracao`,
        [String(days), emails]
      )
      return { updated: rows.length, days_added: days, subscriptions: rows }
    }
    default:
      return { error: `Ferramenta de escrita desconhecida: ${tool}` }
  }
}

app.post('/api/admin/agent', requireAdmin, async (c) => {
  try {
    const body = await c.req.json()
    const { message, history = [], pendingAction } = body
    const db = getDB(c)
    const apiKey = (c.env as any).VITE_OPENROUTER_API_KEY
    if (!apiKey) return c.json({ error: 'VITE_OPENROUTER_API_KEY não configurada' }, 500)

    // Admin confirmed a pending write action → execute it
    if (pendingAction) {
      const result = await executeAgentWriteTool(pendingAction.tool, pendingAction.args, db, c)
      if (result.error) return c.json({ reply: `❌ Erro ao executar: ${result.error}` })
      return c.json({ reply: `✅ Feito! Resultado:\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`` })
    }

    const nowBR = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'full', timeStyle: 'short' })
    const systemPrompt = `Você é um assistente administrativo do CCT (Clube de Cálculo Trabalhista).
Responda sempre em português brasileiro, de forma clara e objetiva.
Use as ferramentas disponíveis para consultar dados antes de responder. Nunca invente dados — sempre busque via ferramenta.

FORMATAÇÃO DE DATAS: Converta SEMPRE datas ISO (ex: 2026-05-02T13:59:26.255Z) para o formato brasileiro DD/MM/AAAA. Nunca exiba timestamps ISO crus para o admin.
FORMATAÇÃO GERAL: Omita campos técnicos internos (IDs de sistema, updated_at, created_at) a menos que sejam relevantes para a pergunta. Apresente os dados de forma limpa e legível.
STATUS DE ASSINATURA: Quando exibir data de expiração, indique também se está ativa ou expirada comparando com a data atual. Exemplo: "02/05/2026 ⚠️ expirada há 44 dias".

Para perguntas sobre assinaturas expirando (esta semana, este mês, hoje, etc.): use list_expiring_subscriptions com days_ahead apropriado.
Quando mostrar detalhes completos de um usuário: consulte também search_suiteplus_subscriptions para comparar com o banco SuitePlus e indique se há divergência entre os sistemas.
Para ações de modificação (update/create/expire): use a ferramenta correspondente — o sistema pedirá confirmação antes de executar.
Data/hora atual no Brasil: ${nowBR}`

    let messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-20),
      { role: 'user', content: message },
    ]

    for (let i = 0; i < 6; i++) {
      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://novocct.ensinoplus.com.br',
          'X-Title': 'CCT Admin Agent',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages,
          tools: AGENT_TOOLS,
          tool_choice: 'auto',
        }),
      })
      if (!aiRes.ok) return c.json({ error: `OpenRouter: ${await aiRes.text()}` }, 500)
      const data: any = await aiRes.json()
      const choice = data.choices?.[0]
      if (!choice) return c.json({ error: 'Resposta vazia do modelo' }, 500)

      const assistantMsg = choice.message
      const toolCalls = assistantMsg.tool_calls

      // No tool calls → final text response
      if (!toolCalls || toolCalls.length === 0) {
        return c.json({ reply: assistantMsg.content || '' })
      }

      // Process first tool call
      const tc = toolCalls[0]
      const toolName = tc.function.name
      let toolArgs: any = {}
      try { toolArgs = JSON.parse(tc.function.arguments) } catch {}

      // Write tool → return confirmation request (do NOT execute yet)
      if (AGENT_WRITE_TOOLS.has(toolName)) {
        const description = buildWriteDescription(toolName, toolArgs)
        return c.json({
          reply: `⚠️ **Confirmação necessária**\n\n${description}`,
          pendingAction: { tool: toolName, args: toolArgs, description },
        })
      }

      // Read tool → execute, feed result back, continue loop
      const toolResult = await executeAgentReadTool(toolName, toolArgs, db, c)
      messages.push({ role: 'assistant', content: assistantMsg.content || null, tool_calls: toolCalls })
      messages.push({ role: 'tool', content: JSON.stringify(toolResult), tool_call_id: tc.id })
    }

    return c.json({ reply: 'Não consegui completar a consulta. Tente reformular sua pergunta.' })
  } catch (error: any) {
    console.error('Agent error:', error)
    return c.json({ error: error.message || 'Erro no agente' }, 500)
  }
})

// ============================================
// API ROUTES - USERS MANAGEMENT
// ============================================

// Get all users (admin only)
app.get('/api/admin/users', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    const users = await db.sql(`
      SELECT *
      FROM (
        SELECT
          id,
          email,
          nome,
          first_name,
          last_name,
          cpf,
          telefone,
          whatsapp,
          foto,
          end_cep,
          end_logradouro,
          end_numero,
          end_cidade,
          end_estado,
          ativo,
          teste_gratis,
          dt_expiracao,
          created_at,
          updated_at,
          'users'::text AS source,
          false AS is_virtual
        FROM users

        UNION ALL

        SELECT
          NULL::integer AS id,
          ms.email_membro AS email,
          NULL::varchar(255) AS nome,
          NULL::varchar(100) AS first_name,
          NULL::varchar(100) AS last_name,
          NULL::varchar(14) AS cpf,
          NULL::varchar(20) AS telefone,
          NULL::varchar(20) AS whatsapp,
          NULL::text AS foto,
          NULL::varchar(10) AS end_cep,
          NULL::varchar(255) AS end_logradouro,
          NULL::varchar(20) AS end_numero,
          NULL::varchar(100) AS end_cidade,
          NULL::varchar(2) AS end_estado,
          COALESCE(bool_or(ms.ativo), true) AS ativo,
          bool_or(COALESCE(ms.teste_gratis, false)) AS teste_gratis,
          MAX(ms.data_expiracao) AS dt_expiracao,
          MIN(ms.created_at) AS created_at,
          MAX(ms.updated_at) AS updated_at,
          'member_subscriptions'::text AS source,
          true AS is_virtual
        FROM member_subscriptions ms
        LEFT JOIN users u ON lower(u.email) = lower(ms.email_membro)
        WHERE u.id IS NULL
          AND ms.email_membro IS NOT NULL
          AND btrim(ms.email_membro) <> ''
        GROUP BY lower(ms.email_membro), ms.email_membro
      ) all_users
      ORDER BY created_at DESC NULLS LAST, email ASC
    `)
    return c.json({ users })
  } catch (error: any) {
    console.error('Get users error:', error)
    return c.json({ error: error.message || 'Failed to fetch users' }, 500)
  }
})

// Find user by email (for duplicate checking)
app.get('/api/admin/users/find', requireAdmin, async (c) => {
  try {
    const email = c.req.query('email')
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    const db = getDB(c)
    const users = await db.query('users', {
      select: '*',
      filters: { email: email },
      limit: 1
    })
    
    if (users && users.length > 0) {
      return c.json({ user: users[0] })
    }
    
    return c.json({ user: null })
  } catch (error: any) {
    console.error('Find user error:', error)
    return c.json({ error: error.message || 'Failed to find user' }, 500)
  }
})

// Create user (admin only)
app.post('/api/admin/users', requireAdmin, async (c) => {
  try {
    const userData = await c.req.json()
    
    if (!userData.email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    const db = getDB(c)
    const result = await db.insert('users', {
      email: userData.email,
      nome: userData.nome || null,
      first_name: userData.first_name || null,
      last_name: userData.last_name || null,
      cpf: userData.cpf || null,
      telefone: userData.telefone || null,
      whatsapp: userData.whatsapp || null,
      foto: userData.foto || null,
      end_cep: userData.end_cep || null,
      end_logradouro: userData.end_logradouro || null,
      end_numero: userData.end_numero || null,
      end_cidade: userData.end_cidade || null,
      end_estado: userData.end_estado || null,
      ativo: userData.ativo !== undefined ? userData.ativo : true,
      teste_gratis: userData.teste_gratis || false,
      dt_expiracao: userData.dt_expiracao || null
    })
    
    return c.json({ 
      success: true, 
      user_id: result[0].id
    })
  } catch (error: any) {
    console.error('Create user error:', error)
    return c.json({ error: error.message || 'Failed to create user' }, 500)
  }
})

// Update user (admin only)
app.put('/api/admin/users/:id', requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id')
    const userData = await c.req.json()
    
    const db = getDB(c)
    await db.update('users', { id: userId }, {
      nome: userData.nome,
      first_name: userData.first_name,
      last_name: userData.last_name,
      cpf: userData.cpf,
      telefone: userData.telefone,
      whatsapp: userData.whatsapp,
      foto: userData.foto,
      end_cep: userData.end_cep,
      end_logradouro: userData.end_logradouro,
      end_numero: userData.end_numero,
      end_cidade: userData.end_cidade,
      end_estado: userData.end_estado,
      ativo: userData.ativo,
      teste_gratis: userData.teste_gratis,
      dt_expiracao: userData.dt_expiracao,
      updated_at: new Date().toISOString()
    })
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Update user error:', error)
    return c.json({ error: error.message || 'Failed to update user' }, 500)
  }
})

// Delete user (admin only)
app.delete('/api/admin/users/:id', requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id')
    
    const db = getDB(c)
    await db.delete('users', { id: userId })
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return c.json({ error: error.message || 'Failed to delete user' }, 500)
  }
})

// ============================================================================
// CERTIFICATES MANAGEMENT - Admin Only
// ============================================================================

// List all certificates (admin only)
app.get('/api/admin/certificates', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    const certificates = await db.query('certificates', {
      select: '*',
      order: 'created_at DESC'
    })
    return c.json({ certificates: certificates || [] })
  } catch (error: any) {
    console.error('List certificates error:', error)
    return c.json({ error: error.message || 'Failed to list certificates' }, 500)
  }
})

// Get single certificate (admin only)
app.get('/api/admin/certificates/:id', requireAdmin, async (c) => {
  try {
    const certId = c.req.param('id')
    const db = getDB(c)
    const certificates = await db.query('certificates', {
      select: '*',
      filters: { id: certId }
    })
    if (!certificates || certificates.length === 0) {
      return c.json({ error: 'Certificate not found' }, 404)
    }
    return c.json({ certificate: certificates[0] })
  } catch (error: any) {
    console.error('Get certificate error:', error)
    return c.json({ error: error.message || 'Failed to get certificate' }, 500)
  }
})

// Find certificate by email (for duplicate checking)
app.get('/api/admin/certificates/find', requireAdmin, async (c) => {
  try {
    const email = c.req.query('email')
    const course = c.req.query('course')
    
    if (!email || !course) {
      return c.json({ error: 'Email and course parameters are required' }, 400)
    }
    
    const db = getDB(c)
    const certificates = await db.query('certificates', {
      select: '*',
      filters: { 
        user_email: email,
        course_title: course
      }
    })
    return c.json({ certificates: certificates || [] })
  } catch (error: any) {
    console.error('Find certificate error:', error)
    return c.json({ error: error.message || 'Failed to find certificate' }, 500)
  }
})

// Create certificate (admin only)
app.post('/api/admin/certificates', requireAdmin, async (c) => {
  try {
    const certData = await c.req.json()
    
    if (!certData.user_email || !certData.course_title) {
      return c.json({ error: 'Email and course title are required' }, 400)
    }
    
    const db = getDB(c)
    const now = new Date().toISOString()
    
    const result = await db.insert('certificates', {
      user_email: certData.user_email,
      user_name: certData.user_name || 'Aluno',
      course_id: certData.course_id || null,
      course_title: certData.course_title,
      issued_at: certData.issued_at || now,
      completion_date: certData.completion_date || now,
      carga_horaria: certData.carga_horaria || null,
      certificate_code: certData.certificate_code || null,
      generated_at: certData.generated_at || null
    })
    
    return c.json({ 
      success: true, 
      certificate_id: result && result.length > 0 ? result[0].id : null 
    })
  } catch (error: any) {
    console.error('Create certificate error:', error)
    return c.json({ error: error.message || 'Failed to create certificate' }, 500)
  }
})

// Webhook: receive certificate data from Bubble (public endpoint)
// Accepts a single JSON object or an array of objects:
// { user_email, user_name, course_title, carga_horaria, data_final }
app.post('/api_certificado', async (c) => {
  try {
    const body = await c.req.json()
    const items = Array.isArray(body) ? body : [body]
    const db = getDB(c)
    const results: any[] = []

    for (const item of items) {
      const cleanField = (v: any) => {
        const s = String(v ?? '').trim()
        return (!s || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') ? '' : s
      }
      const email = cleanField(item.user_email || item.email).toLowerCase()
      const name = cleanField(item.user_name || item.nome) || null
      const course = cleanField(item.course_title || item.curso)
      let hours = item.carga_horaria ? parseInt(String(item.carga_horaria)) : null
      if (hours !== null && !Number.isFinite(hours)) hours = null

      if (!email.includes('@') || !course) {
        results.push({ user_email: email, course_title: course, status: 'error', error: 'user_email e course_title são obrigatórios' })
        continue
      }

      // Sanitizar data: Bubble envia "null"/"" como texto quando o campo está vazio
      const parseDate = (v: any): string | null => {
        if (!v) return null
        const trimmed = String(v).trim()
        if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') return null
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
          // Converter data BR dd/mm/yyyy → ISO
          const [d, m, y] = trimmed.split('/')
          return `${y}-${m}-${d}T12:00:00Z`
        }
        if (!isNaN(new Date(trimmed).getTime())) return new Date(trimmed).toISOString()
        return null
      }
      const date = parseDate(item.data_final || item.completion_date)
      const startDate = parseDate(item.data_inicio || item.data_inicial || item.start_date)

      // Buscar carga horária do curso quando não informada
      if (!hours) {
        const courseRows = await db.sql(
          `SELECT duration_hours FROM courses WHERE lower(title) = lower($1) OR lower(title) ILIKE lower($2) LIMIT 1`,
          [course, `%${course}%`]
        )
        if (courseRows.length > 0 && courseRows[0].duration_hours) {
          hours = parseInt(courseRows[0].duration_hours)
        } else {
          // Match por palavras: ignora acentos, hífens e ordem
          // (ex: "Pjecalc Plus 2025 - Liquidação de sentença" ↔ "PJE-CALC PLUS - LIQUIDAÇÃO DE SENTENÇA 2025")
          const normalize = (s: string) => s.toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/).filter(w => w && w !== 'de' && w !== 'do' && w !== 'da')
          const wanted = normalize(course)
          if (wanted.length > 0) {
            const allCourses = await db.sql(`SELECT title, duration_hours FROM courses WHERE duration_hours > 0`)
            const match = allCourses.find((cr: any) => {
              const titleWords = normalize(cr.title).join(' ')
              return wanted.every(w => titleWords.includes(w))
            })
            if (match) hours = parseInt(match.duration_hours)
          }
        }
      }

      // Atualizar se já existir (email + curso), senão criar
      const existing = await db.sql(
        `SELECT id FROM certificates WHERE lower(user_email) = lower($1) AND lower(course_title) = lower($2) LIMIT 1`,
        [email, course]
      )

      if (existing.length > 0) {
        await db.sql(
          `UPDATE certificates
           SET user_name = COALESCE($1, user_name),
               carga_horaria = COALESCE($2, carga_horaria),
               completion_date = COALESCE($3, completion_date),
               start_date = COALESCE($4::date, start_date),
               updated_at = NOW()
           WHERE id = $5`,
          [name, hours, date, startDate, existing[0].id]
        )
        results.push({ user_email: email, course_title: course, status: 'updated', certificate_id: existing[0].id })
      } else {
        const codeBytes = new Uint8Array(4)
        crypto.getRandomValues(codeBytes)
        const code = 'CCT-' + new Date().getFullYear() + '-' +
          Array.from(codeBytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
        const now = new Date().toISOString()

        const inserted = await db.sql(
          `INSERT INTO certificates (user_email, user_name, course_title, carga_horaria, certificate_code, verification_code, issued_at, completion_date, start_date, created_at)
           VALUES ($1, $2, $3, $4, $5, $5, $6, COALESCE($7, $6::timestamp), $8::date, $6)
           RETURNING id`,
          [email, name || 'Aluno', course, hours, code, now, date, startDate]
        )
        results.push({ user_email: email, course_title: course, status: 'created', certificate_id: inserted[0]?.id, verification_code: code })
      }
    }

    const errors = results.filter(r => r.status === 'error').length
    return c.json({ success: errors === 0, total: items.length, results })
  } catch (error: any) {
    console.error('Webhook api_certificado error:', error)
    return c.json({ error: error.message || 'Falha ao processar certificado' }, 500)
  }
})

// Update certificate (admin only)
app.put('/api/admin/certificates/:id', requireAdmin, async (c) => {
  try {
    const certId = c.req.param('id')
    const certData = await c.req.json()
    
    const db = getDB(c)
    
    // Get course title if course_id is provided
    let courseTitle = certData.course_title
    if (certData.course_id) {
      const courses = await db.query('courses', {
        select: 'title',
        filters: { id: certData.course_id }
      })
      if (courses && courses.length > 0) {
        courseTitle = courses[0].title
      }
    }
    
    await db.update('certificates', { id: certId }, {
      user_email: certData.user_email,
      user_name: certData.user_name,
      course_id: certData.course_id,
      course_title: courseTitle,
      carga_horaria: certData.carga_horaria,
      updated_at: new Date().toISOString()
    })
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Update certificate error:', error)
    return c.json({ error: error.message || 'Failed to update certificate' }, 500)
  }
})

// Delete certificate (admin only)
app.delete('/api/admin/certificates/:id', requireAdmin, async (c) => {
  try {
    const certId = c.req.param('id')
    
    const db = getDB(c)
    await db.delete('certificates', { id: certId })
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Delete certificate error:', error)
    return c.json({ error: error.message || 'Failed to delete certificate' }, 500)
  }
})

// ============================================================================
// CERTIFICATE HTML TEMPLATE GENERATOR
// ============================================================================

function generateCertificateHTML(data: {
  studentName: string;
  courseName: string;
  workload: string | number;
  startDate?: string;
  completionDate?: string;
  issueDate: string;
  verificationCode: string;
  verificationUrl: string;
  qrCodeSVG?: string;
  modules?: string[];
  templateImageUrl?: string;
  versoImageUrl?: string;
}) {
  const hasTemplate = !!data.templateImageUrl
  const hasVerso    = !!data.versoImageUrl
  const hasModules  = data.modules && data.modules.length > 0

  // ── Frente com imagem de template ──────────────────────────────────────────
  if (hasTemplate) {
    const modulesBlock = hasModules
      ? data.modules!.map((m, i) =>
          `<div class="mod-item"><span class="mod-num">${String(i + 1).padStart(2, '0')}.</span> ${m}</div>`
        ).join('')
      : ''

    const versoPage = hasVerso ? `
    <div class="page verso-page">
      <img class="bg-img" src="${data.versoImageUrl}" alt="Verso do certificado">
      ${hasModules ? `
      <div class="verso-overlay">
        <div class="mod-grid">${modulesBlock}</div>
      </div>` : ''}
    </div>` : ''

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado - ${data.studentName}</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 297mm; background: #555; }

    .page {
      width: 297mm;
      height: 210mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      background: #fff;
    }
    .bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* ── Campos sobrepostos na frente ── */

    /* Nome do aluno: linha em branco abaixo de "Certificamos que" (~50% do topo) */
    .field-nome {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      width: 70%;
      font-family: 'Georgia', serif;
      font-size: 20pt;
      font-weight: bold;
      color: #1a1a1a;
      letter-spacing: 1px;
    }

    /* Carga horária: abaixo do nome do curso (~68% do topo) */
    .field-carga {
      position: absolute;
      left: 50%;
      top: 68%;
      transform: translateX(-50%);
      text-align: center;
      font-family: 'Georgia', serif;
      font-size: 11pt;
      color: #333;
    }
    .field-carga strong { font-size: 13pt; color: #1a1a1a; }

    /* Data: campo DATA no rodapé esquerdo (~83% do topo, ~17% da esquerda) */
    .field-data {
      position: absolute;
      left: 17%;
      top: 83%;
      transform: translateX(-50%);
      text-align: center;
      font-family: 'Georgia', serif;
      font-size: 10pt;
      color: #1a1a1a;
    }

    /* Data de início: ~74% topo, posicionada na linha do início */
    .field-data-inicio {
      position: absolute;
      left: 62%;
      top: 71.5%;
      font-family: 'Georgia', serif;
      font-size: 10pt;
      color: #1a1a1a;
    }

    /* Data de final: ~78% topo, posicionada na linha do final */
    .field-data-final {
      position: absolute;
      left: 62%;
      top: 78%;
      font-family: 'Georgia', serif;
      font-size: 10pt;
      color: #1a1a1a;
    }

    /* Código de verificação: rodapé direito */
    .field-codigo {
      position: absolute;
      right: 6mm;
      bottom: 4mm;
      text-align: right;
      font-family: Arial, sans-serif;
      font-size: 7pt;
      color: #555;
      max-width: 70mm;
    }
    .field-codigo a { color: #c00; text-decoration: none; word-break: break-all; }

    /* ── Overlay verso: módulos ── */
    .verso-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18mm 22mm;
    }
    .mod-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5px 20px;
      width: 100%;
    }
    .mod-item {
      font-family: Georgia, serif;
      font-size: 10pt;
      color: #1a2e4a;
      padding: 4px 0;
      border-bottom: 1px solid rgba(26,46,74,0.15);
      line-height: 1.3;
    }
    .mod-num { font-weight: bold; margin-right: 4px; color: #c00; }

    @media print {
      html, body { background: white; }
      .page { box-shadow: none; }
    }
  </style>
</head>
<body>

  <!-- FRENTE -->
  <div class="page frente-page">
    <img class="bg-img" src="${data.templateImageUrl}" alt="Frente do certificado">

    <div class="field-nome">${data.studentName}</div>

    <div class="field-carga"><strong>${data.workload} horas</strong></div>

    ${data.startDate ? `<div class="field-data-inicio">${data.startDate}</div>` : ''}
    ${data.completionDate ? `<div class="field-data-final">${data.completionDate}</div>` : ''}
    <div class="field-data">${data.completionDate || data.startDate || ''}</div>

    ${data.verificationCode ? `
    <div class="field-codigo">
      Cód.: ${data.verificationCode}<br>
      <a href="${data.verificationUrl}">${data.verificationUrl}</a>
    </div>` : ''}
  </div>

  ${versoPage}

</body>
</html>`
  }

  // ── Fallback: certificado sem imagem de template — design Ensino Plus ───────

  // SVG dos cantos em swoosh curvo (igual ao template real)
  const cornerSVG = `<svg viewBox="0 0 115 78" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" style="display:block;width:100%;height:100%;">
    <path d="M 0 0 L 110 0 C 130 0 114 28 62 58 C 38 72 8 79 0 79 Z" fill="#1a1a2e"/>
    <path d="M 0 0 L 90 0 C 108 0 93 23 48 50 C 27 63 4 70 0 67 Z" fill="#c0392b"/>
  </svg>`

  // Selo com fita vermelha
  const sealSVG = `<svg viewBox="0 0 80 108" xmlns="http://www.w3.org/2000/svg" width="66" height="89">
    <path d="M 22 72 L 8 108 L 23 95 L 40 104 L 57 95 L 72 108 L 58 72 Z" fill="#c0392b"/>
    <circle cx="40" cy="38" r="36" fill="#1a1a2e"/>
    <circle cx="40" cy="38" r="32" fill="none" stroke="#c0a84a" stroke-width="1.5"/>
    <circle cx="40" cy="38" r="26.5" fill="none" stroke="#c0a84a" stroke-width="0.6"/>
    <text x="34" y="54" font-family="Georgia,serif" font-size="30" font-weight="bold" fill="white">e</text>
    <polygon points="56,33 65,38 59,40 62,50 57,51 55,41 49,44" fill="#ccc" opacity="0.75"/>
  </svg>`

  // Marca d'água (ícone "e" circular, lado direito)
  const watermarkSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="47" fill="none" stroke="#555" stroke-width="5"/>
    <circle cx="50" cy="50" r="39" fill="none" stroke="#555" stroke-width="1"/>
    <text x="31" y="70" font-family="Georgia,serif" font-size="58" font-weight="bold" fill="#555">e</text>
    <polygon points="70,43 80,48 73,51 76,61 71,62 68,52 62,55" fill="#555" opacity="0.6"/>
  </svg>`

  const pageCSS = `
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #ccc; }

    /* ── Página ── */
    .page {
      width: 297mm; height: 210mm;
      position: relative; overflow: hidden;
      background: #f8f7f5;
      display: grid;
      grid-template-rows: 46mm 26mm 1fr 42mm;
    }
    .page:not(:last-child) { page-break-after: always; }

    /* ── Cantos em swoosh curvo ── */
    .corner-tl {
      position: absolute; top: 0; left: 0; z-index: 1;
      width: 105mm; height: 65mm; pointer-events: none;
    }
    .corner-br {
      position: absolute; bottom: 0; right: 0; z-index: 1;
      width: 105mm; height: 65mm; pointer-events: none;
      transform: rotate(180deg);
    }

    /* ── Borda ornamental fina ── */
    .cert-border {
      position: absolute; inset: 5.5mm; z-index: 4;
      border: 1px solid #c0c0c0; pointer-events: none;
    }

    /* ── Marca d'água ── */
    .watermark {
      position: absolute; right: 14mm; top: 50%;
      transform: translateY(-50%); opacity: 0.055; z-index: 1;
      width: 58mm; height: 58mm; pointer-events: none;
    }

    /* ── Logo (centralizado) ── */
    .logo-section {
      position: relative; z-index: 5;
      display: flex; align-items: center; justify-content: center;
      padding-top: 9mm;
    }
    .logo-img { height: 28mm; width: auto; }

    /* ── Título CERTIFICADO ── */
    .title-section {
      position: relative; z-index: 5;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 1.5mm;
    }
    .title-row {
      display: flex; align-items: center; gap: 5mm;
    }
    .title-line { width: 35mm; height: 1px; background: #999; }
    .title-ornament-side { font-size: 11px; color: #888; }
    .cert-title {
      font-size: 40px; font-weight: bold; color: #1a1a2e;
      letter-spacing: 7px; font-style: italic;
    }
    .title-sub-ornament { font-size: 18px; color: #bbb; letter-spacing: 5px; }

    /* ── Corpo ── */
    .body-section {
      position: relative; z-index: 5;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 0 50mm; text-align: center; gap: 2.5mm;
    }
    .pre-text { font-size: 15px; color: #666; }
    .student-name {
      font-size: 30px; font-weight: bold; color: #1a1a2e;
      border-bottom: 1px solid #777;
      padding: 0 18mm 2mm; white-space: nowrap;
    }
    .cert-desc { font-size: 14px; color: #444; line-height: 1.7; max-width: 155mm; }
    .cert-dates { font-size: 13.5px; color: #555; margin-top: 3mm; letter-spacing: 0.2px; }

    /* ── Rodapé ── */
    .footer-section {
      position: relative; z-index: 5;
      display: flex; align-items: flex-end; justify-content: space-between;
      padding: 3mm 16mm 8mm;
      border-top: 1px solid #aaa;
    }
    .f-left { flex: 1; display: flex; align-items: flex-end; gap: 4mm; }
    .f-center { text-align: center; flex: 0 0 74mm; display: flex; align-items: flex-end; justify-content: center; }
    .f-right { text-align: right; flex: 1; }
    .f-line { display: block; height: 1px; background: #999; margin-bottom: 2.5mm; }
    .f-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #aaa; font-family: Arial,sans-serif; }
    .f-value { font-size: 12px; color: #1a1a2e; margin-top: 1mm; }
    .f-sig-name { font-style: italic; font-size: 15px; color: #1a1a2e; }
    .f-sig-role { font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: #aaa; font-family: Arial,sans-serif; margin-top: 1mm; }
    .qr-wrap { flex-shrink: 0; }
    .qr-wrap svg { width: 55px !important; height: 55px !important; display: block; }
    .qr-meta { font-size: 7.5px; color: #aaa; font-family: Arial,sans-serif; }
    .qr-meta span { display: block; }

    .verif-code {
      position: absolute; bottom: 2.5mm; left: 0; right: 0;
      text-align: center; font-size: 7px; color: #ccc; font-family: Arial; z-index: 6;
    }

    /* ── Botão de impressão ── */
    .print-btn {
      position: fixed; top: 14px; right: 14px; z-index: 9999;
      background: #c0392b; color: #fff; border: none; border-radius: 6px;
      padding: 10px 22px; font-size: 14px; font-weight: bold;
      cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.25); font-family: Arial;
    }
    .print-btn:hover { background: #a93226; }
    @media print { .print-btn { display: none !important; } body { background: white; } }

    /* ── VERSO ── */
    .verso-body {
      position: relative; z-index: 5;
      display: flex; flex-direction: column; align-items: center;
      padding: 4mm 16mm 0;
    }
    .verso-title { font-size: 15px; font-weight: bold; color: #1a1a2e; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 2mm; }
    .verso-sub { font-size: 9.5px; color: #999; font-style: italic; margin-bottom: 5mm; }
    .modules-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px 16px; width: 100%; }
    .mod-item { font-size: 9.5px; color: #333; padding: 3px 7px; border-left: 3px solid #c0392b; background: #f5f4f2; line-height: 1.3; }
    .mod-num { font-weight: bold; color: #c0392b; margin-right: 3px; }
  `

  const versoPageHTML = hasModules ? `
  <div class="page">
    <div class="corner-tl">${cornerSVG}</div>
    <div class="corner-br">${cornerSVG}</div>
    <div class="cert-border"></div>
    <div class="watermark">${watermarkSVG}</div>

    <div class="logo-section">
      <img class="logo-img" src="${LOGO_ENSINO_PLUS_B64}" alt="Ensino Plus"/>
    </div>

    <div class="title-section">
      <div class="title-row">
        <span class="title-line"></span>
        <span class="title-ornament-side">&#10022;</span>
        <span style="font-size:14px;color:#888;letter-spacing:3px;">CONTEÚDO PROGRAMÁTICO</span>
        <span class="title-ornament-side">&#10022;</span>
        <span class="title-line"></span>
      </div>
      <div class="title-sub-ornament">&#8764; &#8764; &#8764;</div>
    </div>

    <div class="verso-body">
      <div class="verso-sub">${data.studentName} &mdash; ${data.courseName}</div>
      <div class="modules-grid">
        ${data.modules!.map((m, i) => `
          <div class="mod-item"><span class="mod-num">${String(i + 1).padStart(2, '0')}.</span>${m}</div>`).join('')}
      </div>
    </div>

    <div class="footer-section">
      <div class="f-left">
        <div class="f-label">Código de Verificação</div>
        <div class="f-value">${data.verificationCode}</div>
      </div>
      <div class="f-center">${sealSVG}</div>
      <div class="f-right">
        <span class="f-line"></span>
        <div class="f-sig-name">Nárgila de Souza Santos</div>
        <div class="f-sig-role">DIRETORA</div>
      </div>
    </div>
  </div>` : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado &mdash; Ensino Plus</title>
  <style>${pageCSS}</style>
</head>
<body>

  <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>

  <!-- FRENTE -->
  <div class="page">
    <div class="corner-tl">${cornerSVG}</div>
    <div class="corner-br">${cornerSVG}</div>
    <div class="cert-border"></div>
    <div class="watermark">${watermarkSVG}</div>

    <!-- Logo centralizado grande -->
    <div class="logo-section">
      <img class="logo-img" src="${LOGO_ENSINO_PLUS_B64}" alt="Ensino Plus"/>
    </div>

    <!-- Título CERTIFICADO ornamental -->
    <div class="title-section">
      <div class="title-row">
        <span class="title-line"></span>
        <span class="title-ornament-side">&#9670;</span>
        <span class="cert-title">CERTIFICADO</span>
        <span class="title-ornament-side">&#9670;</span>
        <span class="title-line"></span>
      </div>
      <div class="title-sub-ornament">&#8764; &#8764; &#8764;</div>
    </div>

    <!-- Corpo -->
    <div class="body-section">
      <div class="pre-text">Certificamos que o(a) aluno(a)</div>
      <div class="student-name">${data.studentName}</div>
      <div class="cert-desc">
        concluiu a carga horária necessária para obtenção do presente certificado
        referente ao curso <strong>${data.courseName}</strong>,
        ministrado pela <strong>Centro de Ensino e Aprendizagem Plus Ltda</strong>
        &ndash; CNPJ: 35.537.045/0001-84, com carga horária total de <strong>${data.workload} horas</strong>.
      </div>
      <div class="cert-dates">
        <span>Início do curso: <strong>${data.startDate || '&mdash;'}</strong></span>
        &nbsp;&nbsp;&nbsp;
        <span>Conclusão: <strong>${data.completionDate || '&mdash;'}</strong></span>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="footer-section">
      <div class="f-left">
        ${data.qrCodeSVG ? `<div class="qr-wrap">${data.qrCodeSVG}</div>` : ''}
        <div>
          <span class="f-line"></span>
          <div class="f-label">DATA</div>
          <div class="f-value">${data.completionDate || data.startDate || '&mdash;'}</div>
          ${data.qrCodeSVG ? `<div class="qr-meta"><span>Escaneie para verificar</span><span>${data.verificationCode}</span></div>` : ''}
        </div>
      </div>
      <div class="f-center">${sealSVG}</div>
      <div class="f-right">
        <span class="f-line"></span>
        <div class="f-sig-name">Nárgila de Souza Santos</div>
        <div class="f-sig-role">DIRETORA</div>
      </div>
    </div>

    <div class="verif-code">
      Centro de Ensino e Aprendizagem Plus Ltda &mdash; CNPJ: 35.537.045/0001-84
      &nbsp;&nbsp;|&nbsp;&nbsp;
      Cód.: ${data.verificationCode} &nbsp;|&nbsp; ${data.verificationUrl}
    </div>
  </div>

  ${versoPageHTML}

  <script>window.onload=function(){document.querySelectorAll('.qr-wrap svg').forEach(function(s){s.setAttribute('width','60');s.setAttribute('height','60');})}</script>

</body>
</html>`
}

// ============================================================================
// CERTIFICATES - USER ENDPOINTS (Logged In Users)
// ============================================================================

// Get my certificates (for logged-in user)
app.get('/api/my-certificates', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const userEmail = user.email
    
    if (!userEmail) {
      return c.json({ error: 'User email not found' }, 400)
    }
    
    const db = getDB(c)
    
    const certificates = await db.query('certificates', {
      select: '*',
      filters: { user_email: userEmail },
      order: 'completion_date DESC'
    })
    
    return c.json({ certificates: certificates || [] })
  } catch (error: any) {
    console.error('Get my certificates error:', error)
    return c.json({ error: error.message || 'Failed to get certificates' }, 500)
  }
})

// Generate certificate HTML (for logged-in user)
app.get('/api/certificates/:id/html', requireAuth, async (c) => {
  try {
    const certId = c.req.param('id')
    const user = c.get('user')
    const userEmail = user.email
    
    const db = getDB(c)
    
    // Get certificate
    const certificates = await db.query('certificates', {
      select: '*',
      filters: { id: certId }
    })
    
    if (!certificates || certificates.length === 0) {
      return c.json({ error: 'Certificate not found' }, 404)
    }
    
    const cert = certificates[0]
    
    // Verify ownership
    if (cert.user_email !== userEmail) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    
    // Generate certificate HTML directly (inline template for Cloudflare Workers)
    const startDate = cert.start_date ? new Date(cert.start_date).toLocaleDateString('pt-BR') : undefined
    const completionDate = cert.completion_date ? new Date(cert.completion_date).toLocaleDateString('pt-BR') : undefined
    const issueDate = cert.generated_at ? new Date(cert.generated_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')
    const baseUrl = new URL(c.req.url).origin
    const certCode = cert.certificate_code || cert.verification_code || ''
    const verificationUrl = certCode ? `${baseUrl}/verificar/${certCode}` : ''
    
    // Buscar módulos do curso se course_id existir
    let modules: string[] = []
    
    // Primeiro tentar usar course_modules se existir (JSON armazenado)
    if (cert.course_modules) {
      try {
        const modulesData = JSON.parse(cert.course_modules)
        modules = modulesData.map((m: any) => m.title || m)
      } catch (e) {
        console.log('Error parsing course_modules:', e)
      }
    }
    
    // Se não houver módulos armazenados e houver course_id, buscar do banco
    if (modules.length === 0 && cert.course_id) {
      try {
        const courseModules = await db.query('modules', {
          select: 'title, order_index',
          filters: { course_id: cert.course_id },
          order: 'order_index ASC'
        })
        
        if (courseModules && courseModules.length > 0) {
          modules = courseModules.map((m: any) => m.title)
        }
      } catch (e) {
        console.log('Error fetching modules:', e)
      }
    }
    
    // Buscar template do curso — embutir base64 direto no HTML (sem requisição extra)
    let templateImageUrl: string | undefined
    let versoImageUrl: string | undefined
    if (cert.course_id) {
      try {
        const tmpl = await db.query('certificate_templates', {
          select: 'template_data, template_mime, verso_data, verso_mime',
          filters: { course_id: cert.course_id },
          single: true
        })
        if (tmpl?.template_data) {
          const mime = tmpl.template_mime || 'image/jpeg'
          templateImageUrl = `data:${mime};base64,${tmpl.template_data}`
        }
        if (tmpl?.verso_data) {
          const mime = tmpl.verso_mime || 'image/jpeg'
          versoImageUrl = `data:${mime};base64,${tmpl.verso_data}`
        }
      } catch (e) {
        console.log('No certificate template found for course', cert.course_id)
      }
    }

    // Gerar QR code como SVG inline
    let qrCodeSVG: string | undefined
    if (verificationUrl) {
      try {
        qrCodeSVG = await QRCode.toString(verificationUrl, {
          type: 'svg',
          margin: 1,
          color: { dark: '#1a1a2e', light: '#f8f7f5' }
        })
      } catch (e) {
        console.log('QR code generation failed:', e)
      }
    }

    const html = generateCertificateHTML({
      studentName: cert.user_name,
      courseName: cert.course_title,
      workload: cert.carga_horaria || 'N/A',
      startDate,
      completionDate,
      issueDate,
      verificationCode: certCode,
      verificationUrl,
      qrCodeSVG,
      modules: modules.length > 0 ? modules : undefined,
      templateImageUrl,
      versoImageUrl
    })
    
    return c.html(html)
  } catch (error: any) {
    console.error('Generate certificate HTML error:', error)
    return c.json({ error: error.message || 'Failed to generate certificate' }, 500)
  }
})

// ============================================================================
// CERTIFICATE VERIFICATION - PUBLIC ENDPOINT
// ============================================================================

// Public verification endpoint
app.get('/verificar/:code', async (c) => {
  try {
    const code = c.req.param('code')
    
    const db = getDB(c)
    
    const certificates = await db.query('certificates', {
      select: '*',
      filters: { certificate_code: code }
    })

    if (!certificates || certificates.length === 0) {
      return c.html(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificado Não Encontrado - CCT 2026</title>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100">
          <div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
              <div class="text-red-500 text-6xl mb-4">❌</div>
              <h1 class="text-2xl font-bold text-gray-800 mb-4">Certificado Não Encontrado</h1>
              <p class="text-gray-600 mb-6">
                O código de verificação <strong>${code}</strong> não foi encontrado em nossa base de dados.
              </p>
              <p class="text-sm text-gray-500">
                Verifique se o código está correto ou entre em contato com o emissor do certificado.
              </p>
              <a href="/" class="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Voltar ao Início
              </a>
            </div>
          </div>
        </body>
        </html>
      `)
    }
    
    const cert = certificates[0]
    
    // Increment verification count (coluna opcional)
    try {
      await db.update('certificates', { id: cert.id }, {
        verification_count: (cert.verification_count || 0) + 1
      })
    } catch (_) {}
    
    const startDate = cert.start_date ? new Date(cert.start_date).toLocaleDateString('pt-BR') : undefined
    const completionDate = cert.completion_date ? new Date(cert.completion_date).toLocaleDateString('pt-BR') : undefined
    const issueDate = cert.generated_at ? new Date(cert.generated_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')

    // Buscar módulos do curso
    let modules: string[] = []
    
    if (cert.course_modules) {
      try {
        const modulesData = JSON.parse(cert.course_modules)
        modules = modulesData.map((m: any) => m.title || m)
      } catch (e) {
        console.log('Error parsing course_modules:', e)
      }
    }
    
    if (modules.length === 0 && cert.course_id) {
      try {
        const courseModules = await db.query('modules', {
          select: 'title, order_index',
          filters: { course_id: cert.course_id },
          order: 'order_index ASC'
        })
        
        if (courseModules && courseModules.length > 0) {
          modules = courseModules.map((m: any) => m.title)
        }
      } catch (e) {
        console.log('Error fetching modules:', e)
      }
    }
    
    const modulesHTML = modules.length > 0 
      ? `
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="text-sm font-bold text-gray-700 mb-3">
          <i class="fas fa-list-check mr-2 text-blue-600"></i>Módulos Concluídos:
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${modules.map((module, index) => `
            <div class="flex items-start text-sm text-gray-700">
              <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>${module}</span>
            </div>
          `).join('')}
        </div>
      </div>
      `
      : '';
    
    return c.html(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Certificado - CCT 2026</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
      </head>
      <body class="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
            <div class="text-center mb-6">
              <div class="text-green-500 text-6xl mb-4">
                <i class="fas fa-certificate"></i>
              </div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">✅ Certificado Verificado</h1>
              <p class="text-gray-600">Este certificado é válido e autêntico</p>
            </div>
            
            <div class="border-t-2 border-b-2 border-blue-200 py-6 my-6">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <span class="text-sm text-gray-500 block">Aluno</span>
                  <span class="text-xl font-bold text-gray-800">${cert.user_name}</span>
                </div>
                <div>
                  <span class="text-sm text-gray-500 block">Curso</span>
                  <span class="text-lg font-semibold text-gray-800">${cert.course_title}</span>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Carga Horária</span>
                <span class="text-lg font-bold text-blue-600">${cert.carga_horaria || 'N/A'} horas</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Data de Conclusão</span>
                <span class="text-lg font-bold text-blue-600">${completionDate}</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Início do Curso</span>
                <span class="text-lg font-bold text-blue-600">${startDate || '&mdash;'}</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Emissão do Certificado</span>
                <span class="text-lg font-bold text-blue-600">${issueDate}</span>
              </div>
            </div>
            
            ${modulesHTML}
            
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-gray-500 block mb-1">Código de Verificação</span>
                  <span class="text-sm font-mono font-bold text-gray-800">${cert.certificate_code}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-500 block mb-1">Emitido em</span>
                  <span class="text-sm font-semibold text-gray-800">${issueDate}</span>
                </div>
              </div>
            </div>
            
            <div class="text-center text-xs text-gray-500">
              <p class="mb-2">
                <i class="fas fa-eye mr-1"></i>
                Este certificado foi verificado ${cert.verification_count || 1} vez(es)
              </p>
              <p class="text-xs">
                Certificado emitido por<br>
                <strong>Centro de Ensino e Aprendizagem Plus Ltda</strong><br>
                CNPJ: 35.537.045/0001-84
              </p>
            </div>
            
            <div class="mt-6 text-center">
              <a href="/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                <i class="fas fa-home mr-2"></i>Voltar ao Início
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `)
  } catch (error: any) {
    console.error('Verify certificate error:', error)
    return c.json({ error: error.message || 'Failed to verify certificate' }, 500)
  }
})

// API endpoint for verification (JSON response)
app.get('/api/verify/:code', async (c) => {
  try {
    const code = c.req.param('code')
    
    const db = getDB(c)
    
    const certificates = await db.query('certificates', {
      select: '*',
      filters: { certificate_code: code }
    })

    if (!certificates || certificates.length === 0) {
      return c.json({ valid: false, message: 'Certificate not found' }, 404)
    }
    
    const cert = certificates[0]
    
    // Increment verification count (coluna opcional)
    try {
      await db.update('certificates', { id: cert.id }, {
        verification_count: (cert.verification_count || 0) + 1
      })
    } catch (_) {}
    
    return c.json({
      valid: true,
      certificate: {
        student_name: cert.user_name,
        course_title: cert.course_title,
        workload: cert.carga_horaria,
        completion_date: cert.completion_date,
        issued_at: cert.issued_at,
        certificate_code: cert.certificate_code,
        verification_count: (cert.verification_count || 0) + 1
      }
    })
  } catch (error: any) {
    console.error('Verify certificate API error:', error)
    return c.json({ error: error.message || 'Failed to verify certificate' }, 500)
  }
})

// ============================================================================
// MEMBER SUBSCRIPTIONS (HISTÓRICO DE MEMBROS) - Admin Only
// ============================================================================

// List all member subscriptions (admin only)
app.get('/api/admin/member-subscriptions', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    
    const subscriptions = await db.query('member_subscriptions', {
      select: '*',
      order: 'created_at DESC'
    })
    
    return c.json({ subscriptions: subscriptions || [] })
  } catch (error: any) {
    console.error('List member subscriptions error:', error)
    return c.json({ error: error.message || 'Failed to list member subscriptions' }, 500)
  }
})

// List SuitePlus subscriptions (admin only)
app.get('/api/admin/suiteplus-subscriptions', requireAdmin, async (c) => {
  try {
    const connStr = c.env.DATABASE_SUITEPLUS
    if (!connStr) return c.json({ error: 'DATABASE_SUITEPLUS não configurada' }, 500)

    const db = new PostgresClient(connStr)
    const rows = await db.sql(
      `SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
       FROM user_subscriptions
       ORDER BY expires_at DESC`
    )
    return c.json({ subscriptions: rows })
  } catch (error: any) {
    console.error('SuitePlus subscriptions error:', error)
    return c.json({ error: error.message || 'Erro ao buscar assinaturas SuitePlus' }, 500)
  }
})

// Find member subscription by email (for duplicate checking)
app.get('/api/admin/member-subscriptions/find', requireAdmin, async (c) => {
  try {
    const email = c.req.query('email')
    
    if (!email) {
      return c.json({ error: 'Email parameter is required' }, 400)
    }
    
    const db = getDB(c)
    
    const subscriptions = await db.query('member_subscriptions', {
      select: '*',
      filters: { email_membro: email }
    })
    
    return c.json({ subscriptions: subscriptions || [] })
  } catch (error: any) {
    console.error('Find member subscription error:', error)
    return c.json({ error: error.message || 'Failed to find member subscription' }, 500)
  }
})

// Create member subscription (admin only)
app.post('/api/admin/member-subscriptions', requireAdmin, async (c) => {
  try {
    const subData = await c.req.json()
    
    if (!subData.email_membro) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    const db = getDB(c)
    
    const result = await db.insert('member_subscriptions', {
      email_membro: subData.email_membro,
      data_expiracao: subData.data_expiracao || null,
      detalhe: subData.detalhe || null,
      origem: subData.origem || null,
      teste_gratis: subData.teste_gratis || false,
      ativo: subData.ativo !== undefined ? subData.ativo : true
    })
    
    return c.json({ 
      success: true, 
      subscription_id: result && result.length > 0 ? result[0].id : null 
    })
  } catch (error: any) {
    console.error('Create member subscription error:', error)
    return c.json({ error: error.message || 'Failed to create member subscription' }, 500)
  }
})

// Update member subscription (admin only)
app.put('/api/admin/member-subscriptions/:id', requireAdmin, async (c) => {
  try {
    const subId = c.req.param('id')
    const subData = await c.req.json()
    
    const db = getDB(c)
    
    await db.update('member_subscriptions', { id: subId }, {
      email_membro: subData.email_membro,
      data_expiracao: subData.data_expiracao,
      detalhe: subData.detalhe,
      origem: subData.origem,
      teste_gratis: subData.teste_gratis,
      ativo: subData.ativo,
      updated_at: new Date().toISOString()
    })
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Update member subscription error:', error)
    return c.json({ error: error.message || 'Failed to update member subscription' }, 500)
  }
})

// Delete member subscription (admin only)
app.delete('/api/admin/member-subscriptions/:id', requireAdmin, async (c) => {
  try {
    const subId = c.req.param('id')
    
    const db = getDB(c)
    await db.delete('member_subscriptions', { id: subId })
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return c.json({ error: error.message || 'Failed to delete user' }, 500)
  }
})

// ============================================
// API ROUTES - COURSES
// ============================================

// Get all courses
app.get('/api/courses', async (c) => {
  try {
    const db = getDB(c)
    
    // Check if user is admin
    const token = getCookie(c, 'sb-access-token')
    let userIsAdmin = false
    
    if (token) {
      const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
      if (user) {
        userIsAdmin = await isAdmin(user.email, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, token)
      }
    }
    
    // Get courses - filter by is_published if not admin
    const filters = userIsAdmin ? {} : { is_published: true }
    
    const publishedFilter = userIsAdmin ? '' : 'WHERE c.is_published = true'
    const courses = await db.sql(`
      SELECT c.*,
             COUNT(DISTINCT m.id)::int AS modules_count,
             COUNT(l.id)::int          AS lessons_count
      FROM courses c
      LEFT JOIN modules m ON m.course_id = c.id
      LEFT JOIN lessons l ON l.module_id = m.id
      ${publishedFilter}
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `)

    return c.json({ courses })
  } catch (error: any) {
    console.error('❌ /api/courses error:', error?.message || error)
    return c.json({ error: error?.message || 'Failed to fetch courses' }, 500)
  }
})

// Get single course with modules and lessons
app.get('/api/courses/:id', async (c) => {
  try {
    const courseId = c.req.param('id')
    
    const db = getDB(c)
    
    // Get course
    const course = await db.query('courses', {
      select: '*',
      filters: { id: courseId },
      single: true
    })
    
    if (!course) {
      return c.json({ error: 'Course not found' }, 404)
    }
    
    const modules = await db.query('modules', {
      select: '*',
      filters: { course_id: courseId },
      order: 'order_index'
    })

    // Busca todas as aulas do curso em uma única query e agrupa por módulo
    const allLessons = await db.sql(
      `SELECT l.* FROM lessons l
       JOIN modules m ON m.id = l.module_id
       WHERE m.course_id = $1
       ORDER BY m.order_index, l.order_index`,
      [courseId]
    )
    const lessonsByModule = new Map<number, any[]>()
    for (const lesson of allLessons) {
      const list = lessonsByModule.get(lesson.module_id) || []
      list.push(lesson)
      lessonsByModule.set(lesson.module_id, list)
    }
    for (const module of modules) {
      module.lessons = lessonsByModule.get(module.id) || []
    }

    return c.json({ course, modules })
  } catch (error: any) {
    console.error('❌ /api/courses/:id error:', error?.message || error)
    return c.json({ error: error?.message || 'Failed to fetch course' }, 500)
  }
})

// ============================================
// API ROUTES - LESSONS
// ============================================

// Get lesson details with comments
app.get('/api/lessons/:id', async (c) => {
  try {
    const lessonId = c.req.param('id')
    
    // Get authenticated user
    const token = getCookie(c, 'sb-access-token')
    let userEmail = null
    
    if (token) {
      const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
      if (user) {
        userEmail = user.email
      }
    }
    
    const db = getDB(c)
    
    // Check if user has access to this lesson
    let hasAccess = false;
    let fallbackMode = false;

    if (userEmail) {
      try {
        const accessRows = await db.sql(
          `SELECT user_has_lesson_access($1::text, $2::integer) AS has_access`,
          [userEmail, parseInt(lessonId)]
        )
        hasAccess = !!accessRows[0]?.has_access

        console.log('Has access:', hasAccess, 'User:', userEmail, 'Lesson:', lessonId)

        if (!hasAccess) {
          // Run all fallback checks in parallel to avoid sequential round trips
          const suiteplusConn = (c.env as any).DATABASE_SUITEPLUS
          const [rental, activeSub, suiteplusExpires] = await Promise.all([
            db.sql(
              'SELECT expires_at FROM lesson_rentals WHERE user_email = $1 AND lesson_id = $2 AND expires_at > NOW()',
              [userEmail, parseInt(lessonId)]
            ),
            db.sql(
              `SELECT id FROM member_subscriptions WHERE email_membro = $1 AND data_expiracao > NOW() AND ativo = true LIMIT 1`,
              [userEmail]
            ),
            suiteplusConn ? getSuiteplusExpiration(userEmail, suiteplusConn) : Promise.resolve(null),
          ])

          if (rental.length > 0 || activeSub.length > 0 || (suiteplusExpires && suiteplusExpires > new Date())) {
            hasAccess = true
          }

          if (!hasAccess) {
            const lessonMeta = await db.sql(
              'SELECT rentable, rental_credits, title FROM lessons WHERE id = $1',
              [parseInt(lessonId)]
            )
            console.log('❌ Access denied for user:', userEmail, 'lesson:', lessonId)
            return c.json({
              error: 'Access denied',
              message: 'Você não tem permissão para acessar esta aula.',
              needsUpgrade: true,
              rentable: lessonMeta[0]?.rentable || false,
              rental_credits: lessonMeta[0]?.rental_credits || 0,
              lesson_title: lessonMeta[0]?.title || ''
            }, 403)
          }
        }

        console.log('✅ Access granted for user:', userEmail, 'lesson:', lessonId)
      } catch (rpcError: any) {
        console.error('❌ Error checking access via RPC:', rpcError)
        console.log('⚠️ Allowing access due to RPC error (fallback mode)')
        fallbackMode = true;
        hasAccess = true;
      }
    }

    if (!userEmail || (!hasAccess && !fallbackMode)) {
      // Not authenticated - check if lesson is free
      const lesson = await db.query('lessons', {
        select: 'teste_gratis',
        filters: { id: lessonId },
        single: true
      })

      if (!lesson?.teste_gratis) {
        return c.json({
          error: 'Access denied',
          message: 'Esta é uma aula premium. Faça login e tenha um plano ativo para acessar.',
          needsLogin: true
        }, 403)
      }
    }

    await ensureCommentsReplySchema(db)

    // Fetch lesson data, comments, and trails in parallel
    const lessonSql = `
      SELECT l.*, m.title as module_title, c.title as course_title, c.id as course_id
      FROM lessons l
      LEFT JOIN modules m ON l.module_id = m.id
      LEFT JOIN courses c ON m.course_id = c.id
      WHERE l.id = $1
    `
    const trailsSql = `
      SELECT
        t.id as trail_id,
        t.title as trail_title,
        tl.order_index,
        (SELECT COUNT(*)::int FROM trail_lessons WHERE trail_id = t.id) as total_lessons,
        (SELECT l2.id FROM trail_lessons tl2
         JOIN lessons l2 ON l2.id = tl2.lesson_id
         WHERE tl2.trail_id = t.id AND tl2.order_index < tl.order_index
         ORDER BY tl2.order_index DESC LIMIT 1) as prev_lesson_id,
        (SELECT l2.title FROM trail_lessons tl2
         JOIN lessons l2 ON l2.id = tl2.lesson_id
         WHERE tl2.trail_id = t.id AND tl2.order_index < tl.order_index
         ORDER BY tl2.order_index DESC LIMIT 1) as prev_lesson_title,
        (SELECT l2.id FROM trail_lessons tl2
         JOIN lessons l2 ON l2.id = tl2.lesson_id
         WHERE tl2.trail_id = t.id AND tl2.order_index > tl.order_index
         ORDER BY tl2.order_index ASC LIMIT 1) as next_lesson_id,
        (SELECT l2.title FROM trail_lessons tl2
         JOIN lessons l2 ON l2.id = tl2.lesson_id
         WHERE tl2.trail_id = t.id AND tl2.order_index > tl.order_index
         ORDER BY tl2.order_index ASC LIMIT 1) as next_lesson_title
      FROM trail_lessons tl
      JOIN trails t ON t.id = tl.trail_id
      WHERE tl.lesson_id = $1 AND t.is_published = true
      ORDER BY t.order_index
    `
    const [lessonResult, comments, lessonTrails] = await Promise.all([
      db.sql(lessonSql, [parseInt(lessonId)]),
      db.sql(`SELECT * FROM comments WHERE lesson_id = $1 ORDER BY created_at DESC`, [lessonId]),
      db.sql(trailsSql, [parseInt(lessonId)]),
    ])

    if (!lessonResult || lessonResult.length === 0) {
      return c.json({ error: 'Lesson not found' }, 404)
    }

    const lesson = lessonResult[0]

    return c.json({ lesson, comments, trails: lessonTrails })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return c.json({ error: 'Failed to fetch lesson' }, 500)
  }
})

// ============================================
// API ROUTES - COMMENTS
// ============================================

// List comments with lesson context (admin only)
app.get('/api/admin/comments', requireAdmin, async (c) => {
  try {
    const status = c.req.query('status') || 'all'
    const search = (c.req.query('search') || '').trim()
    const db = getDB(c)
    await ensureCommentsReplySchema(db)

    const filters: string[] = []
    const values: any[] = []

    if (status === 'pending') {
      filters.push(`NULLIF(TRIM(COALESCE(c.admin_reply, '')), '') IS NULL`)
    } else if (status === 'answered') {
      filters.push(`NULLIF(TRIM(COALESCE(c.admin_reply, '')), '') IS NOT NULL`)
    }

    if (search) {
      values.push(`%${search}%`)
      filters.push(`(
        c.comment_text ILIKE $${values.length}
        OR c.user_name ILIKE $${values.length}
        OR c.user_email ILIKE $${values.length}
        OR l.title ILIKE $${values.length}
        OR m.title ILIKE $${values.length}
        OR co.title ILIKE $${values.length}
      )`)
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const comments = await db.sql(`
      SELECT
        c.*,
        l.title AS lesson_title,
        l.video_provider,
        l.video_id,
        l.video_url,
        m.title AS module_title,
        co.title AS course_title,
        CASE
          WHEN l.video_url IS NOT NULL AND l.video_url <> '' THEN l.video_url
          WHEN l.video_provider = 'youtube' AND l.video_id IS NOT NULL AND l.video_id <> '' THEN 'https://www.youtube.com/watch?v=' || l.video_id
          WHEN l.video_provider = 'vimeo' AND l.video_id IS NOT NULL AND l.video_id <> '' THEN 'https://vimeo.com/' || l.video_id
          WHEN l.video_provider = 'url' THEN l.video_id
          ELSE NULL
        END AS lesson_video_link
      FROM comments c
      JOIN lessons l ON l.id = c.lesson_id
      LEFT JOIN modules m ON m.id = l.module_id
      LEFT JOIN courses co ON co.id = m.course_id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT 200
    `, values)

    return c.json({ comments })
  } catch (error: any) {
    console.error('List admin comments error:', error)
    return c.json({ error: error.message || 'Failed to list comments' }, 500)
  }
})

// Reply to a comment (admin only)
app.put('/api/admin/comments/:id/reply', requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const { admin_reply } = await c.req.json()
    const user = c.get('user')
    const reply = String(admin_reply || '').trim()
    const db = getDB(c)
    await ensureCommentsReplySchema(db)

    const rows = await db.update('comments', { id }, {
      admin_reply: reply || null,
      admin_replied_at: reply ? new Date().toISOString() : null,
      admin_replied_by: reply ? (user?.email || null) : null
    })

    return c.json({ success: true, comment: rows[0] || null })
  } catch (error: any) {
    console.error('Reply comment error:', error)
    return c.json({ error: error.message || 'Failed to reply comment' }, 500)
  }
})

// Delete a student comment (admin only)
app.delete('/api/admin/comments/:id', requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    await ensureCommentsReplySchema(db)
    await db.delete('comments', { id })

    return c.json({ success: true })
  } catch (error: any) {
    console.error('Delete comment error:', error)
    return c.json({ error: error.message || 'Failed to delete comment' }, 500)
  }
})

// Add comment to lesson
app.post('/api/lessons/:id/comments', async (c) => {
  try {
    const lessonId = c.req.param('id')
    const { comment_text } = await c.req.json()
    
    // Get authenticated user
    const token = getCookie(c, 'sb-access-token')
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    if (!comment_text || !comment_text.trim()) {
      return c.json({ error: 'Comment text is required' }, 400)
    }
    
    // Get user name from user metadata or email
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
    
    const db = getDB(c)
    
    const result = await db.insert('comments', {
      lesson_id: parseInt(lessonId),
      user_name: userName,
      user_email: user.email,
      comment_text: comment_text.trim()
    })
    
    return c.json({ 
      success: true, 
      comment_id: result[0].id
    })
  } catch (error: any) {
    console.error('Add comment error:', error)
    return c.json({ error: error.message || 'Failed to add comment' }, 500)
  }
})

// ============================================
// API ROUTES - USER PROGRESS
// ============================================

app.get('/api/progress/:email/:courseId', async (c) => {
  try {
    const email = c.req.param('email')
    const courseId = c.req.param('courseId')
    
    const db = getDB(c)
    
    // Use SQL join para obter progresso + info da aula
    // Visto que RPC nem sempre é fácil portar dependendo do tipo retornado
    const sqlQuery = `
      SELECT up.*, l.module_id
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      WHERE up.user_email = $1 AND m.course_id = $2
    `
    const progress = await db.sql(sqlQuery, [email, parseInt(courseId)])
    
    return c.json({ progress: progress || [] })
  } catch (error: any) {
    console.error('❌ /api/progress error:', error?.message || error)
    return c.json({ error: error?.message || 'Failed to fetch progress' }, 500)
  }
})

// Mark lesson as completed
app.post('/api/progress/complete', async (c) => {
  try {
    const { user_email, lesson_id } = await c.req.json()
    
    if (!user_email || !lesson_id) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    const db = getDB(c)
    
    // Check if progress exists
    const existing = await db.query('user_progress', {
      select: '*',
      filters: { user_email, lesson_id }
    })
    
    if (existing && existing.length > 0) {
      // Update existing
      await db.update('user_progress', { id: existing[0].id }, {
        completed: true,
        completed_at: new Date().toISOString()
      })
    } else {
      // Insert new
      await db.insert('user_progress', {
        user_email,
        lesson_id: parseInt(lesson_id),
        completed: true,
        completed_at: new Date().toISOString()
      })
    }
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update progress' }, 500)
  }
})

// Mark lesson as incomplete
app.post('/api/progress/uncomplete', async (c) => {
  try {
    const { user_email, lesson_id } = await c.req.json()
    
    if (!user_email || !lesson_id) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    const db = getDB(c)
    
    // Find and delete progress
    const existing = await db.query('user_progress', {
      select: '*',
      filters: { user_email, lesson_id }
    })
    
    if (existing && existing.length > 0) {
      await db.delete('user_progress', { id: existing[0].id })
    }
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update progress' }, 500)
  }
})

// ============================================
// API ROUTES - CERTIFICATES
// ============================================

// Upload certificate template (Admin only)
app.post('/api/admin/certificate-template', requireAdmin, async (c) => {
  try {
    const body = await c.req.json()
    const { course_id, image_data, verso_data } = body

    if (!course_id || !image_data) {
      return c.json({ error: 'ID do curso e imagem da frente são obrigatórios' }, 400)
    }

    // Extract mime type and raw base64 from data URL
    const parseMime = (dataUrl: string) => {
      const match = dataUrl.match(/^data:([^;]+);base64,/)
      return match ? match[1] : 'image/jpeg'
    }
    const stripPrefix = (dataUrl: string) =>
      dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl

    const templateMime = parseMime(image_data)
    const templateBase64 = stripPrefix(image_data)
    const versoMime = verso_data ? parseMime(verso_data) : null
    const versoBase64 = verso_data ? stripPrefix(verso_data) : null

    const template_url = `/api/certificate-template/${course_id}/image`
    const verso_url = verso_data ? `/api/certificate-template/${course_id}/verso` : null

    const db = getDB(c)

    const existing = await db.query('certificate_templates', {
      select: '*',
      filters: { course_id }
    })

    if (existing && existing.length > 0) {
      const updateData: Record<string, any> = {
        template_url,
        template_data: templateBase64,
        template_mime: templateMime,
        updated_at: new Date().toISOString()
      }
      if (verso_data !== undefined) {
        updateData.verso_data = versoBase64
        updateData.verso_mime = versoMime
      }
      await db.update('certificate_templates', { id: existing[0].id }, updateData)
    } else {
      await db.insert('certificate_templates', {
        course_id: parseInt(course_id),
        template_url,
        template_data: templateBase64,
        template_mime: templateMime,
        verso_data: versoBase64,
        verso_mime: versoMime,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    console.log('✅ Certificate template saved to Postgres')
    return c.json({
      success: true,
      template_url,
      verso_url,
      message: 'Template de certificado salvo com sucesso!'
    })
  } catch (error: any) {
    console.error('💥 Certificate template error:', error)
    return c.json({ error: 'Erro ao salvar template de certificado', details: error.message }, 500)
  }
})

// Serve certificate template image (frente)
app.get('/api/certificate-template/:courseId/image', async (c) => {
  try {
    const courseId = c.req.param('courseId')
    const db = getDB(c)
    const template = await db.query('certificate_templates', {
      select: 'template_data, template_mime',
      filters: { course_id: courseId },
      single: true
    })
    if (!template?.template_data) return c.json({ error: 'Imagem não encontrada' }, 404)
    const binary = Uint8Array.from(atob(template.template_data), ch => ch.charCodeAt(0))
    return new Response(binary, {
      headers: { 'Content-Type': template.template_mime || 'image/jpeg', 'Cache-Control': 'public, max-age=86400' }
    })
  } catch {
    return c.json({ error: 'Erro ao buscar imagem' }, 500)
  }
})

// Serve certificate template image (verso)
app.get('/api/certificate-template/:courseId/verso', async (c) => {
  try {
    const courseId = c.req.param('courseId')
    const db = getDB(c)
    const template = await db.query('certificate_templates', {
      select: 'verso_data, verso_mime',
      filters: { course_id: courseId },
      single: true
    })
    if (!template?.verso_data) return c.json({ error: 'Verso não encontrado' }, 404)
    const binary = Uint8Array.from(atob(template.verso_data), ch => ch.charCodeAt(0))
    return new Response(binary, {
      headers: { 'Content-Type': template.verso_mime || 'image/jpeg', 'Cache-Control': 'public, max-age=86400' }
    })
  } catch {
    return c.json({ error: 'Erro ao buscar verso' }, 500)
  }
})

// Get certificate template for a course
app.get('/api/certificate-template/:courseId', async (c) => {
  try {
    const courseId = c.req.param('courseId')
    const db = getDB(c)

    const template = await db.query('certificate_templates', {
      select: 'id, course_id, template_mime, verso_mime, created_at, updated_at',
      filters: { course_id: courseId },
      single: true
    })

    if (template) {
      template.template_url = `/api/certificate-template/${courseId}/image`
      // Check if verso exists via a separate lightweight query
      const versoCheck = await db.query('certificate_templates', {
        select: 'verso_data',
        filters: { course_id: courseId },
        single: true
      })
      template.verso_url = versoCheck?.verso_data
        ? `/api/certificate-template/${courseId}/verso`
        : null
    }

    return c.json({ template })
  } catch (error) {
    return c.json({ template: null })
  }
})

// Generate certificate for user (automatic when course is 100% complete)
app.post('/api/certificates/generate', async (c) => {
  try {
    const token = getCookie(c, 'sb-access-token')
    
    if (!token) {
      return c.json({ error: 'Não autenticado' }, 401)
    }
    
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 401)
    }
    
    const { course_id } = await c.req.json()
    
    console.log('📜 Certificate generation request:', { 
      user_email: user.email, 
      course_id 
    })
    
    if (!course_id) {
      return c.json({ error: 'ID do curso é obrigatório' }, 400)
    }
    
    const db = getDB(c)
    
    // Check if certificate already exists
    const existing = await db.query('certificates', {
      select: '*',
      filters: { 
        user_email: user.email, 
        course_id 
      }
    })
    
    if (existing && existing.length > 0) {
      console.log('✅ Certificate already exists')
      return c.json({ 
        success: true,
        certificate: existing[0],
        message: 'Certificado já existe!'
      })
    }
    
    // Verify user has completed 100% of the course
    const course = await db.query('courses', {
      select: '*',
      filters: { id: course_id },
      single: true
    })
    
    if (!course) {
      return c.json({ error: 'Curso não encontrado' }, 404)
    }
    
    // Get all lessons in the course
    const modules = await db.query('modules', {
      select: '*',
      filters: { course_id }
    })
    
    let allLessonIds: number[] = []
    if (modules) {
      for (const module of modules) {
        const lessons = await db.query('lessons', {
          select: 'id',
          filters: { module_id: module.id }
        })
        if (lessons) {
          allLessonIds = [...allLessonIds, ...lessons.map((l: any) => l.id)]
        }
      }
    }
    
    if (allLessonIds.length === 0) {
      return c.json({ error: 'Curso não possui aulas' }, 400)
    }
    
    // Check user progress
    const progress = await db.query('user_progress', {
      select: '*',
      filters: { user_email: user.email }
    }) || []
    
    const completedLessonIds = progress
      .filter((p: any) => p.completed && allLessonIds.includes(p.lesson_id))
      .map((p: any) => p.lesson_id)
    
    const completionPercentage = (completedLessonIds.length / allLessonIds.length) * 100
    
    console.log('📊 Course completion:', {
      total_lessons: allLessonIds.length,
      completed_lessons: completedLessonIds.length,
      percentage: completionPercentage
    })
    
    if (completionPercentage < 100) {
      return c.json({ 
        error: 'Você precisa completar 100% do curso para receber o certificado',
        completion: completionPercentage
      }, 400)
    }
    
    // Generate certificate
    const certificate = await db.insert('certificates', {
      user_email: user.email,
      user_name: user.user_metadata?.name || 'Aluno',
      course_id: parseInt(course_id),
      course_title: course.title,
      issued_at: new Date().toISOString(),
      completion_date: new Date().toISOString()
    })
    
    console.log('✅ Certificate generated successfully')
    
    return c.json({ 
      success: true,
      certificate,
      message: 'Parabéns! Seu certificado foi gerado com sucesso!'
    })
  } catch (error: any) {
    console.error('💥 Certificate generation error:', error)
    console.error('Error details:', error.message)
    
    // Check if it's a table not found error
    if (error.message?.includes('certificates') || error.message?.includes('relation')) {
      return c.json({ 
        error: 'Tabela de certificados não encontrada. Execute a migração SQL no Supabase.',
        details: error.message
      }, 500)
    }
    
    return c.json({ 
      error: 'Erro ao gerar certificado',
      details: error.message 
    }, 500)
  }
})

// Get user certificates
app.get('/api/certificates', async (c) => {
  try {
    const token = getCookie(c, 'sb-access-token')
    
    if (!token) {
      return c.json({ error: 'Não autenticado' }, 401)
    }
    
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 401)
    }
    
    const db = getDB(c)
    
    const certificates = await db.query('certificates', {
      select: '*',
      filters: { user_email: user.email },
      order: 'issued_at DESC'
    }) || []
    
    // Get certificate templates for each certificate
    const certificatesWithTemplates = await Promise.all(
      certificates.map(async (cert: any) => {
        const template = await db.query('certificate_templates', {
          select: '*',
          filters: { course_id: cert.course_id },
          single: true
        })
        return {
          ...cert,
          template_url: template?.template_url || null
        }
      })
    )
    
    return c.json({ certificates: certificatesWithTemplates })
  } catch (error) {
    console.error('💥 Certificates fetch error:', error)
    return c.json({ error: 'Erro ao buscar certificados' }, 500)
  }
})

// Get specific certificate
app.get('/api/certificates/:id', async (c) => {
  try {
    const certId = c.req.param('id')
    
    const db = getDB(c)
    
    const certificate = await db.query('certificates', {
      select: '*',
      filters: { id: certId },
      single: true
    })
    
    if (!certificate) {
      return c.json({ error: 'Certificado não encontrado' }, 404)
    }
    
    // Get template
    const template = await db.query('certificate_templates', {
      select: '*',
      filters: { course_id: certificate.course_id },
      single: true
    })
    
    return c.json({ 
      certificate: {
        ...certificate,
        template_url: template?.template_url || null
      }
    })
  } catch (error) {
    return c.json({ error: 'Erro ao buscar certificado' }, 500)
  }
})

// ============================================
// API ROUTES - PLANS & SUBSCRIPTIONS
// ============================================

// Get all active plans
app.get('/api/plans', async (c) => {
  try {
    const db = getDB(c)
    
    const plans = await db.query('plans', {
      select: '*',
      filters: { is_active: true },
      order: 'display_order'
    }) || []
    
    return c.json({ plans })
  } catch (error) {
    return c.json({ error: 'Erro ao buscar planos' }, 500)
  }
})

// Get user's current subscription
app.get('/api/subscriptions/current', async (c) => {
  try {
    const token = getCookie(c, 'sb-access-token')
    
    if (!token) {
      return c.json({ subscription: null })
    }
    
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (!user) {
      return c.json({ subscription: null })
    }
    
    const db = getDB(c)
    
    // Get user's active subscription with plan details
    const sqlQuery = `
      SELECT s.*, p.name as plan_name, p.monthly_price, p.duration_days
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_email = $1 AND s.status = 'active'
      ORDER BY s.end_date DESC
      LIMIT 1
    `
    const result = await db.sql(sqlQuery, [user.email])
    
    return c.json({ subscription: result && result.length > 0 ? result[0] : null })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return c.json({ subscription: null })
  }
})

// Create or update subscription (Admin only for now)
app.post('/api/admin/subscriptions', requireAdmin, async (c) => {
  try {
    const { user_email, plan_id, duration_days } = await c.req.json()

    if (!user_email || !plan_id) {
      return c.json({ error: 'Email e plano são obrigatórios' }, 400)
    }

    const db = getDB(c)

    // Get plan details
    const plan = await db.query('plans', {
      select: '*',
      filters: { id: plan_id },
      single: true
    })

    if (!plan) {
      return c.json({ error: 'Plano não encontrado' }, 404)
    }

    // Calculate expiration date
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + (duration_days || plan.duration_days))
    const endDateISO = endDate.toISOString()

    // Insert into member_subscriptions (used for access control)
    const subscription = await db.insert('member_subscriptions', {
      email_membro: user_email,
      data_expiracao: endDateISO,
      detalhe: plan.name,
      origem: 'admin',
      teste_gratis: plan.is_free_trial || false,
      ativo: true
    })

    // Also update users.dt_expiracao to keep in sync
    const users = await db.query('users', {
      select: 'id',
      filters: { email: user_email },
      single: true
    })
    if (users) {
      await db.update('users', { id: users.id }, {
        dt_expiracao: endDateISO,
        updated_at: new Date().toISOString()
      })
    }

    return c.json({
      success: true,
      message: 'Assinatura criada com sucesso!',
      subscription: subscription[0]
    })
  } catch (error: any) {
    console.error('Error creating subscription:', error)
    return c.json({ error: 'Erro ao criar assinatura' }, 500)
  }
})

// Check if user has access to a specific lesson
app.get('/api/lessons/:id/access', async (c) => {
  try {
    const lessonId = c.req.param('id')
    const token = getCookie(c, 'sb-access-token')
    
    if (!token) {
      // Not logged in - check if lesson is teste_gratis
      const db = getDB(c)
      const lesson = await db.query('lessons', {
        select: 'teste_gratis',
        filters: { id: lessonId },
        single: true
      })
      
      return c.json({ 
        hasAccess: lesson?.teste_gratis || false,
        reason: lesson?.teste_gratis ? 'free_lesson' : 'not_authenticated'
      })
    }
    
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (!user) {
      return c.json({ hasAccess: false, reason: 'invalid_token' })
    }
    
    const db = getDB(c)
    
    // Use the database function to check access
    const accessRows = await db.sql(
      `SELECT user_has_lesson_access($1::text, $2::integer) AS has_access`,
      [user.email, parseInt(lessonId)]
    )
    let hasAccess = !!accessRows[0]?.has_access
    
    // Fallback: verificar suiteplus (produto ID 4) se ainda sem acesso
    if (!hasAccess) {
      const suiteplusConn = c.env.DATABASE_SUITEPLUS
      if (suiteplusConn) {
        const suiteplusExpires = await getSuiteplusExpiration(user.email, suiteplusConn)
        if (suiteplusExpires && suiteplusExpires > new Date()) {
          hasAccess = true
        }
      }
    }

    return c.json({
      hasAccess,
      reason: hasAccess ? 'active_subscription' : 'no_active_subscription'
    })
  } catch (error) {
    console.error('Error checking lesson access:', error)
    return c.json({ hasAccess: false, reason: 'error' }, 500)
  }
})

// Expire subscriptions (can be called by cron job)
app.post('/api/admin/subscriptions/expire', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    
    await db.rpc('expire_subscriptions', {})
    
    return c.json({ 
      success: true,
      message: 'Assinaturas expiradas com sucesso!'
    })
  } catch (error) {
    console.error('Error expiring subscriptions:', error)
    return c.json({ error: 'Erro ao expirar assinaturas' }, 500)
  }
})

// Admin: Get all plans (including inactive)
app.get('/api/admin/plans', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    
    const plans = await db.query('plans', {
      select: '*',
      order: 'display_order'
    }) || []
    
    return c.json({ plans })
  } catch (error) {
    return c.json({ error: 'Erro ao buscar planos' }, 500)
  }
})

// Admin: Create or update plan
app.post('/api/admin/plans', requireAdmin, async (c) => {
  try {
    const data = await c.req.json()
    const { id, name, description, price, duration_days, is_active, is_free_trial, features, display_order } = data
    
    const db = getDB(c)
    
    if (id) {
      // Update existing plan
      await db.update('plans', { id }, {
        name,
        description,
        price: parseFloat(price),
        duration_days: parseInt(duration_days),
        is_active,
        is_free_trial,
        features: features || [],
        display_order: parseInt(display_order || 0),
        updated_at: new Date().toISOString()
      })
      
      return c.json({ success: true, message: 'Plano atualizado!' })
    } else {
      // Create new plan
      const plan = await db.insert('plans', {
        name,
        description,
        price: parseFloat(price),
        duration_days: parseInt(duration_days),
        is_active,
        is_free_trial,
        features: features || [],
        display_order: parseInt(display_order || 0)
      })
      
      return c.json({ success: true, plan: plan[0], message: 'Plano criado!' })
    }
  } catch (error) {
    console.error('Error saving plan:', error)
    return c.json({ error: 'Erro ao salvar plano' }, 500)
  }
})

// Admin: Get all subscriptions
app.get('/api/admin/subscriptions', requireAdmin, async (c) => {
  try {
    const db = getDB(c)
    
    const subscriptions = await db.query('subscriptions', {
      select: '*',
      order: 'created_at DESC'
    }) || []
    
    // Get plan details for each subscription
    const subscriptionsWithPlans = await Promise.all(
      subscriptions.map(async (sub: any) => {
        const plan = await db.query('plans', {
          select: '*',
          filters: { id: sub.plan_id },
          single: true
        })
        return {
          ...sub,
          plan_name: plan?.name || 'Desconhecido'
        }
      })
    )
    
    return c.json({ subscriptions: subscriptionsWithPlans })
  } catch (error) {
    return c.json({ error: 'Erro ao buscar assinaturas' }, 500)
  }
})

// ============================================
// FRONTEND - Main page
// ============================================

// Direct recovery handler - extracts token from any malformed URL
app.get('/recover', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div class="text-center mb-6">
            <div class="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-key text-4xl text-blue-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Recuperar Senha</h1>
            <p class="text-gray-600">
                Cole o link completo que você recebeu no email abaixo
            </p>
        </div>
        
        <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
                Link do Email:
            </label>
            <textarea 
                id="recoveryLink"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                rows="4"
                placeholder="Cole aqui o link completo do email..."></textarea>
        </div>
        
        <button 
            onclick="extractToken()"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-4">
            <i class="fas fa-magic mr-2"></i>
            Extrair Token e Continuar
        </button>
        
        <div id="result" class="hidden"></div>
        
        <div class="mt-6 text-center">
            <a href="/" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                <i class="fas fa-arrow-left mr-1"></i> Voltar ao login
            </a>
        </div>
    </div>
    
    <script>
        // Check if we have token in hash already
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
            window.location.href = '/reset-password' + hash
        }
        
        function extractToken() {
            const link = document.getElementById('recoveryLink').value.trim()
            const resultDiv = document.getElementById('result')
            
            if (!link) {
                resultDiv.className = 'bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm'
                resultDiv.textContent = '❌ Por favor, cole o link do email'
                resultDiv.classList.remove('hidden')
                return
            }
            
            // Try to extract access_token from the link
            const tokenMatch = link.match(/access_token=([^&]+)/)
            const typeMatch = link.match(/type=([^&]+)/)
            const refreshMatch = link.match(/refresh_token=([^&]+)/)
            
            if (tokenMatch && typeMatch && typeMatch[1] === 'recovery') {
                const accessToken = tokenMatch[1]
                const refreshToken = refreshMatch ? refreshMatch[1] : ''
                
                resultDiv.className = 'bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm'
                resultDiv.innerHTML = '✅ Token extraído! Redirecionando...'
                resultDiv.classList.remove('hidden')
                
                // Redirect with clean token
                setTimeout(() => {
                    window.location.href = \`/reset-password#access_token=\${accessToken}&refresh_token=\${refreshToken}&type=recovery\`
                }, 1000)
            } else {
                resultDiv.className = 'bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm'
                resultDiv.innerHTML = '❌ Link inválido ou token não encontrado.<br><br>Certifique-se de colar o link completo do email.'
                resultDiv.classList.remove('hidden')
            }
        }
    </script>
</body>
</html>
  `)
})

// Password Reset Page
app.get('/reset-password', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white text-center">
            <i class="fas fa-key text-5xl mb-3"></i>
            <h1 class="text-2xl font-bold">Redefinir Senha</h1>
            <p class="text-blue-200 text-sm mt-2">CCT - Clube do Cálculo Trabalhista</p>
        </div>
        
        <div class="p-8">
            <div id="messageDiv" class="hidden mb-4 p-3 rounded-lg text-sm"></div>
            
            <form id="resetForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-lock mr-1"></i> Nova Senha
                    </label>
                    <input type="password" 
                           id="newPassword" 
                           required
                           minlength="6"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Mínimo 6 caracteres">
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-lock mr-1"></i> Confirmar Senha
                    </label>
                    <input type="password" 
                           id="confirmPassword" 
                           required
                           minlength="6"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Digite a senha novamente">
                </div>
                
                <button type="submit" 
                        id="submitBtn"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-check"></i>
                    Redefinir Senha
                </button>
            </form>
            
            <div class="mt-6 text-center">
                <a href="/" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                    <i class="fas fa-arrow-left mr-1"></i> Voltar ao login
                </a>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        // Get access token from URL hash
        const hash = window.location.hash
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const type = params.get('type')
        
        const messageDiv = document.getElementById('messageDiv')
        const form = document.getElementById('resetForm')
        const submitBtn = document.getElementById('submitBtn')
        
        function showMessage(message, isError = false) {
            messageDiv.textContent = message
            messageDiv.classList.remove('hidden', 'bg-red-50', 'border-red-200', 'text-red-700', 'bg-green-50', 'border-green-200', 'text-green-700')
            
            if (isError) {
                messageDiv.classList.add('bg-red-50', 'border', 'border-red-200', 'text-red-700')
            } else {
                messageDiv.classList.add('bg-green-50', 'border', 'border-green-200', 'text-green-700')
            }
        }
        
        // Check if we have a valid token
        if (!accessToken || type !== 'recovery') {
            showMessage('❌ Link inválido ou expirado. Por favor, solicite um novo link de recuperação.', true)
            form.classList.add('hidden')
        }
        
        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const newPassword = document.getElementById('newPassword').value
            const confirmPassword = document.getElementById('confirmPassword').value
            
            if (newPassword !== confirmPassword) {
                showMessage('❌ As senhas não coincidem. Por favor, tente novamente.', true)
                return
            }
            
            if (newPassword.length < 6) {
                showMessage('❌ A senha deve ter pelo menos 6 caracteres.', true)
                return
            }
            
            // Disable submit button
            submitBtn.disabled = true
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...'
            
            try {
                const response = await axios.post('/api/auth/reset-password', {
                    token: accessToken,
                    password: newPassword
                })
                
                if (response.data.success) {
                    showMessage('✅ ' + response.data.message, false)
                    form.classList.add('hidden')
                    
                    // Redirect to home after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao redefinir senha. Tente novamente.'
                showMessage('❌ ' + errorMessage, true)
                
                // Re-enable submit button
                submitBtn.disabled = false
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Redefinir Senha'
            }
        })
    </script>
</body>
</html>
  `)
})

// Test page for Continue Learning feature
app.get('/test-continue', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testar "Continue de Onde Parou"</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">
            🧪 Testar "Continue de Onde Parou"
        </h1>
        
        <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-3">Status Atual:</h2>
            <div id="status" class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-600">Carregando...</p>
            </div>
        </div>
        
        <div class="space-y-4">
            <button onclick="setTestData()" 
                    class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                ✅ Adicionar Dados de Teste
            </button>
            
            <button onclick="clearData()" 
                    class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                🗑️ Limpar Dados
            </button>
            
            <button onclick="checkData()" 
                    class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                🔍 Verificar Dados
            </button>
            
            <a href="/" 
               class="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-center">
                🏠 Voltar à Página Principal
            </a>
        </div>
        
        <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 class="font-semibold text-yellow-800 mb-2">💡 Como funciona:</h3>
            <ol class="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                <li>Clique em "Adicionar Dados de Teste" para simular uma aula visitada</li>
                <li>Volte à página principal</li>
                <li>O banner "Continue de onde parou" deve aparecer no topo</li>
                <li>Use "Limpar Dados" para resetar</li>
            </ol>
        </div>
    </div>
    
    <script>
        function setTestData() {
            const testData = {
                lessonId: 1,
                lessonTitle: "Bem-vindo ao CCT",
                moduleName: "Introdução aos Cálculos Trabalhistas",
                courseName: "Curso Completo de Cálculos Trabalhistas",
                timestamp: Date.now()
            }
            
            localStorage.setItem('lastAccessedLesson', JSON.stringify(testData))
            
            alert('✅ Dados de teste adicionados!\\n\\nAgora volte à página principal para ver o banner.')
            checkData()
        }
        
        function clearData() {
            localStorage.removeItem('lastAccessedLesson')
            alert('🗑️ Dados removidos!')
            checkData()
        }
        
        function checkData() {
            const data = localStorage.getItem('lastAccessedLesson')
            const statusDiv = document.getElementById('status')
            
            if (data) {
                const parsed = JSON.parse(data)
                statusDiv.innerHTML = \`
                    <div class="text-green-700">
                        <p class="font-semibold mb-2">✅ Dados encontrados:</p>
                        <pre class="text-xs bg-white p-3 rounded border border-green-200 overflow-auto">\${JSON.stringify(parsed, null, 2)}</pre>
                    </div>
                \`
            } else {
                statusDiv.innerHTML = \`
                    <p class="text-red-600 font-semibold">
                        ❌ Nenhum dado encontrado no localStorage
                    </p>
                    <p class="text-sm text-gray-600 mt-2">
                        Para que o banner apareça, você precisa:
                        <br>1. Adicionar dados de teste (botão acima), ou
                        <br>2. Acessar qualquer aula na aplicação
                    </p>
                \`
            }
        }
        
        // Check on load
        checkData()
    </script>
</body>
</html>
  `)
})

app.get('/admin', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <title>Admin — CCT</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen">
  <header class="bg-purple-700 text-white px-4 py-3 flex items-center gap-4 shadow">
    <a href="/" class="flex items-center gap-2 text-purple-200 hover:text-white transition-colors text-sm font-semibold">
      <i class="fas fa-arrow-left"></i>
      <span>Voltar ao site</span>
    </a>
    <span class="text-purple-300">|</span>
    <span class="font-bold text-lg"><i class="fas fa-tools mr-2"></i>Painel Admin</span>
  </header>
  <main>
    <div id="loadingAdmin" class="text-center py-16">
      <i class="fas fa-spinner fa-spin text-4xl text-purple-500"></i>
      <p class="mt-4 text-gray-500">Carregando painel admin...</p>
    </div>
    <div id="adminView" class="hidden"></div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="/static/auth.js?v=whatsapp-floating-20260602"></script>
  <script src="/static/admin.js?v=9"></script>
  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      const isAdmin = await adminManager.checkAdmin()
      document.getElementById('loadingAdmin').remove()
      if (!isAdmin) {
        document.querySelector('main').innerHTML = \`
          <div class="text-center py-16">
            <i class="fas fa-lock text-4xl text-red-400"></i>
            <p class="mt-4 text-red-600 font-semibold">Acesso negado. Você não tem permissão de administrador.</p>
            <a href="/" class="mt-6 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Voltar ao site</a>
          </div>\`
        return
      }
      document.getElementById('adminView').classList.remove('hidden')
      await adminUI.loadData()
      adminUI.renderAdminPanel()
    })
  </script>
</body>
</html>`)
})

// Deep-link routes: serve SPA so the frontend can read the URL and navigate directly
app.get('/aula/:id', (c) => c.redirect(`/?aula=${c.req.param('id')}`))
app.get('/curso/:id', (c) => c.redirect(`/?curso=${c.req.param('id')}`))

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light only">
        <title>CCT - Clube do Cálculo Trabalhista</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          /* Module and Lesson Styles */
          .lesson-item:hover { background-color: #f3f4f6; }
          .completed { background-color: #d1fae5 !important; }
          .module-header { cursor: pointer; }
          .module-content { display: none; }
          .module-content.active { display: block; }
          
          /* Premium Locked Lessons */
          .premium-locked {
            cursor: not-allowed !important;
            background-color: #fef3f2 !important;
            border-color: #fecaca !important;
          }
          .premium-locked:hover {
            background-color: #fee2e2 !important;
            transform: scale(1.02);
          }
          
          /* Markdown rendered content */
          .md-body h1 { font-size: 1.4em; font-weight: 700; margin: 1em 0 .4em; color: #1e293b; }
          .md-body h2 { font-size: 1.2em; font-weight: 700; margin: 1em 0 .4em; color: #1e293b; }
          .md-body h3 { font-size: 1.05em; font-weight: 600; margin: .8em 0 .3em; color: #334155; }
          .md-body p  { margin: .5em 0; }
          .md-body ul, .md-body ol { padding-left: 1.4em; margin: .5em 0; }
          .md-body ul { list-style: disc; }
          .md-body ol { list-style: decimal; }
          .md-body li { margin: .25em 0; }
          .md-body strong { font-weight: 700; }
          .md-body em { font-style: italic; }
          .md-body blockquote { border-left: 4px solid #a855f7; background: #faf5ff; padding: .5em 1em; margin: .75em 0; border-radius: 0 .5em .5em 0; color: #6b21a8; }
          .md-body code { background: #f1f5f9; padding: .1em .3em; border-radius: .25em; font-size: .9em; font-family: monospace; }
          .md-body pre { background: #1e293b; color: #e2e8f0; padding: 1em; border-radius: .5em; overflow-x: auto; margin: .75em 0; }
          .md-body pre code { background: none; padding: 0; color: inherit; }
          .md-body hr { border: none; border-top: 1px solid #e2e8f0; margin: 1em 0; }

          /* Line Clamp Utilities */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          /* Card Hover Effects - Only on non-touch devices */
          @media (hover: hover) {
            .group:hover .group-hover\\:scale-110 {
              transform: scale(1.1);
            }
            .group:hover .group-hover\\:gap-2 {
              gap: 0.5rem;
            }
          }
          
          /* Smooth Animations */
          * {
            transition-property: color, background-color, border-color, opacity, transform, box-shadow;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 0ms;
          }
          
          /* Mobile Responsive Utilities */
          @media (max-width: 640px) {
            .mobile-hide { display: none !important; }
            .mobile-text-sm { font-size: 0.875rem; }
            .mobile-text-xs { font-size: 0.75rem; }
            .mobile-p-4 { padding: 1rem; }
            .mobile-gap-2 { gap: 0.5rem; }
          }
          
          /* Video Container Responsive */
          .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
          }
          .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-4 md:py-6">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <!-- Logo/Title -->
                    <div class="flex-shrink-0">
                        <a href="/" class="flex items-center gap-3 md:gap-4 hover:opacity-90 transition-opacity">
                            <!-- Logo -->
                            <img src="https://page.gensparksite.com/v1/base64_upload/8f96be1bcec5a62130e0023674c921df"
                                 alt="CCT Logo"
                                 class="h-12 md:h-16 w-auto">

                            <!-- Title -->
                            <div>
                                <h1 class="text-lg md:text-2xl font-bold">
                                    <span class="hidden sm:inline">CCT - Clube do Cálculo Trabalhista</span>
                                    <span class="sm:hidden">CCT</span>
                                </h1>
                                <p class="text-blue-200 mt-1 text-xs md:text-sm hidden sm:block">Domine os cálculos da Justiça do Trabalho</p>
                            </div>
                        </a>
                    </div>
                    
                    <!-- User Menu -->
                    <div class="flex items-center gap-2 md:gap-4">
                        <!-- User Info - Hidden on very small screens -->
                        <div class="hidden md:flex items-center gap-2">
                            <i class="fas fa-user-circle text-2xl"></i>
                            <div>
                                <p class="text-xs">Bem-vindo,</p>
                                <p class="font-semibold text-sm" id="userName">Aluno</p>
                            </div>
                        </div>

                        <!-- Credits Badge -->
                        <div id="creditsDisplay" class="hidden items-center gap-2 bg-green-600/30 border border-green-500/40 rounded-xl px-3 py-2">
                            <i class="fas fa-coins text-yellow-300 text-sm"></i>
                            <div>
                                <p class="text-xs text-green-200 leading-none mb-0.5">Créditos</p>
                                <p class="text-sm font-bold text-white leading-none" id="userCredits">
                                    <span class="inline-block w-8 h-3 bg-white/20 rounded animate-pulse"></span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Search Button -->
                        <button onclick="app.showSearch(this)" 
                                class="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs md:text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="fas fa-search"></i>
                            <span class="hidden sm:inline ml-2">Buscar</span>
                        </button>
                        
                        <!-- Trails Button -->
                        <button onclick="app.showTrails()"
                                class="px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-route"></i>
                            <span class="hidden sm:inline ml-2">Trilhas</span>
                        </button>
                        
                        <!-- Rentals Button -->
                        <button onclick="app.showRentals()"
                                class="px-3 md:px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-key"></i>
                            <span class="hidden sm:inline ml-2">Alugadas</span>
                        </button>

                        <!-- Favorites Button -->
                        <button onclick="window.location.href='/favorites'"
                                class="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-heart"></i>
                            <span class="hidden sm:inline ml-2">Favoritos</span>
                        </button>

                        <!-- Certificates Button -->
                        <button onclick="window.location.href='/certificates'"
                                class="px-3 md:px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-certificate"></i>
                            <span class="hidden sm:inline ml-2">Certificados</span>
                        </button>
                        
                        <!-- Profile Button -->
                        <button onclick="window.location.href='/profile'" 
                                class="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-user-circle"></i>
                            <span class="hidden sm:inline ml-2">Perfil</span>
                        </button>
                        
                        <!-- Admin Button -->
                        <button onclick="window.open('/admin', '_blank')"
                                id="adminButton"
                                class="hidden px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-tools"></i>
                            <span class="hidden sm:inline ml-2">Admin</span>
                        </button>
                        
                        <!-- Logout Button -->
                        <button onclick="app.logout()" 
                                class="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-sign-out-alt"></i>
                            <span class="hidden sm:inline ml-2">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <!-- View: Courses List -->
            <div id="coursesView">
                <!-- Courses Grid -->
                <div id="coursesList" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    <!-- Courses will be loaded here -->
                </div>
            </div>

            <!-- View: Course Detail -->
            <div id="courseView" class="hidden">
                <button onclick="app.showCourses()" class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i> Voltar aos cursos
                </button>
                <div id="courseDetail">
                    <!-- Course details will be loaded here -->
                </div>
            </div>

            <!-- View: Lesson Detail -->
            <div id="lessonView" class="hidden">
                <button onclick="app.backToCourse()" class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i> Voltar ao curso
                </button>
                <div id="lessonDetail">
                    <!-- Lesson details will be loaded here -->
                </div>
            </div>
            
            <!-- View: Search -->
            <div id="searchView" class="hidden">
                <button onclick="app.showCourses()" 
                        class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i> Voltar aos cursos
                </button>
                
                <!-- Search Header -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div class="flex items-center gap-4 mb-6">
                        <i class="fas fa-search text-3xl text-purple-600"></i>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">Busca Inteligente de Aulas</h2>
                            <p class="text-gray-600">Encontre rapidamente a aula que você precisa</p>
                        </div>
                    </div>
                    
                    <!-- Search Input -->
                    <div class="relative mb-6">
                        <input type="text" 
                               id="searchInput" 
                               placeholder="Digite palavras-chave (ex: liquidação, horas extras, FGTS...)"
                               class="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg">
                        <i class="fas fa-search absolute left-4 top-4 text-gray-400 text-xl"></i>
                    </div>
                    
                    <!-- Filters Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <!-- Course Filter -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-book mr-2"></i>Curso
                            </label>
                            <select id="courseFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                                <option value="">Todos os cursos</option>
                            </select>
                        </div>
                        
                        <!-- Type Filter -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-filter mr-2"></i>Tipo
                            </label>
                            <select id="typeFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                                <option value="all">Todas</option>
                                <option value="free">Apenas Grátis</option>
                                <option value="premium">Apenas Premium</option>
                                <option value="rented">Minhas Alugadas</option>
                            </select>
                        </div>
                        
                        <!-- Duration Filter -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-clock mr-2"></i>Duração
                            </label>
                            <select id="durationFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                                <option value="0-120">Qualquer duração</option>
                                <option value="0-10">Até 10 min</option>
                                <option value="10-30">10-30 min</option>
                                <option value="30-60">30-60 min</option>
                                <option value="60-999">Mais de 1 hora</option>
                            </select>
                        </div>
                        
                        <!-- Sort Filter -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-sort mr-2"></i>Ordenar por
                            </label>
                            <select id="sortFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                                <option value="relevance">Relevância</option>
                                <option value="title">Título (A-Z)</option>
                                <option value="duration">Duração</option>
                                <option value="date">Mais recentes</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Results Count -->
                    <div class="mt-4 flex items-center justify-between">
                        <p id="resultsCount" class="text-gray-600 font-semibold"></p>
                        <button onclick="searchManager.clearSearch()" 
                                class="text-sm text-purple-600 hover:text-purple-800 font-semibold">
                            <i class="fas fa-redo mr-1"></i>Limpar filtros
                        </button>
                    </div>
                </div>
                
                <!-- Search Results -->
                <div id="searchResults" class="space-y-4">
                    <!-- Results will be rendered here -->
                </div>
            </div>
        </main>

        <script defer src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <script defer src="/static/auth.js?v=whatsapp-floating-20260602"></script>
        <script defer src="/static/admin.js?v=9"></script>
        <script defer src="/static/access-control.js?v=4"></script>
        <script defer src="/static/app.js?v=20"></script>
        <script defer src="/static/search.js?v=4"></script>
    </body>
    </html>
  `)
})

// ── Direct URL navigation: /course/:id and /lesson/:id ──────────────────────
// These routes allow sharing direct links to courses and lessons.
// Server returns a lightweight redirect page; the JS client handles navigation.
app.get('/course/:courseId', (c) => {
  const courseId = c.req.param('courseId')
  return c.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="light only">
<title>CCT - Abrindo aula...</title>
<style>body{margin:0;background:#1e3a8a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:white}</style>
</head>
<body>
<script>
(function() {
  var hash = window.location.hash;
  var lessonId = hash.startsWith('#lesson-') ? hash.slice(8) : '';
  if (lessonId) {
    window.location.replace('/?lesson=' + encodeURIComponent(lessonId));
  } else {
    window.location.replace('/?course=' + encodeURIComponent('${courseId}'));
  }
})();
</script>
<p>Abrindo aula...</p>
</body>
</html>`)
})

app.get('/lesson/:lessonId', (c) => {
  const lessonId = c.req.param('lessonId')
  return c.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="light only">
<title>CCT - Abrindo aula...</title>
<style>body{margin:0;background:#1e3a8a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:white}</style>
</head>
<body>
<script>window.location.replace('/?lesson=' + encodeURIComponent('${lessonId}'));</script>
<p>Abrindo aula...</p>
</body>
</html>`)
})

// ── Favorites APIs ──────────────────────────────────────────────────────────

// GET /api/favorites — lista os favoritos do usuário logado
app.get('/api/favorites', requireAuth, async (c) => {
  const user = c.get('user') as { email: string }
  const db = getDB(c)
  try {
    const rows = await db.sql(`
      SELECT f.id, f.lesson_id, f.created_at,
             l.title AS lesson_title,
             c.title AS course_title,
             c.id    AS course_id
      FROM user_favorites f
      JOIN lessons l ON l.id = f.lesson_id
      JOIN modules m ON m.id = l.module_id
      JOIN courses c ON c.id = m.course_id
      WHERE f.user_email = $1
      ORDER BY f.created_at DESC
    `, [user.email])
    return c.json(rows)
  } finally {
    await db.end()
  }
})

// POST /api/favorites — adiciona favorito { lesson_id }
app.post('/api/favorites', requireAuth, async (c) => {
  const user = c.get('user') as { email: string }
  const body = await c.req.json<{ lesson_id: number }>()
  if (!body.lesson_id) return c.json({ error: 'lesson_id required' }, 400)

  const db = getDB(c)
  try {
    await db.sql(
      `INSERT INTO user_favorites (user_email, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user.email, body.lesson_id]
    )
    return c.json({ ok: true })
  } finally {
    await db.end()
  }
})

// DELETE /api/favorites/:lessonId — remove favorito
app.delete('/api/favorites/:lessonId', requireAuth, async (c) => {
  const user = c.get('user') as { email: string }
  const lessonId = parseInt(c.req.param('lessonId'))
  const db = getDB(c)
  try {
    await db.sql(
      `DELETE FROM user_favorites WHERE user_email = $1 AND lesson_id = $2`,
      [user.email, lessonId]
    )
    return c.json({ ok: true })
  } finally {
    await db.end()
  }
})

// GET /api/favorites/check/:lessonId — verifica se uma aula é favorita
app.get('/api/favorites/check/:lessonId', requireAuth, async (c) => {
  const user = c.get('user') as { email: string }
  const lessonId = parseInt(c.req.param('lessonId'))
  const db = getDB(c)
  try {
    const rows = await db.sql(
      `SELECT id FROM user_favorites WHERE user_email = $1 AND lesson_id = $2 LIMIT 1`,
      [user.email, lessonId]
    )
    return c.json({ favorite: rows.length > 0 })
  } finally {
    await db.end()
  }
})

// ── Favorites page ──────────────────────────────────────────────────────────
app.get('/favorites', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aulas Favoritas - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
<div class="min-h-screen">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <a href="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <span class="text-blue-900 font-bold text-sm">CCT</span>
                        </div>
                        <div>
                            <h1 class="text-lg font-bold">CCT</h1>
                            <p class="text-blue-200 text-xs">Clube do Cálculo Trabalhista</p>
                        </div>
                    </a>
                </div>
                <nav class="flex items-center gap-4">
                    <a href="/" class="text-blue-200 hover:text-white text-sm transition-colors">
                        <i class="fas fa-home mr-1"></i>Início
                    </a>
                    <a href="/certificates" class="text-blue-200 hover:text-white text-sm transition-colors">
                        <i class="fas fa-certificate mr-1"></i>Certificados
                    </a>
                    <div id="userInfo" class="flex items-center gap-2">
                        <span id="userName" class="text-sm text-blue-200"></span>
                        <button onclick="logout()" class="text-xs bg-blue-800 hover:bg-blue-600 px-3 py-1 rounded transition-colors">Sair</button>
                    </div>
                </nav>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <div class="flex items-center gap-3 mb-6">
            <i class="fas fa-heart text-red-500 text-2xl"></i>
            <h2 class="text-2xl font-bold text-gray-800">Aulas Favoritas</h2>
        </div>

        <!-- Course filter pills -->
        <div id="courseFilters" class="flex flex-wrap gap-2 mb-6"></div>

        <!-- Favorites grid -->
        <div id="favoritesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="col-span-full text-center py-12 text-gray-400">
                <i class="fas fa-spinner fa-spin text-3xl mb-3"></i>
                <p>Carregando favoritos...</p>
            </div>
        </div>
    </main>
</div>

<script defer src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script defer src="/static/auth.js?v=whatsapp-floating-20260602"></script>
<script>
let allFavorites = []
let activeFilter = null

function renderFilters() {
    const courses = [...new Map(allFavorites.map(f => [f.course_id, f.course_title])).entries()]
    const container = document.getElementById('courseFilters')
    if (courses.length === 0) { container.innerHTML = ''; return }

    const allBtn = document.createElement('button')
    allBtn.textContent = 'Todos'
    allBtn.className = 'px-4 py-1.5 rounded-full text-sm font-medium transition-colors ' + (activeFilter === null ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border hover:bg-gray-100')
    allBtn.onclick = () => { activeFilter = null; renderFilters(); renderFavorites(allFavorites) }
    container.innerHTML = ''
    container.appendChild(allBtn)

    for (const [id, title] of courses) {
        const btn = document.createElement('button')
        btn.textContent = title
        btn.className = 'px-4 py-1.5 rounded-full text-sm font-medium transition-colors ' + (activeFilter === id ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border hover:bg-gray-100')
        btn.onclick = () => { activeFilter = id; renderFilters(); renderFavorites(allFavorites.filter(f => f.course_id === id)) }
        container.appendChild(btn)
    }
}

function renderFavorites(list) {
    const grid = document.getElementById('favoritesGrid')
    if (list.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-400"><i class="fas fa-heart-broken text-3xl mb-3"></i><p>Nenhuma aula favorita encontrada.</p></div>'
        return
    }
    grid.innerHTML = list.map(f => \`
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div class="flex-1">
                <p class="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">\${f.course_title}</p>
                <h3 class="text-gray-800 font-semibold text-sm leading-snug">\${f.lesson_title}</h3>
            </div>
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                <a href="/course/\${f.course_id}#lesson-\${f.lesson_id}"
                   class="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors">
                    <i class="fas fa-play-circle mr-1"></i>Assistir
                </a>
                <button onclick="removeFavorite(\${f.lesson_id}, this)"
                        class="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1">
                    <i class="fas fa-heart-broken"></i> Remover
                </button>
            </div>
        </div>
    \`).join('')
}

async function loadFavorites() {
    try {
        const res = await axios.get('/api/favorites')
        allFavorites = res.data
        renderFilters()
        renderFavorites(allFavorites)
    } catch (e) {
        if (e.response && e.response.status === 401) { window.location.href = '/'; return }
        document.getElementById('favoritesGrid').innerHTML =
            '<div class="col-span-full text-center py-12 text-red-400"><i class="fas fa-exclamation-triangle text-3xl mb-3"></i><p>Erro ao carregar favoritos.</p></div>'
    }
}

async function removeFavorite(lessonId, btn) {
    btn.disabled = true
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
    try {
        await axios.delete('/api/favorites/' + lessonId)
        allFavorites = allFavorites.filter(f => f.lesson_id !== lessonId)
        const filtered = activeFilter ? allFavorites.filter(f => f.course_id === activeFilter) : allFavorites
        renderFilters()
        renderFavorites(filtered)
    } catch(e) {
        btn.disabled = false
        btn.innerHTML = '<i class="fas fa-heart-broken"></i> Remover'
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const user = await authManager.init()
    if (!user) { window.location.href = '/'; return }
    const name = authManager.getUserName ? authManager.getUserName() : ''
    if (name) document.getElementById('userName').textContent = name
    loadFavorites()
})
</script>
</body>
</html>
  `)
})

// Certificates page
app.get('/certificates', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meus Certificados - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://page.gensparksite.com/v1/base64_upload/8f96be1bcec5a62130e0023674c921df" 
                             alt="CCT Logo" 
                             class="h-12 md:h-16 w-auto">
                        <div>
                            <h1 class="text-2xl font-bold">CCT</h1>
                            <p class="text-blue-200 text-xs">Clube do Cálculo Trabalhista</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 md:gap-4">
                        <button onclick="window.location.href='/'" 
                                class="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2">
                            <i class="fas fa-home"></i>
                            <span class="hidden sm:inline">Início</span>
                        </button>
                        <button onclick="window.location.href='/profile'" 
                                class="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-2">
                            <i class="fas fa-user-circle"></i>
                            <span class="hidden sm:inline">Perfil</span>
                        </button>
                        <button id="logoutBtn" 
                                class="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2">
                            <i class="fas fa-sign-out-alt"></i>
                            <span class="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-certificate text-yellow-600 mr-2"></i>
                    Meus Certificados
                </h2>
                <p class="text-gray-600">Visualize e baixe seus certificados de conclusão</p>
            </div>

            <!-- Loading State -->
            <div id="loadingDiv" class="text-center py-16">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <p class="text-gray-600">Carregando certificados...</p>
            </div>

            <!-- Certificates Grid -->
            <div id="certificatesGrid" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Certificates will be loaded here -->
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="hidden text-center py-16">
                <i class="fas fa-certificate text-gray-300 text-6xl mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum certificado disponível</h3>
                <p class="text-gray-500 mb-6">Complete cursos para receber seus certificados!</p>
                <button onclick="window.location.href='/'" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-arrow-left mr-2"></i>Voltar aos Cursos
                </button>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="/static/auth.js?v=whatsapp-floating-20260602"></script>
    <script>
        let currentUser = null;

        // Initialize page
        async function init() {
            // Check authentication
            const user = await authManager.init()
            
            if (!user) {
                window.location.href = '/'
                return
            }
            
            currentUser = user
            loadCertificates()
        }

        // Load certificates
        async function loadCertificates() {
            try {
                const response = await axios.get('/api/my-certificates')
                const certificates = response.data.certificates

                document.getElementById('loadingDiv').classList.add('hidden')

                if (certificates.length === 0) {
                    document.getElementById('emptyState').classList.remove('hidden')
                    return
                }

                renderCertificates(certificates)
            } catch (error) {
                console.error('Error loading certificates:', error)
                document.getElementById('loadingDiv').innerHTML = \`
                    <div class="text-center py-16">
                        <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                        <p class="text-gray-600">Erro ao carregar certificados</p>
                        <button onclick="location.reload()" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Tentar Novamente
                        </button>
                    </div>
                \`
            }
        }

        // Render certificates
        function renderCertificates(certificates) {
            const grid = document.getElementById('certificatesGrid')
            grid.classList.remove('hidden')

            grid.innerHTML = certificates.map(cert => {
                const completionDate = cert.completion_date ? new Date(cert.completion_date).toLocaleDateString('pt-BR') : (cert.start_date ? new Date(cert.start_date).toLocaleDateString('pt-BR') : '—')
                const startDate = cert.start_date ? new Date(cert.start_date).toLocaleDateString('pt-BR') : '—'
                const verificationUrl = cert.certificate_code ? \`\${window.location.origin}/verificar/\${cert.certificate_code}\` : null

                return \`
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <i class="fas fa-certificate text-2xl"></i>
                                        <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                                            ✓ Certificado
                                        </span>
                                    </div>
                                    <h3 class="text-xl font-bold mb-1">\${cert.course_title}</h3>
                                    <p class="text-blue-100 text-sm">Início: \${startDate} &nbsp;|&nbsp; Conclusão: \${completionDate}</p>
                                </div>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-xs text-gray-500 mb-1">Carga Horária</div>
                                    <div class="text-lg font-bold text-gray-800">
                                        \${cert.carga_horaria || 'N/A'} \${cert.carga_horaria ? 'horas' : ''}
                                    </div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-xs text-gray-500 mb-1">Código</div>
                                    <div class="text-sm font-mono font-bold text-gray-800">
                                        \${cert.certificate_code || '—'}
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <button onclick="viewCertificate(\${cert.id})"
                                    class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-eye"></i>
                                    Visualizar Certificado
                                </button>

                                <button onclick="downloadCertificate(\${cert.id})"
                                    class="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-download"></i>
                                    Baixar PDF
                                </button>

                                \${verificationUrl ? \`
                                <button onclick="shareCertificate('\${verificationUrl}')"
                                    class="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-share-alt"></i>
                                    Compartilhar Link
                                </button>\` : ''}
                            </div>

                            \${verificationUrl ? \`
                            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div class="text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Verificação: <a href="\${verificationUrl}" target="_blank" class="text-blue-600 hover:underline break-all">\${verificationUrl}</a>
                                </div>
                            </div>\` : ''}
                        </div>
                    </div>
                \`
            }).join('')
        }

        // View certificate
        function viewCertificate(certId) {
            const url = \`/api/certificates/\${certId}/html\`
            window.open(url, '_blank')
        }

        // Download certificate as PDF
        function downloadCertificate(certId) {
            const url = \`/api/certificates/\${certId}/html\`
            const printWindow = window.open(url, '_blank')
            
            printWindow.addEventListener('load', () => {
                setTimeout(() => {
                    printWindow.print()
                }, 500)
            })
            
            alert('📄 Certificado aberto em nova janela. Use Ctrl+P ou Cmd+P para imprimir ou salvar como PDF.')
        }

        // Share verification link
        async function shareCertificate(verificationUrl) {
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: 'Verificar Certificado - CCT 2026',
                        text: 'Verifique a autenticidade deste certificado',
                        url: verificationUrl
                    })
                } else {
                    await navigator.clipboard.writeText(verificationUrl)
                    alert('✅ Link de verificação copiado para a área de transferência!')
                }
            } catch (error) {
                console.error('Error sharing certificate:', error)
                prompt('Link de verificação do certificado:', verificationUrl)
            }
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            const result = await authManager.logout()
            if (result.success) {
                window.location.href = '/'
            }
        })

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', init)
    </script>
</body>
</html>
  `)
})

// Profile page
app.get('/profile', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Perfil - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://page.gensparksite.com/v1/base64_upload/8f96be1bcec5a62130e0023674c921df" 
                             alt="CCT Logo" 
                             class="h-12 md:h-16 w-auto">
                        <div>
                            <h1 class="text-2xl font-bold">CCT</h1>
                            <p class="text-blue-200 text-xs">Clube do Cálculo Trabalhista</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div id="userInfo" class="text-right hidden">
                            <p class="text-sm font-semibold" id="userName">Carregando...</p>
                            <p class="text-xs text-blue-200" id="userEmail">...</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.location.href='/'" 
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-home"></i>
                                <span class="hidden sm:inline">Início</span>
                            </button>
                            <button id="logoutBtn" 
                                    class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-sign-out-alt"></i>
                                <span class="hidden sm:inline">Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8 max-w-4xl">
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-user-circle text-blue-600 mr-2"></i>
                    Meu Perfil
                </h2>
                <p class="text-gray-600">Gerencie suas informações pessoais e configurações de conta</p>
            </div>

            <!-- Success/Error Messages -->
            <div id="messageDiv" class="hidden mb-6"></div>

            <!-- Profile Information -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <h3 class="text-white font-bold text-lg">
                        <i class="fas fa-id-card mr-2"></i>
                        Informações do Perfil
                    </h3>
                </div>
                <div class="p-6">
                    <form id="profileForm" class="space-y-6">
                        <!-- Email (readonly) -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-envelope mr-1 text-blue-600"></i> Email
                            </label>
                            <input type="email" 
                                   id="profileEmail" 
                                   disabled
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                   placeholder="seu@email.com">
                            <p class="text-xs text-gray-500 mt-1">
                                <i class="fas fa-info-circle"></i> O email não pode ser alterado
                            </p>
                        </div>
                        
                        <!-- Personal Information -->
                        <div class="border-t pt-4">
                            <h4 class="text-md font-bold text-gray-700 mb-4">
                                <i class="fas fa-id-card mr-2 text-blue-600"></i>Informações Pessoais
                            </h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-user mr-1 text-blue-600"></i> Nome Completo
                                    </label>
                                    <input type="text" 
                                           id="profileNome" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Seu nome completo">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-user mr-1 text-blue-600"></i> Primeiro Nome
                                    </label>
                                    <input type="text" 
                                           id="profileFirstName" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Primeiro nome">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-user mr-1 text-blue-600"></i> Sobrenome
                                    </label>
                                    <input type="text" 
                                           id="profileLastName" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Sobrenome">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-id-card mr-1 text-blue-600"></i> CPF
                                    </label>
                                    <input type="text" 
                                           id="profileCPF" 
                                           maxlength="14"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="000.000.000-00">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-phone mr-1 text-blue-600"></i> Telefone
                                    </label>
                                    <input type="text" 
                                           id="profileTelefone" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="(00) 0000-0000">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fab fa-whatsapp mr-1 text-green-600"></i> WhatsApp
                                    </label>
                                    <input type="text" 
                                           id="profileWhatsapp" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="(00) 00000-0000">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Address Information -->
                        <div class="border-t pt-4">
                            <h4 class="text-md font-bold text-gray-700 mb-4">
                                <i class="fas fa-map-marker-alt mr-2 text-blue-600"></i>Endereço
                            </h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-map-pin mr-1 text-blue-600"></i> CEP
                                    </label>
                                    <input type="text" 
                                           id="profileCEP" 
                                           maxlength="9"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="00000-000">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-road mr-1 text-blue-600"></i> Logradouro
                                    </label>
                                    <input type="text" 
                                           id="profileLogradouro" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Rua, Avenida, etc.">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-hashtag mr-1 text-blue-600"></i> Número
                                    </label>
                                    <input type="text" 
                                           id="profileNumero" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Número">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-city mr-1 text-blue-600"></i> Cidade
                                    </label>
                                    <input type="text" 
                                           id="profileCidade" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Cidade">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-map mr-1 text-blue-600"></i> Estado
                                    </label>
                                    <select id="profileEstado" 
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Selecione</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" 
                                id="profileSubmitBtn"
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <i class="fas fa-save"></i>
                            Salvar Alterações
                        </button>
                    </form>
                </div>
            </div>

            <!-- Subscription History -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div class="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                    <h3 class="text-white font-bold text-lg">
                        <i class="fas fa-history mr-2"></i>
                        Histórico de Planos
                    </h3>
                </div>
                <div class="p-6">
                    <div id="subscriptionHistory">
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                            <p>Carregando histórico...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rented Lessons -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div class="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4">
                    <h3 class="text-white font-bold text-lg">
                        <i class="fas fa-shopping-cart mr-2"></i>
                        Minhas Aulas Alugadas
                    </h3>
                </div>
                <div class="p-6">
                    <div id="rentalsContainer">
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                            <p>Carregando aluguéis...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Change Password -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4">
                    <h3 class="text-white font-bold text-lg">
                        <i class="fas fa-key mr-2"></i>
                        Alterar Senha
                    </h3>
                </div>
                <div class="p-6">
                    <form id="passwordForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-lock mr-1 text-purple-600"></i> Senha Atual
                            </label>
                            <input type="password" 
                                   id="currentPassword" 
                                   required
                                   minlength="6"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                   placeholder="Digite sua senha atual">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-lock mr-1 text-purple-600"></i> Nova Senha
                            </label>
                            <input type="password" 
                                   id="newPassword" 
                                   required
                                   minlength="6"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                   placeholder="Mínimo 6 caracteres">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-lock mr-1 text-purple-600"></i> Confirmar Nova Senha
                            </label>
                            <input type="password" 
                                   id="confirmPassword" 
                                   required
                                   minlength="6"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                   placeholder="Digite a nova senha novamente">
                        </div>
                        
                        <button type="submit" 
                                id="passwordSubmitBtn"
                                class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <i class="fas fa-check"></i>
                            Alterar Senha
                        </button>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="/static/auth.js?v=whatsapp-floating-20260602"></script>
    <script>
        const messageDiv = document.getElementById('messageDiv')
        const profileForm = document.getElementById('profileForm')
        const passwordForm = document.getElementById('passwordForm')
        const profileSubmitBtn = document.getElementById('profileSubmitBtn')
        const passwordSubmitBtn = document.getElementById('passwordSubmitBtn')
        
        function showMessage(message, isError = false) {
            messageDiv.innerHTML = \`
                <div class="p-4 rounded-lg border \${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}">
                    <i class="fas \${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
                    \${message}
                </div>
            \`
            messageDiv.classList.remove('hidden')
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageDiv.classList.add('hidden')
            }, 5000)
        }
        
        // Load user data
        async function loadUserProfile() {
            try {
                const authResponse = await axios.get('/api/auth/me')
                
                if (!authResponse.data.user) {
                    window.location.href = '/'
                    return
                }
                
                const user = authResponse.data.user
                
                // Update header
                document.getElementById('userName').textContent = user.user_metadata?.name || 'Usuário'
                document.getElementById('userEmail').textContent = user.email || ''
                document.getElementById('userInfo').classList.remove('hidden')
                
                // Load full profile from users table
                try {
                    const profileResponse = await axios.get('/api/user/profile')
                    const profile = profileResponse.data.profile || {}
                    
                    // Fill all form fields
                    document.getElementById('profileEmail').value = user.email || ''
                    document.getElementById('profileNome').value = profile.nome || ''
                    document.getElementById('profileFirstName').value = profile.first_name || ''
                    document.getElementById('profileLastName').value = profile.last_name || ''
                    document.getElementById('profileCPF').value = profile.cpf || ''
                    document.getElementById('profileTelefone').value = profile.telefone || ''
                    document.getElementById('profileWhatsapp').value = profile.whatsapp || ''
                    document.getElementById('profileCEP').value = profile.end_cep || ''
                    document.getElementById('profileLogradouro').value = profile.end_logradouro || ''
                    document.getElementById('profileNumero').value = profile.end_numero || ''
                    document.getElementById('profileCidade').value = profile.end_cidade || ''
                    document.getElementById('profileEstado').value = profile.end_estado || ''
                    
                    // Add CPF and CEP masks
                    addInputMasks()
                } catch (profileError) {
                    console.error('Error loading profile data:', profileError)
                    // Continue anyway with basic info
                    document.getElementById('profileEmail').value = user.email || ''
                }
                
                // Load subscription history and rentals
                loadSubscriptionHistory(user.email)
                loadRentals()
            } catch (error) {
                console.error('Error loading profile:', error)
                window.location.href = '/'
            }
        }
        
        // Add input masks
        function addInputMasks() {
            // CPF mask
            const cpfInput = document.getElementById('profileCPF')
            cpfInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\\D/g, '')
                if (value.length > 11) value = value.slice(0, 11)
                value = value.replace(/(\\d{3})(\\d)/, '$1.$2')
                value = value.replace(/(\\d{3})(\\d)/, '$1.$2')
                value = value.replace(/(\\d{3})(\\d{1,2})$/, '$1-$2')
                e.target.value = value
            })
            
            // CEP mask
            const cepInput = document.getElementById('profileCEP')
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\\D/g, '')
                if (value.length > 8) value = value.slice(0, 8)
                value = value.replace(/(\\d{5})(\\d)/, '$1-$2')
                e.target.value = value
            })
        }
        
        // Load subscription history
        async function loadSubscriptionHistory(email) {
            const container = document.getElementById('subscriptionHistory')
            
            try {
                const response = await axios.get('/api/user/subscriptions')
                const subscriptions = response.data.subscriptions || []
                
                // Separar planos ativos e expirados
                const now = new Date()
                const activePlans = subscriptions.filter(s => new Date(s.data_expiracao) > now)
                const expiredPlans = subscriptions.filter(s => new Date(s.data_expiracao) <= now)

                let html = ''

                // Card de renovação sempre visível no topo
                html += \`
                    <div class="rounded-xl border-2 border-red-200 bg-red-50 p-5 mb-2">
                        <h4 class="text-base font-bold text-red-700 mb-1 flex items-center gap-2">
                            <i class="fas fa-sync-alt"></i> Renovar Plano
                        </h4>
                        <p class="text-sm text-red-600 mb-4">Escolha como deseja renovar seu acesso:</p>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <a href="https://pay.hotmart.com/I68113150G?off=q7xf5t1z" target="_blank"
                               class="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-lg transition text-sm">
                                <i class="fas fa-credit-card"></i>
                                Renovar com Cartão
                            </a>
                            <a href="https://assinaturas.ensinoplus.com.br" target="_blank"
                               class="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-5 rounded-lg transition text-sm">
                                <i class="fas fa-coins"></i>
                                Renovar com Créditos
                            </a>
                        </div>
                    </div>
                \`

                // Planos ativos
                if (activePlans.length > 0) {
                    html += \`
                        <div class="mb-4">
                            <h4 class="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                                <i class="fas fa-check-circle"></i>
                                Planos Ativos (\${activePlans.length})
                            </h4>
                            <div class="space-y-3">
                                \${activePlans.map(sub => renderSubscription(sub, true)).join('')}
                            </div>
                        </div>
                    \`
                }

                // Planos expirados
                if (expiredPlans.length > 0) {
                    html += \`
                        <div>
                            <h4 class="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                                <i class="fas fa-history"></i>
                                Planos Anteriores (\${expiredPlans.length})
                            </h4>
                            <div class="space-y-3">
                                \${expiredPlans.map(sub => renderSubscription(sub, false)).join('')}
                            </div>
                        </div>
                    \`
                }

                if (subscriptions.length === 0) {
                    html += \`
                        <div class="text-center py-4 text-gray-500">
                            <i class="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
                            <p class="text-sm">Nenhum histórico de assinaturas encontrado</p>
                        </div>
                    \`
                }

                container.innerHTML = html
                
            } catch (error) {
                console.error('Error loading subscription history:', error)
                container.innerHTML = \`
                    <div class="text-center py-8 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-3"></i>
                        <p class="text-lg font-semibold">Erro ao carregar histórico</p>
                        <p class="text-sm">Tente novamente mais tarde</p>
                    </div>
                \`
            }
        }
        
        // Render single subscription
        function renderSubscription(sub, isActive) {
            const expirationDate = new Date(sub.data_expiracao)
            const formattedDate = expirationDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
            
            const daysRemaining = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24))
            
            const typeIcon = sub.teste_gratis 
                ? '<i class="fas fa-gift text-yellow-500"></i>'
                : '<i class="fas fa-crown text-purple-500"></i>'
            
            const statusBadge = isActive
                ? \`<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                     <i class="fas fa-check-circle"></i> Ativo
                   </span>\`
                : \`<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                     <i class="fas fa-times-circle"></i> Expirado
                   </span>\`
            
            const urgencyClass = isActive && daysRemaining <= 7 
                ? 'border-l-4 border-red-500 bg-red-50' 
                : isActive 
                ? 'border-l-4 border-green-500 bg-green-50' 
                : 'border-l-4 border-gray-300 bg-gray-50'
            
            return \`
                <div class="p-4 rounded-lg border \${urgencyClass}">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex items-start gap-3 flex-1">
                            <div class="text-2xl">
                                \${typeIcon}
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <h5 class="font-bold text-gray-800">\${sub.detalhe}</h5>
                                    \${statusBadge}
                                </div>
                                <div class="text-sm text-gray-600 space-y-1">
                                    <p>
                                        <i class="fas fa-calendar-alt text-gray-400 mr-1"></i>
                                        <strong>Expira em:</strong> \${formattedDate}
                                    </p>
                                    \${isActive ? \`
                                        <p class="\${daysRemaining <= 7 ? 'text-red-600 font-semibold' : 'text-green-600'}">
                                            <i class="fas fa-clock text-gray-400 mr-1"></i>
                                            <strong>Tempo restante:</strong> \${daysRemaining} dia(s)
                                        </p>
                                    \` : ''}
                                    \${sub.teste_gratis ? \`
                                        <p class="text-yellow-700">
                                            <i class="fas fa-info-circle mr-1"></i>
                                            <strong>Tipo:</strong> Teste Grátis (5 dias)
                                        </p>
                                    \` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    \${(!isActive || daysRemaining <= 30) ? \`
                    <div class="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                        <a href="https://pay.hotmart.com/I68113150G?off=q7xf5t1z" target="_blank"
                           class="flex-1 text-center text-xs font-bold py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
                            <i class="fas fa-credit-card mr-1"></i> Cartão
                        </a>
                        <a href="https://assinaturas.ensinoplus.com.br" target="_blank"
                           class="flex-1 text-center text-xs font-bold py-2 px-3 rounded-lg bg-gray-700 hover:bg-gray-800 text-white transition">
                            <i class="fas fa-coins mr-1"></i> Créditos
                        </a>
                    </div>\` : ''}
                </div>
            \`
        }

        // Load rented lessons
        async function loadRentals() {
            const container = document.getElementById('rentalsContainer')
            try {
                const response = await axios.get('/api/user/rentals')
                const rentals = response.data.rentals || []

                if (rentals.length === 0) {
                    container.innerHTML = \`
                        <div class="text-center py-6 text-gray-500">
                            <i class="fas fa-shopping-cart text-3xl mb-2 text-gray-300"></i>
                            <p class="text-sm">Nenhuma aula alugada ainda</p>
                            <p class="text-xs text-gray-400 mt-1">Aulas disponíveis para aluguel aparecem na plataforma</p>
                        </div>
                    \`
                    return
                }

                const now = new Date()
                const activeRentals = rentals.filter(r => new Date(r.expires_at) > now)
                const expiredRentals = rentals.filter(r => new Date(r.expires_at) <= now)

                const renderRental = (r, active) => {
                    const exp = new Date(r.expires_at)
                    const formatted = exp.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                    const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))
                    const borderClass = active
                        ? (daysLeft <= 3 ? 'border-l-4 border-red-400 bg-red-50' : 'border-l-4 border-amber-400 bg-amber-50')
                        : 'border-l-4 border-gray-300 bg-gray-50'
                    return \`
                        <div class="p-4 rounded-lg border \${borderClass} mb-3">
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex-1">
                                    <p class="text-xs text-gray-500 mb-1">
                                        \${r.course_title ? r.course_title + ' › ' : ''}\${r.module_title || ''}
                                    </p>
                                    <h5 class="font-bold text-gray-800 mb-1">\${r.lesson_title}</h5>
                                    <div class="text-sm text-gray-600 space-y-1">
                                        <p><i class="fas fa-coins text-amber-500 mr-1"></i><strong>Créditos pagos:</strong> \${r.credits_paid}</p>
                                        <p><i class="fas fa-calendar-alt text-gray-400 mr-1"></i><strong>Expira em:</strong> \${formatted}</p>
                                        \${active ? \`<p class="\${daysLeft <= 3 ? 'text-red-600 font-semibold' : 'text-amber-700'}">
                                            <i class="fas fa-clock mr-1"></i><strong>Tempo restante:</strong> \${daysLeft} dia(s)
                                        </p>\` : '<p class="text-gray-500"><i class="fas fa-times-circle mr-1"></i>Expirado</p>'}
                                    </div>
                                </div>
                                \${active ? \`<a href="/" onclick="localStorage.setItem('openLesson', '\${r.lesson_id}')"
                                    class="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition">
                                    <i class="fas fa-play mr-1"></i>Assistir
                                </a>\` : ''}
                            </div>
                        </div>
                    \`
                }

                let html = ''
                if (activeRentals.length > 0) {
                    html += \`<h4 class="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                        <i class="fas fa-clock"></i> Aluguéis Ativos (\${activeRentals.length})</h4>\`
                    html += activeRentals.map(r => renderRental(r, true)).join('')
                }
                if (expiredRentals.length > 0) {
                    html += \`<h4 class="text-sm font-bold text-gray-500 mb-3 mt-4 flex items-center gap-2">
                        <i class="fas fa-history"></i> Aluguéis Anteriores (\${expiredRentals.length})</h4>\`
                    html += expiredRentals.map(r => renderRental(r, false)).join('')
                }
                container.innerHTML = html
            } catch (error) {
                console.error('Error loading rentals:', error)
                container.innerHTML = \`<div class="text-center py-4 text-gray-400 text-sm">
                    <i class="fas fa-exclamation-circle mr-1"></i>Erro ao carregar aluguéis
                </div>\`
            }
        }

        // Handle profile form submission
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            profileSubmitBtn.disabled = true
            profileSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...'
            
            try {
                const profileData = {
                    nome: document.getElementById('profileNome').value.trim(),
                    first_name: document.getElementById('profileFirstName').value.trim(),
                    last_name: document.getElementById('profileLastName').value.trim(),
                    cpf: document.getElementById('profileCPF').value.trim(),
                    telefone: document.getElementById('profileTelefone').value.trim(),
                    whatsapp: document.getElementById('profileWhatsapp').value.trim(),
                    end_cep: document.getElementById('profileCEP').value.trim(),
                    end_logradouro: document.getElementById('profileLogradouro').value.trim(),
                    end_numero: document.getElementById('profileNumero').value.trim(),
                    end_cidade: document.getElementById('profileCidade').value.trim(),
                    end_estado: document.getElementById('profileEstado').value
                }
                
                const response = await axios.put('/api/user/profile', profileData)
                
                if (response.data.success) {
                    showMessage('✅ ' + response.data.message, false)
                    
                    // Update header name if changed
                    if (profileData.nome) {
                        document.getElementById('userName').textContent = profileData.nome
                    }
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao atualizar perfil'
                showMessage('❌ ' + errorMessage, true)
            } finally {
                profileSubmitBtn.disabled = false
                profileSubmitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações'
            }
        })
        
        // Handle password form submission
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const currentPassword = document.getElementById('currentPassword').value
            const newPassword = document.getElementById('newPassword').value
            const confirmPassword = document.getElementById('confirmPassword').value
            
            if (newPassword !== confirmPassword) {
                showMessage('❌ As senhas não coincidem', true)
                return
            }
            
            if (newPassword.length < 6) {
                showMessage('❌ A nova senha deve ter pelo menos 6 caracteres', true)
                return
            }
            
            if (currentPassword === newPassword) {
                showMessage('❌ A nova senha deve ser diferente da senha atual', true)
                return
            }
            
            passwordSubmitBtn.disabled = true
            passwordSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Alterando...'
            
            try {
                const response = await axios.post('/api/auth/change-password', {
                    currentPassword,
                    newPassword
                })
                
                if (response.data.success) {
                    showMessage('✅ ' + response.data.message, false)
                    
                    // Clear form
                    passwordForm.reset()
                    
                    // Optional: redirect after password change
                    setTimeout(() => {
                        showMessage('🔄 Redirecionando...', false)
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 1000)
                    }, 2000)
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao alterar senha'
                showMessage('❌ ' + errorMessage, true)
            } finally {
                passwordSubmitBtn.disabled = false
                passwordSubmitBtn.innerHTML = '<i class="fas fa-check"></i> Alterar Senha'
            }
        })
        
        // Handle logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja sair?')) {
                await auth.logout()
            }
        })
        
        // Initialize
        loadUserProfile()
    </script>
</body>
</html>
  `)
})

// Certificates page
app.get('/certificates', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meus Certificados - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://page.gensparksite.com/v1/base64_upload/8f96be1bcec5a62130e0023674c921df" 
                             alt="CCT Logo" 
                             class="h-12 md:h-16 w-auto">
                        <div>
                            <h1 class="text-2xl font-bold">CCT</h1>
                            <p class="text-blue-200 text-xs">Clube do Cálculo Trabalhista</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div id="userInfo" class="text-right hidden">
                            <p class="text-sm font-semibold" id="userName">Carregando...</p>
                            <p class="text-xs text-blue-200" id="userEmail">...</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.location.href='/'" 
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-home"></i>
                                <span class="hidden sm:inline">Início</span>
                            </button>
                            <button onclick="window.location.href='/profile'" 
                                    class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-user"></i>
                                <span class="hidden sm:inline">Perfil</span>
                            </button>
                            <button id="logoutBtn" 
                                    class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-sign-out-alt"></i>
                                <span class="hidden sm:inline">Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8 max-w-6xl">
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-certificate text-yellow-500 mr-2"></i>
                    Meus Certificados
                </h2>
                <p class="text-gray-600">Visualize e baixe seus certificados de conclusão de curso</p>
            </div>

            <!-- Message Div -->
            <div id="messageDiv" class="hidden mb-6"></div>

            <!-- Loading State -->
            <div id="loadingState" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <p class="text-gray-600">Carregando certificados...</p>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="hidden text-center py-12 bg-white rounded-xl shadow-md">
                <i class="fas fa-certificate text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Nenhum certificado ainda</h3>
                <p class="text-gray-600 mb-6">Complete um curso para receber seu certificado!</p>
                <button onclick="window.location.href='/'" 
                        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                    <i class="fas fa-book mr-2"></i>
                    Ver Cursos
                </button>
            </div>

            <!-- Certificates Grid -->
            <div id="certificatesGrid" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Certificates will be loaded here -->
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="/static/auth.js?v=whatsapp-floating-20260602"></script>
    <script>
        const loadingState = document.getElementById('loadingState')
        const emptyState = document.getElementById('emptyState')
        const certificatesGrid = document.getElementById('certificatesGrid')
        const messageDiv = document.getElementById('messageDiv')
        
        function showMessage(message, isError = false) {
            messageDiv.innerHTML = \`
                <div class="p-4 rounded-lg border \${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}">
                    <i class="fas \${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
                    \${message}
                </div>
            \`
            messageDiv.classList.remove('hidden')
            
            setTimeout(() => {
                messageDiv.classList.add('hidden')
            }, 5000)
        }
        
        function formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
        
        async function loadCertificates() {
            try {
                // Load user info
                const userResponse = await axios.get('/api/auth/me')
                if (userResponse.data.user) {
                    document.getElementById('userName').textContent = userResponse.data.user.user_metadata?.name || 'Usuário'
                    document.getElementById('userEmail').textContent = userResponse.data.user.email || ''
                    document.getElementById('userInfo').classList.remove('hidden')
                }
                
                // Load certificates
                const response = await axios.get('/api/certificates')
                const certificates = response.data.certificates || []
                
                loadingState.classList.add('hidden')
                
                if (certificates.length === 0) {
                    emptyState.classList.remove('hidden')
                } else {
                    certificatesGrid.classList.remove('hidden')
                    certificatesGrid.innerHTML = certificates.map(cert => \`
                        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div class="relative h-48 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 flex items-center justify-center">
                                \${cert.template_url ? 
                                    \`<img src="\${cert.template_url}" alt="Certificado" class="w-full h-full object-cover">\` :
                                    \`<div class="text-center text-white p-6">
                                        <i class="fas fa-award text-6xl mb-2 opacity-75"></i>
                                        <p class="text-sm font-bold">CERTIFICADO</p>
                                    </div>\`
                                }
                                <div class="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-bold text-yellow-600">
                                    <i class="fas fa-star mr-1"></i>
                                    Concluído
                                </div>
                            </div>
                            <div class="p-6">
                                <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                    \${cert.course_title}
                                </h3>
                                <div class="space-y-2 mb-4 text-sm text-gray-600">
                                    <p>
                                        <i class="fas fa-user text-blue-600 mr-2"></i>
                                        \${cert.user_name}
                                    </p>
                                    <p>
                                        <i class="fas fa-calendar text-green-600 mr-2"></i>
                                        Concluído em \${formatDate(cert.completion_date)}
                                    </p>
                                </div>
                                <button onclick="viewCertificate(\${cert.id}, '\${cert.template_url || ''}')" 
                                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <i class="fas fa-eye"></i>
                                    Visualizar Certificado
                                </button>
                            </div>
                        </div>
                    \`).join('')
                }
            } catch (error) {
                console.error('Error loading certificates:', error)
                loadingState.classList.add('hidden')
                emptyState.classList.remove('hidden')
            }
        }
        
        function viewCertificate(certId, templateUrl) {
            if (templateUrl) {
                window.open(templateUrl, '_blank')
            } else {
                showMessage('⚠️ Template de certificado não configurado para este curso', true)
            }
        }
        
        // Handle logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja sair?')) {
                await auth.logout()
            }
        })
        
        // Initialize
        loadCertificates()
    </script>
</body>
</html>
  `)
})

export default app
