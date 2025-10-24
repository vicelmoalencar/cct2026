import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { SupabaseClient } from './supabase-client'

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

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
    const { email, password } = await c.req.json()
    
    const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return c.json({ error: data.error_description || 'Login failed' }, 400)
    }
    
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
  
  const user = await verifySupabaseToken(token, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  
  return c.json({ user })
})

// Auth callback - handles email confirmation, OAuth redirects, and password recovery
app.get('/auth/callback', async (c) => {
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
  
  // If type is recovery, redirect to reset-password page with token
  if (type === 'recovery') {
    return c.redirect(`/reset-password#access_token=${accessToken}&refresh_token=${refreshToken || ''}&type=recovery`)
  }
  
  // Set cookies for normal auth
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
})

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
    const { token, password } = await c.req.json()
    
    if (!token || !password) {
      return c.json({ error: 'Token and password are required' }, 400)
    }
    
    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400)
    }
    
    const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': c.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ password })
    })
    
    if (!response.ok) {
      const data = await response.json()
      return c.json({ error: data.error_description || 'Failed to reset password' }, 400)
    }
    
    const data = await response.json()
    
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
// FRONTEND - Main page
// ============================================

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
                <!-- Hero Section -->
                <div class="mb-6 md:mb-8 text-center px-4">
                    <h2 class="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3">
                        📚 Explore Nossos Cursos
                    </h2>
                    <p class="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Escolha um curso e comece sua jornada de aprendizado. Aprenda no seu ritmo com conteúdo de qualidade.
                    </p>
                </div>
                
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

export default app
