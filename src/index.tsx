import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { SupabaseClient } from './supabase-client'

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const app = new Hono<{ Bindings: Bindings }>()

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
      return c.json({ error: data.error_description || 'Registration failed' }, 400)
    }
    
    // Create user record in users table
    try {
      const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
      await supabase.insert('users', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const userProfile = await supabase.query('users', {
      select: '*',
      filters: { email: user.email },
      single: true
    })
    
    if (!userProfile) {
      // Create user profile if doesn't exist
      await supabase.insert('users', {
        email: user.email,
        nome: user.user_metadata?.name || '',
        ativo: true,
        teste_gratis: false
      })
      
      // Fetch again
      const newProfile = await supabase.query('users', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Update users table
    await supabase.update('users', { email: user.email }, {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Get user access type using database function
    const accessTypeResult = await supabase.rpc('user_tipo_acesso', {
      email_usuario: userEmail
    })
    
    console.log('🔍 Access type result for', userEmail, ':', accessTypeResult)
    
    // Handle different return formats from RPC
    let accessType = 'SEM_ACESSO'
    if (typeof accessTypeResult === 'string') {
      // Direct string return
      accessType = accessTypeResult
    } else if (Array.isArray(accessTypeResult) && accessTypeResult.length > 0) {
      // Array return: [{user_tipo_acesso: "COMPLETO"}] or ["COMPLETO"]
      accessType = accessTypeResult[0].user_tipo_acesso || accessTypeResult[0]
    } else if (accessTypeResult && typeof accessTypeResult === 'object') {
      // Object return: {user_tipo_acesso: "COMPLETO"}
      accessType = accessTypeResult.user_tipo_acesso
    }
    
    console.log('✅ Determined access type:', accessType)
    
    // Get active subscription details
    const activeSubscription = await supabase.query('member_subscriptions', {
      select: 'data_expiracao, teste_gratis, detalhe',
      filters: { 
        email_membro: userEmail
      },
      order: 'data_expiracao.desc',
      limit: 1
    })
    
    let expirationDate = null
    let subscriptionDetail = null
    
    if (activeSubscription && activeSubscription.length > 0) {
      const sub = activeSubscription[0]
      const expDate = new Date(sub.data_expiracao)
      
      // Only include if not expired
      if (expDate > new Date()) {
        expirationDate = sub.data_expiracao
        subscriptionDetail = sub.detalhe
      }
    }
    
    return c.json({ 
      email: userEmail,
      accessType: accessType,
      hasActiveSubscription: accessType !== 'SEM_ACESSO',
      hasFullAccess: accessType === 'COMPLETO',
      expirationDate: expirationDate,
      subscriptionDetail: subscriptionDetail
    })
  } catch (error: any) {
    console.error('Error loading access status:', error)
    return c.json({ 
      email: user?.email || '',
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Buscar todas as assinaturas do usuário
    const subscriptions = await supabase.query('member_subscriptions', {
      select: '*',
      filters: { email_membro: userEmail },
      order: 'data_expiracao.desc'
    })
    
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

async function isAdmin(email: string, supabaseUrl: string, supabaseKey: string) {
  try {
    const supabase = new SupabaseClient(supabaseUrl, supabaseKey)
    const result = await supabase.query('admins', {
      select: '*',
      filters: { email },
      single: true
    })
    return result !== null
  } catch (error) {
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
  
  const adminCheck = await isAdmin(user.email, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  
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
  
  const adminCheck = await isAdmin(user.email, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
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
    
    // Check if user exists in users table
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const users = await supabase.query('users', {
      select: '*',
      filters: { email: user_email }
    })
    
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
      // Add a signature to prevent tampering (simple version)
      signature: Buffer.from(`${user_email}:${c.env.SUPABASE_ANON_KEY}`).toString('base64')
    }
    
    const impersonationToken = `IMPERSONATE:${Buffer.from(JSON.stringify(impersonationData)).toString('base64')}`
    
    console.log(`✅ Impersonation token created for ${user_email}`)
    
    return c.json({ 
      token: impersonationToken,
      user_email,
      user_name: targetUser.nome
    })
  } catch (error: any) {
    console.error('Impersonation error:', error)
    return c.json({ error: error.message || 'Failed to impersonate user' }, 500)
  }
})

// Create course (admin only)
app.post('/api/admin/courses', requireAdmin, async (c) => {
  try {
    const { title, description, duration_hours, instructor, offers_certificate, is_published } = await c.req.json()
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const result = await supabase.insert('courses', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.update('courses', { id: courseId }, {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.delete('courses', { id: courseId })
    
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Query with exact title match
    const courses = await supabase.query('courses', {
      select: '*',
      filters: { title: title },
      limit: 1
    })
    
    if (courses && courses.length > 0) {
      return c.json({ course: courses[0] })
    }
    
    return c.json({ course: null })
  } catch (error: any) {
    console.error('Find course error:', error)
    return c.json({ error: error.message || 'Failed to find course' }, 500)
  }
})

// Create module (admin only)
app.post('/api/admin/modules', requireAdmin, async (c) => {
  try {
    const { course_id, title, description, order_index } = await c.req.json()
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const result = await supabase.insert('modules', {
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

// Update module (admin only)
app.put('/api/admin/modules/:id', requireAdmin, async (c) => {
  try {
    const moduleId = c.req.param('id')
    const { title, description, order_index } = await c.req.json()
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.update('modules', { id: moduleId }, {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.delete('modules', { id: moduleId })
    
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Query with exact title match in this course
    const modules = await supabase.query('modules', {
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
    const { module_id, title, description, video_provider, video_id, duration_minutes, order_index, free_trial, support_text, transcript, attachments } = await c.req.json()
    
    // Build video_url from provider and id
    let video_url = null
    if (video_provider && video_id) {
      if (video_provider === 'youtube') {
        video_url = `https://www.youtube.com/watch?v=${video_id}`
      } else if (video_provider === 'vimeo') {
        video_url = `https://vimeo.com/${video_id}`
      } else {
        video_url = video_id // For 'url' type, video_id contains the full URL
      }
    }
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const result = await supabase.insert('lessons', {
      module_id,
      title,
      description: description || null,
      video_url,
      video_provider: video_provider || null,
      video_id: video_id || null,
      duration_minutes: duration_minutes || 0,
      order_index: order_index || 0,
      teste_gratis: free_trial || false,  // Use teste_gratis column
      support_text: support_text || null,
      transcript: transcript || null,
      attachments: attachments || []
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

// Update lesson (admin only)
app.put('/api/admin/lessons/:id', requireAdmin, async (c) => {
  try {
    const lessonId = c.req.param('id')
    const { title, description, video_provider, video_id, duration_minutes, order_index, free_trial, support_text, transcript, attachments } = await c.req.json()
    
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.update('lessons', { id: lessonId }, {
      title,
      description: description || null,
      video_url,
      video_provider: video_provider || null,
      video_id: video_id || null,
      duration_minutes,
      order_index,
      teste_gratis: free_trial !== undefined ? free_trial : false,  // Use teste_gratis column
      support_text: support_text || null,
      transcript: transcript || null,
      attachments: attachments || []
    })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update lesson' }, 500)
  }
})

// Delete lesson (admin only)
app.delete('/api/admin/lessons/:id', requireAdmin, async (c) => {
  try {
    const lessonId = c.req.param('id')
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.delete('lessons', { id: lessonId })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to delete lesson' }, 500)
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Query with exact title match in this module
    const lessons = await supabase.query('lessons', {
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

// ============================================
// API ROUTES - USERS MANAGEMENT
// ============================================

// Get all users (admin only)
app.get('/api/admin/users', requireAdmin, async (c) => {
  try {
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const users = await supabase.query('users', {
      select: '*',
      order: 'created_at.desc'
    })
    
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const users = await supabase.query('users', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const result = await supabase.insert('users', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    await supabase.update('users', { id: userId }, {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.delete('users', { id: userId })
    
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
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const certificates = await supabase.query('certificates', {
      select: '*',
      order: 'created_at.desc'
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
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const certificates = await supabase.query('certificates', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const certificates = await supabase.query('certificates', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const now = new Date().toISOString()
    
    const result = await supabase.insert('certificates', {
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

// Update certificate (admin only)
app.put('/api/admin/certificates/:id', requireAdmin, async (c) => {
  try {
    const certId = c.req.param('id')
    const certData = await c.req.json()
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Get course title if course_id is provided
    let courseTitle = certData.course_title
    if (certData.course_id) {
      const courses = await supabase.query('courses', {
        select: 'title',
        filters: { id: certData.course_id }
      })
      if (courses && courses.length > 0) {
        courseTitle = courses[0].title
      }
    }
    
    await supabase.update('certificates', { id: certId }, {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.delete('certificates', { id: certId })
    
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
  workload: string;
  completionDate: string;
  issueDate: string;
  verificationCode: string;
  verificationUrl: string;
  modules?: string[];  // Array de módulos concluídos
}) {
  // Gerar HTML dos módulos se existirem
  const modulesHTML = data.modules && data.modules.length > 0 
    ? `
    <div class="modules-section">
      <div class="modules-title">Módulos Concluídos:</div>
      <div class="modules-grid">
        ${data.modules.map((module, index) => `
          <div class="module-item">
            <i class="fas fa-check-circle"></i> ${module}
          </div>
        `).join('')}
      </div>
    </div>
    `
    : '';
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado - CCT 2026</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 297mm;
            height: 210mm;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 15mm;
        }
        
        .certificate-container {
            width: 100%;
            height: 100%;
            background: white;
            border: 15px solid #2c3e50;
            border-radius: 20px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
        }
        
        .certificate-border {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 3px solid #3498db;
            border-radius: 10px;
        }
        
        .certificate-content {
            position: relative;
            z-index: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 40px;
        }
        
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo-image {
            width: 80px;
            height: 80px;
        }
        
        .company-info {
            text-align: left;
        }
        
        .company-name {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            line-height: 1.3;
            margin-bottom: 3px;
        }
        
        .company-cnpj {
            font-size: 11px;
            color: #7f8c8d;
        }
        
        .header-right {
            text-align: right;
        }
        
        .cct-logo {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            letter-spacing: 2px;
        }
        
        .subtitle {
            font-size: 12px;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .main-content {
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 15px 0;
        }
        
        .certificate-title {
            font-size: 42px;
            color: #2c3e50;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 15px;
        }
        
        .certificate-text {
            font-size: 16px;
            color: #34495e;
            line-height: 1.6;
            margin-bottom: 10px;
        }
        
        .student-name {
            font-size: 28px;
            color: #3498db;
            font-weight: bold;
            margin: 15px 0;
            border-bottom: 2px solid #3498db;
            display: inline-block;
            padding: 8px 30px;
        }
        
        .course-name {
            font-size: 22px;
            color: #2c3e50;
            font-weight: bold;
            margin: 15px 0;
        }
        
        .modules-section {
            margin: 15px auto;
            max-width: 90%;
        }
        
        .modules-title {
            font-size: 14px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 8px;
            text-align: left;
        }
        
        .module-item {
            font-size: 12px;
            color: #34495e;
            padding: 5px 10px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 3px solid #3498db;
        }
        
        .module-item i {
            color: #27ae60;
            margin-right: 5px;
        }
        
        .details {
            display: flex;
            justify-content: space-around;
            margin-top: 15px;
            font-size: 13px;
            color: #7f8c8d;
        }
        
        .detail-item {
            text-align: center;
        }
        
        .detail-label {
            font-weight: bold;
            color: #2c3e50;
            display: block;
            margin-bottom: 5px;
        }
        
        .footer {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            border-top: 3px solid #3498db;
            padding-top: 15px;
        }
        
        .signature-line {
            text-align: center;
            flex: 1;
            margin: 0 15px;
        }
        
        .signature-line::before {
            content: '';
            display: block;
            width: 180px;
            height: 1px;
            background: #2c3e50;
            margin: 0 auto 5px;
        }
        
        .signature-name {
            font-size: 13px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .signature-title {
            font-size: 11px;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .verification-code {
            position: absolute;
            bottom: 15px;
            right: 25px;
            font-size: 10px;
            color: #95a5a6;
            text-align: right;
        }
        
        .verification-code-label {
            font-weight: bold;
            display: block;
            margin-bottom: 3px;
        }
        
        .verification-url {
            font-size: 9px;
            color: #3498db;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(52, 152, 219, 0.03);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .certificate-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="certificate-border"></div>
        <div class="watermark">ENSINO PLUS</div>
        
        <div class="certificate-content">
            <div class="header">
                <div class="logo-section">
                    <svg class="logo-image" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#2c3e50;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="url(#grad1)"/>
                        <path d="M 30 35 L 50 25 L 70 35 L 70 50 L 50 60 L 30 50 Z" fill="#fff" opacity="0.9"/>
                        <circle cx="50" cy="50" r="8" fill="#fff"/>
                        <text x="50" y="80" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#fff">EP</text>
                    </svg>
                    <div class="company-info">
                        <div class="company-name">CENTRO DE ENSINO E<br>APRENDIZAGEM PLUS LTDA</div>
                        <div class="company-cnpj">CNPJ: 35.537.045/0001-84</div>
                    </div>
                </div>
                
                <div class="header-right">
                    <div class="cct-logo">CCT 2026</div>
                    <div class="subtitle">Centro de Capacitação Técnica</div>
                </div>
            </div>
            
            <div class="main-content">
                <div class="certificate-title">Certificado</div>
                
                <div class="certificate-text">
                    Certificamos que
                </div>
                
                <div class="student-name">${data.studentName}</div>
                
                <div class="certificate-text">
                    concluiu com êxito o curso
                </div>
                
                <div class="course-name">${data.courseName}</div>
                
                ${modulesHTML}
                
                <div class="details">
                    <div class="detail-item">
                        <span class="detail-label">Carga Horária</span>
                        <span>${data.workload} horas</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Data de Conclusão</span>
                        <span>${data.completionDate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Data de Emissão</span>
                        <span>${data.issueDate}</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div class="signature-line">
                    <div class="signature-name">NÁRGILA DE SOUZA SANTOS</div>
                    <div class="signature-title">Diretora</div>
                </div>
                <div class="signature-line">
                    <div class="signature-name">Sistema CCT 2026</div>
                    <div class="signature-title">Certificação Digital</div>
                </div>
            </div>
            
            <div class="verification-code">
                <span class="verification-code-label">Código de Verificação:</span>
                <span>${data.verificationCode}</span>
                <div class="verification-url">
                    Verifique em: ${data.verificationUrl}
                </div>
            </div>
        </div>
    </div>
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const certificates = await supabase.query('certificates', {
      select: '*',
      filters: { user_email: userEmail },
      order: 'completion_date.desc'
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Get certificate
    const certificates = await supabase.query('certificates', {
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
    const completionDate = new Date(cert.completion_date).toLocaleDateString('pt-BR')
    const issueDate = new Date(cert.issued_at).toLocaleDateString('pt-BR')
    const baseUrl = new URL(c.req.url).origin
    const verificationUrl = `${baseUrl}/verificar/${cert.verification_code}`
    
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
        const courseModules = await supabase.query('modules', {
          select: 'title, order_index',
          filters: { course_id: cert.course_id },
          order: 'order_index.asc'
        })
        
        if (courseModules && courseModules.length > 0) {
          modules = courseModules.map((m: any) => m.title)
        }
      } catch (e) {
        console.log('Error fetching modules:', e)
      }
    }
    
    const html = generateCertificateHTML({
      studentName: cert.user_name,
      courseName: cert.course_title,
      workload: cert.carga_horaria || 'N/A',
      completionDate,
      issueDate,
      verificationCode: cert.verification_code,
      verificationUrl,
      modules: modules.length > 0 ? modules : undefined
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const certificates = await supabase.query('certificates', {
      select: '*',
      filters: { verification_code: code }
    })
    
    if (!certificates || certificates.length === 0) {
      return c.html(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificado Não Encontrado - CCT 2026</title>
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
    
    // Increment verification count
    await supabase.update('certificates', { id: cert.id }, {
      verification_count: (cert.verification_count || 0) + 1
    })
    
    const completionDate = new Date(cert.completion_date).toLocaleDateString('pt-BR')
    const issueDate = new Date(cert.issued_at).toLocaleDateString('pt-BR')
    
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
        const courseModules = await supabase.query('modules', {
          select: 'title, order_index',
          filters: { course_id: cert.course_id },
          order: 'order_index.asc'
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
            </div>
            
            ${modulesHTML}
            
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-gray-500 block mb-1">Código de Verificação</span>
                  <span class="text-sm font-mono font-bold text-gray-800">${cert.verification_code}</span>
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
              <p class="mb-1">
                Certificado emitido por <strong>CCT 2026 - Centro de Capacitação Técnica</strong>
              </p>
              <p class="text-xs">
                <strong>CENTRO DE ENSINO E APRENDIZAGEM PLUS LTDA</strong><br>
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const certificates = await supabase.query('certificates', {
      select: '*',
      filters: { verification_code: code }
    })
    
    if (!certificates || certificates.length === 0) {
      return c.json({ valid: false, message: 'Certificate not found' }, 404)
    }
    
    const cert = certificates[0]
    
    // Increment verification count
    await supabase.update('certificates', { id: cert.id }, {
      verification_count: (cert.verification_count || 0) + 1
    })
    
    return c.json({
      valid: true,
      certificate: {
        student_name: cert.user_name,
        course_title: cert.course_title,
        workload: cert.carga_horaria,
        completion_date: cert.completion_date,
        issued_at: cert.issued_at,
        verification_code: cert.verification_code,
        verification_count: cert.verification_count + 1
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
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const subscriptions = await supabase.query('member_subscriptions', {
      select: '*',
      order: 'created_at.desc'
    })
    
    return c.json({ subscriptions: subscriptions || [] })
  } catch (error: any) {
    console.error('List member subscriptions error:', error)
    return c.json({ error: error.message || 'Failed to list member subscriptions' }, 500)
  }
})

// Find member subscription by email (for duplicate checking)
app.get('/api/admin/member-subscriptions/find', requireAdmin, async (c) => {
  try {
    const email = c.req.query('email')
    
    if (!email) {
      return c.json({ error: 'Email parameter is required' }, 400)
    }
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const subscriptions = await supabase.query('member_subscriptions', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const result = await supabase.insert('member_subscriptions', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    await supabase.update('member_subscriptions', { id: subId }, {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.delete('member_subscriptions', { id: subId })
    
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
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Check if user is admin
    const token = getCookie(c, 'sb-access-token')
    let isAdmin = false
    
    if (token) {
      const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
      if (user) {
        const adminResult = await supabase.query('admins', {
          select: 'id',
          filters: { email: user.email },
          single: true
        })
        isAdmin = !!adminResult
      }
    }
    
    // Get courses - filter by is_published if not admin
    const filters = isAdmin ? {} : { is_published: true }
    
    const courses = await supabase.query('courses', {
      select: '*',
      filters,
      order: 'created_at.desc'
    })
    
    // For each course, count modules and lessons
    const coursesWithCounts = await Promise.all(courses.map(async (course: any) => {
      const modules = await supabase.query('modules', {
        select: 'id',
        filters: { course_id: course.id }
      })
      
      let lessonsCount = 0
      for (const module of modules) {
        const lessons = await supabase.query('lessons', {
          select: 'id',
          filters: { module_id: module.id }
        })
        lessonsCount += lessons.length
      }
      
      return {
        ...course,
        modules_count: modules.length,
        lessons_count: lessonsCount
      }
    }))
    
    return c.json({ courses: coursesWithCounts })
  } catch (error) {
    return c.json({ error: 'Failed to fetch courses' }, 500)
  }
})

// Get single course with modules and lessons
app.get('/api/courses/:id', async (c) => {
  try {
    const courseId = c.req.param('id')
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Get course
    const course = await supabase.query('courses', {
      select: '*',
      filters: { id: courseId },
      single: true
    })
    
    if (!course) {
      return c.json({ error: 'Course not found' }, 404)
    }
    
    // Get modules with lessons
    const modules = await supabase.query('modules', {
      select: '*',
      filters: { course_id: courseId },
      order: 'order_index'
    })
    
    // Get lessons for each module
    for (const module of modules) {
      const lessons = await supabase.query('lessons', {
        select: '*',
        filters: { module_id: module.id },
        order: 'order_index'
      })
      module.lessons = lessons
    }
    
    return c.json({ course, modules })
  } catch (error) {
    return c.json({ error: 'Failed to fetch course' }, 500)
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Check if user has access to this lesson
    if (userEmail) {
      try {
        const accessResult = await supabase.rpc('user_has_lesson_access', {
          email_usuario: userEmail,
          lesson_id: parseInt(lessonId)
        })
        
        console.log('Access check result:', accessResult)
        
        // Handle different return formats
        let hasAccess = false
        if (Array.isArray(accessResult) && accessResult.length > 0) {
          // If returns array of objects: [{user_has_lesson_access: true}]
          hasAccess = accessResult[0].user_has_lesson_access || accessResult[0] === true || accessResult[0]
        } else if (typeof accessResult === 'boolean') {
          // If returns boolean directly
          hasAccess = accessResult
        }
        
        console.log('Has access:', hasAccess, 'User:', userEmail, 'Lesson:', lessonId)
        
        if (!hasAccess) {
          console.log('❌ Access denied for user:', userEmail, 'lesson:', lessonId)
          return c.json({ 
            error: 'Access denied',
            message: 'Você não tem permissão para acessar esta aula. Faça upgrade do seu plano!',
            needsUpgrade: true
          }, 403)
        }
        
        console.log('✅ Access granted for user:', userEmail, 'lesson:', lessonId)
      } catch (rpcError: any) {
        console.error('❌ Error checking access via RPC:', rpcError)
        // If RPC fails, allow access temporarily (fallback)
        console.log('⚠️ Allowing access due to RPC error (fallback mode)')
      }
    } else {
      // Not authenticated - check if lesson is free
      const lesson = await supabase.query('lessons', {
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
    
    // Get lesson with module info (using RPC for join)
    const lesson = await supabase.rpc('get_lesson_with_module', {
      p_lesson_id: parseInt(lessonId)
    })
    
    if (!lesson || lesson.length === 0) {
      return c.json({ error: 'Lesson not found' }, 404)
    }
    
    // Get comments
    const comments = await supabase.query('comments', {
      select: '*',
      filters: { lesson_id: lessonId },
      order: 'created_at.desc'
    })
    
    return c.json({ lesson: lesson[0], comments })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return c.json({ error: 'Failed to fetch lesson' }, 500)
  }
})

// ============================================
// API ROUTES - COMMENTS
// ============================================

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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Get user name from user metadata or email
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
    
    const result = await supabase.insert('comments', {
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

// Get user progress for a course
app.get('/api/progress/:email/:courseId', async (c) => {
  try {
    const email = c.req.param('email')
    const courseId = c.req.param('courseId')
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Use RPC function to get progress with joins
    const progress = await supabase.rpc('get_user_course_progress', {
      p_user_email: email,
      p_course_id: parseInt(courseId)
    })
    
    return c.json({ progress: progress || [] })
  } catch (error) {
    return c.json({ error: 'Failed to fetch progress' }, 500)
  }
})

// Mark lesson as completed
app.post('/api/progress/complete', async (c) => {
  try {
    const { user_email, lesson_id } = await c.req.json()
    
    if (!user_email || !lesson_id) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Check if progress exists
    const existing = await supabase.query('user_progress', {
      select: '*',
      filters: { user_email, lesson_id }
    })
    
    if (existing.length > 0) {
      // Update existing
      await supabase.update('user_progress', { id: existing[0].id }, {
        completed: true,
        completed_at: new Date().toISOString()
      })
    } else {
      // Insert new
      await supabase.insert('user_progress', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Find and delete progress
    const existing = await supabase.query('user_progress', {
      select: '*',
      filters: { user_email, lesson_id }
    })
    
    if (existing.length > 0) {
      await supabase.delete('user_progress', { id: existing[0].id })
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
    const { course_id, image_data, file_name } = body
    
    console.log('📜 Certificate template upload:', { 
      course_id, 
      has_image: !!image_data,
      file_name 
    })
    
    if (!course_id || !image_data || !file_name) {
      return c.json({ 
        error: 'ID do curso, imagem e nome do arquivo são obrigatórios' 
      }, 400)
    }
    
    // Convert base64 to binary
    const base64Data = image_data.split(',')[1] // Remove data:image/xxx;base64, prefix
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
    
    // Upload to Supabase Storage
    const storagePath = `certificate-templates/${course_id}/${file_name}`
    
    const uploadResponse = await fetch(
      `${c.env.SUPABASE_URL}/storage/v1/object/certificate-templates/${course_id}/${file_name}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.SUPABASE_ANON_KEY}`,
          'apikey': c.env.SUPABASE_ANON_KEY,
          'Content-Type': 'image/jpeg',
          'x-upsert': 'true' // Overwrite if exists
        },
        body: binaryData
      }
    )
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch (e) {
        error = { message: errorText }
      }
      console.error('❌ Storage upload failed:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error,
        url: `${c.env.SUPABASE_URL}/storage/v1/object/certificate-templates/${course_id}/${file_name}`
      })
      return c.json({ 
        error: 'Erro ao fazer upload da imagem para o Supabase Storage',
        details: error,
        status: uploadResponse.status,
        hint: uploadResponse.status === 404 
          ? 'Bucket "certificate-templates" não existe. Crie-o no Supabase Dashboard → Storage'
          : 'Verifique as permissões do bucket no Supabase Storage'
      }, 400)
    }
    
    console.log('✅ Image uploaded to Supabase Storage')
    
    // Generate public URL
    const template_url = `${c.env.SUPABASE_URL}/storage/v1/object/public/certificate-templates/${course_id}/${file_name}`
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Check if template already exists for this course
    const existing = await supabase.query('certificate_templates', {
      select: '*',
      filters: { course_id }
    })
    
    if (existing.length > 0) {
      // Update existing template
      await supabase.update('certificate_templates', { id: existing[0].id }, {
        template_url,
        updated_at: new Date().toISOString()
      })
      console.log('✅ Certificate template updated in database')
    } else {
      // Insert new template
      await supabase.insert('certificate_templates', {
        course_id: parseInt(course_id),
        template_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      console.log('✅ Certificate template created in database')
    }
    
    return c.json({ 
      success: true,
      template_url,
      message: 'Template de certificado salvo com sucesso!'
    })
  } catch (error: any) {
    console.error('💥 Certificate template error:', error)
    return c.json({ 
      error: 'Erro ao salvar template de certificado',
      details: error.message 
    }, 500)
  }
})

// Get certificate template for a course
app.get('/api/certificate-template/:courseId', async (c) => {
  try {
    const courseId = c.req.param('courseId')
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const template = await supabase.query('certificate_templates', {
      select: '*',
      filters: { course_id: courseId },
      single: true
    })
    
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Check if certificate already exists
    const existing = await supabase.query('certificates', {
      select: '*',
      filters: { 
        user_email: user.email, 
        course_id 
      }
    })
    
    if (existing.length > 0) {
      console.log('✅ Certificate already exists')
      return c.json({ 
        success: true,
        certificate: existing[0],
        message: 'Certificado já existe!'
      })
    }
    
    // Verify user has completed 100% of the course
    const course = await supabase.query('courses', {
      select: '*',
      filters: { id: course_id },
      single: true
    })
    
    if (!course) {
      return c.json({ error: 'Curso não encontrado' }, 404)
    }
    
    // Get all lessons in the course
    const modules = await supabase.query('modules', {
      select: '*',
      filters: { course_id }
    })
    
    let allLessonIds: number[] = []
    for (const module of modules) {
      const lessons = await supabase.query('lessons', {
        select: 'id',
        filters: { module_id: module.id }
      })
      allLessonIds = [...allLessonIds, ...lessons.map((l: any) => l.id)]
    }
    
    if (allLessonIds.length === 0) {
      return c.json({ error: 'Curso não possui aulas' }, 400)
    }
    
    // Check user progress
    const progress = await supabase.query('user_progress', {
      select: '*',
      filters: { user_email: user.email }
    })
    
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
    const certificate = await supabase.insert('certificates', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const certificates = await supabase.query('certificates', {
      select: '*',
      filters: { user_email: user.email },
      order: 'issued_at.desc'
    })
    
    // Get certificate templates for each certificate
    const certificatesWithTemplates = await Promise.all(
      certificates.map(async (cert: any) => {
        const template = await supabase.query('certificate_templates', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const certificate = await supabase.query('certificates', {
      select: '*',
      filters: { id: certId },
      single: true
    })
    
    if (!certificate) {
      return c.json({ error: 'Certificado não encontrado' }, 404)
    }
    
    // Get template
    const template = await supabase.query('certificate_templates', {
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
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const plans = await supabase.query('plans', {
      select: '*',
      filters: { is_active: true },
      order: 'display_order'
    })
    
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Get user's active subscription with plan details
    const result = await supabase.rpc('get_user_current_plan', {
      p_user_email: user.email
    })
    
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Get plan details
    const plan = await supabase.query('plans', {
      select: '*',
      filters: { id: plan_id },
      single: true
    })
    
    if (!plan) {
      return c.json({ error: 'Plano não encontrado' }, 404)
    }
    
    // Calculate end date
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (duration_days || plan.duration_days))
    
    // Check if user already has active subscription
    const existing = await supabase.query('subscriptions', {
      select: '*',
      filters: { user_email, status: 'active' }
    })
    
    if (existing.length > 0) {
      // Update existing subscription
      await supabase.update('subscriptions', { id: existing[0].id }, {
        plan_id,
        end_date: endDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      
      return c.json({ 
        success: true,
        message: 'Assinatura atualizada com sucesso!',
        subscription: existing[0]
      })
    } else {
      // Create new subscription
      const subscription = await supabase.insert('subscriptions', {
        user_email,
        plan_id,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      })
      
      return c.json({ 
        success: true,
        message: 'Assinatura criada com sucesso!',
        subscription: subscription[0]
      })
    }
  } catch (error) {
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
      const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
      const lesson = await supabase.query('lessons', {
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Use the database function to check access
    const result = await supabase.rpc('user_has_lesson_access', {
      email_usuario: user.email,
      lesson_id: parseInt(lessonId)
    })
    
    const hasAccess = result && result.length > 0 ? result[0] : false
    
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
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    await supabase.rpc('expire_subscriptions', {})
    
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
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const plans = await supabase.query('plans', {
      select: '*',
      order: 'display_order'
    })
    
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (id) {
      // Update existing plan
      await supabase.update('plans', { id }, {
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
      const plan = await supabase.insert('plans', {
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
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const subscriptions = await supabase.query('subscriptions', {
      select: '*',
      order: 'created_at.desc'
    })
    
    // Get plan details for each subscription
    const subscriptionsWithPlans = await Promise.all(
      subscriptions.map(async (sub: any) => {
        const plan = await supabase.query('plans', {
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

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CCT - Clube do Cálculo Trabalhista</title>
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
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
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
                        <div class="flex items-center gap-3 md:gap-4">
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
                        </div>
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
                        
                        <!-- Search Button -->
                        <button onclick="app.showSearch(this)" 
                                class="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs md:text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="fas fa-search"></i>
                            <span class="hidden sm:inline ml-2">Buscar</span>
                        </button>
                        
                        <!-- Plans Button -->
                        <button onclick="app.showPlans()" 
                                class="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-crown"></i>
                            <span class="hidden sm:inline ml-2">Planos</span>
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
                        <button onclick="app.showAdminPanel()" 
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

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/auth.js"></script>
        <script src="/static/admin.js"></script>
        <script src="/static/access-control.js"></script>
        <script src="/static/app.js"></script>
        <script src="/static/search.js"></script>
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
    <script src="/static/auth.js"></script>
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
                const completionDate = new Date(cert.completion_date).toLocaleDateString('pt-BR')
                const verificationUrl = \`\${window.location.origin}/verificar/\${cert.verification_code}\`

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
                                    <p class="text-blue-100 text-sm">Concluído em \${completionDate}</p>
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
                                        \${cert.verification_code}
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

                                <button onclick="shareCertificate('\${verificationUrl}')" 
                                    class="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-share-alt"></i>
                                    Compartilhar Link
                                </button>
                            </div>

                            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div class="text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Verificação: <a href="\${verificationUrl}" target="_blank" class="text-blue-600 hover:underline break-all">\${verificationUrl}</a>
                                </div>
                            </div>
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
    <script src="/static/auth.js"></script>
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
                
                // Load subscription history
                loadSubscriptionHistory(user.email)
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
                
                if (subscriptions.length === 0) {
                    container.innerHTML = \`
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                            <p class="text-lg font-semibold">Nenhum plano encontrado</p>
                            <p class="text-sm">Você ainda não possui histórico de assinaturas</p>
                        </div>
                    \`
                    return
                }
                
                // Separar planos ativos e expirados
                const now = new Date()
                const activePlans = subscriptions.filter(s => new Date(s.data_expiracao) > now)
                const expiredPlans = subscriptions.filter(s => new Date(s.data_expiracao) <= now)
                
                let html = ''
                
                // Mostrar planos ativos primeiro
                if (activePlans.length > 0) {
                    html += \`
                        <div class="mb-6">
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
                
                // Mostrar planos expirados
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
                </div>
            \`
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
    <script src="/static/auth.js"></script>
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
