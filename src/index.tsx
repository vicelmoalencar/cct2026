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

// Update user profile (name)
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

// Create course (admin only)
app.post('/api/admin/courses', requireAdmin, async (c) => {
  try {
    const { title, description, duration_hours, instructor } = await c.req.json()
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const result = await supabase.insert('courses', {
      title,
      description: description || null,
      duration_hours: duration_hours || 0,
      instructor: instructor || 'Vicelmo'
    })
    
    return c.json({ 
      success: true, 
      course_id: result[0].id
    })
  } catch (error) {
    return c.json({ error: 'Failed to create course' }, 500)
  }
})

// Update course (admin only)
app.put('/api/admin/courses/:id', requireAdmin, async (c) => {
  try {
    const courseId = c.req.param('id')
    const { title, description, duration_hours, instructor } = await c.req.json()
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    await supabase.update('courses', { id: courseId }, {
      title,
      description: description || null,
      duration_hours: duration_hours || 0,
      instructor: instructor || 'Vicelmo'
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
  } catch (error) {
    return c.json({ error: 'Failed to create module' }, 500)
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

// Create lesson (admin only)
app.post('/api/admin/lessons', requireAdmin, async (c) => {
  try {
    const { module_id, title, description, video_provider, video_id, duration_minutes, order_index, support_text, transcript, attachments } = await c.req.json()
    
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
      support_text: support_text || null,
      transcript: transcript || null,
      attachments: attachments || []
    })
    
    return c.json({ 
      success: true, 
      lesson_id: result[0].id
    })
  } catch (error) {
    return c.json({ error: 'Failed to create lesson' }, 500)
  }
})

// Update lesson (admin only)
app.put('/api/admin/lessons/:id', requireAdmin, async (c) => {
  try {
    const lessonId = c.req.param('id')
    const { title, description, video_provider, video_id, duration_minutes, order_index, support_text, transcript, attachments } = await c.req.json()
    
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

// ============================================
// API ROUTES - COURSES
// ============================================

// Get all courses
app.get('/api/courses', async (c) => {
  try {
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Get all courses
    const courses = await supabase.query('courses', {
      select: '*',
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
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
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
    const { user_name, user_email, comment_text } = await c.req.json()
    
    if (!user_name || !user_email || !comment_text) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const result = await supabase.insert('comments', {
      lesson_id: parseInt(lessonId),
      user_name,
      user_email,
      comment_text
    })
    
    return c.json({ 
      success: true, 
      comment_id: result[0].id
    })
  } catch (error) {
    return c.json({ error: 'Failed to add comment' }, 500)
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
      // Not logged in - check if lesson is free trial
      const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
      const lesson = await supabase.query('lessons', {
        select: 'free_trial',
        filters: { id: lessonId },
        single: true
      })
      
      return c.json({ 
        hasAccess: lesson?.free_trial || false,
        reason: lesson?.free_trial ? 'free_trial' : 'not_authenticated'
      })
    }
    
    const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    if (!user) {
      return c.json({ hasAccess: false, reason: 'invalid_token' })
    }
    
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Use the database function to check access
    const result = await supabase.rpc('user_has_lesson_access', {
      p_user_email: user.email,
      p_lesson_id: parseInt(lessonId)
    })
    
    const hasAccess = result && result.length > 0 ? result[0].user_has_lesson_access : false
    
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
        </main>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/auth.js"></script>
        <script src="/static/admin.js"></script>
        <script src="/static/app.js"></script>
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
                        <i class="fas fa-graduation-cap text-3xl"></i>
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
                    <form id="profileForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-user mr-1 text-blue-600"></i> Nome Completo
                            </label>
                            <input type="text" 
                                   id="profileName" 
                                   required
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Seu nome completo">
                        </div>
                        
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
                        
                        <button type="submit" 
                                id="profileSubmitBtn"
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <i class="fas fa-save"></i>
                            Salvar Alterações
                        </button>
                    </form>
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
                const response = await axios.get('/api/auth/me')
                
                if (response.data.user) {
                    const user = response.data.user
                    
                    // Update profile form
                    document.getElementById('profileName').value = user.user_metadata?.name || ''
                    document.getElementById('profileEmail').value = user.email || ''
                    
                    // Update header
                    document.getElementById('userName').textContent = user.user_metadata?.name || 'Usuário'
                    document.getElementById('userEmail').textContent = user.email || ''
                    document.getElementById('userInfo').classList.remove('hidden')
                } else {
                    window.location.href = '/'
                }
            } catch (error) {
                console.error('Error loading profile:', error)
                window.location.href = '/'
            }
        }
        
        // Handle profile form submission
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const name = document.getElementById('profileName').value.trim()
            
            if (!name) {
                showMessage('❌ Por favor, preencha seu nome', true)
                return
            }
            
            profileSubmitBtn.disabled = true
            profileSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...'
            
            try {
                const response = await axios.put('/api/auth/profile', { name })
                
                if (response.data.success) {
                    showMessage('✅ ' + response.data.message, false)
                    document.getElementById('userName').textContent = name
                    
                    // Reload user data
                    await loadUserProfile()
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
                        <i class="fas fa-graduation-cap text-3xl"></i>
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
