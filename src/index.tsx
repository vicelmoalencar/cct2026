import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database;
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

// ============================================
// API ROUTES - COURSES
// ============================================

// Get all courses
app.get('/api/courses', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        c.*,
        COUNT(DISTINCT m.id) as modules_count,
        COUNT(DISTINCT l.id) as lessons_count
      FROM courses c
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN lessons l ON m.id = l.module_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all()
    
    return c.json({ courses: results })
  } catch (error) {
    return c.json({ error: 'Failed to fetch courses' }, 500)
  }
})

// Get single course with modules and lessons
app.get('/api/courses/:id', async (c) => {
  try {
    const courseId = c.req.param('id')
    
    // Get course
    const course = await c.env.DB.prepare(`
      SELECT * FROM courses WHERE id = ?
    `).bind(courseId).first()
    
    if (!course) {
      return c.json({ error: 'Course not found' }, 404)
    }
    
    // Get modules with lessons
    const { results: modules } = await c.env.DB.prepare(`
      SELECT * FROM modules WHERE course_id = ? ORDER BY order_index
    `).bind(courseId).all()
    
    // Get lessons for each module
    for (const module of modules) {
      const { results: lessons } = await c.env.DB.prepare(`
        SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index
      `).bind(module.id).all()
      
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
    
    // Get lesson
    const lesson = await c.env.DB.prepare(`
      SELECT l.*, m.title as module_title, m.course_id
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      WHERE l.id = ?
    `).bind(lessonId).first()
    
    if (!lesson) {
      return c.json({ error: 'Lesson not found' }, 404)
    }
    
    // Get comments
    const { results: comments } = await c.env.DB.prepare(`
      SELECT * FROM comments WHERE lesson_id = ? ORDER BY created_at DESC
    `).bind(lessonId).all()
    
    return c.json({ lesson, comments })
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
    
    const result = await c.env.DB.prepare(`
      INSERT INTO comments (lesson_id, user_name, user_email, comment_text)
      VALUES (?, ?, ?, ?)
    `).bind(lessonId, user_name, user_email, comment_text).run()
    
    return c.json({ 
      success: true, 
      comment_id: result.meta.last_row_id 
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
    
    const { results } = await c.env.DB.prepare(`
      SELECT up.*, l.module_id
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      WHERE up.user_email = ? AND m.course_id = ?
    `).bind(email, courseId).all()
    
    return c.json({ progress: results })
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
    
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO user_progress (user_email, lesson_id, completed, completed_at)
      VALUES (?, ?, 1, datetime('now'))
    `).bind(user_email, lesson_id).run()
    
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
    
    await c.env.DB.prepare(`
      DELETE FROM user_progress WHERE user_email = ? AND lesson_id = ?
    `).bind(user_email, lesson_id).run()
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update progress' }, 500)
  }
})

// ============================================
// FRONTEND - Main page
// ============================================

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
          .lesson-item:hover { background-color: #f3f4f6; }
          .completed { background-color: #d1fae5 !important; }
          .module-header { cursor: pointer; }
          .module-content { display: none; }
          .module-content.active { display: block; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold">
                            <i class="fas fa-calculator mr-2"></i>
                            CCT - Clube do Cálculo Trabalhista
                        </h1>
                        <p class="text-blue-200 mt-1">Domine os cálculos da Justiça do Trabalho</p>
                    </div>
                    <div class="text-right">
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-user-circle text-2xl"></i>
                                <div>
                                    <p class="text-sm">Bem-vindo,</p>
                                    <p class="font-semibold" id="userName">Aluno</p>
                                </div>
                            </div>
                            <button onclick="app.logout()" 
                                    class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                <i class="fas fa-sign-out-alt"></i>
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- View: Courses List -->
            <div id="coursesView">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Meus Cursos</h2>
                    <p class="text-gray-600">Escolha um curso para continuar seu aprendizado</p>
                </div>
                <div id="coursesList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
