// Auth Manager
const authManager = {
  currentUser: null,
  
  // Initialize - check if user is logged in
  async init() {
    // Check for auth callback tokens in URL hash
    await this.handleAuthCallback()
    
    try {
      const response = await axios.get('/api/auth/me')
      this.currentUser = response.data.user
      return this.currentUser
    } catch (error) {
      this.currentUser = null
      return null
    }
  },
  
  // Handle Supabase auth callback (email confirmation, OAuth)
  async handleAuthCallback() {
    const hash = window.location.hash
    if (!hash) return
    
    // Parse tokens from hash
    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')
    
    if (accessToken) {
      try {
        // Send tokens to backend to set cookies
        await axios.post('/api/auth/callback', {
          access_token: accessToken,
          refresh_token: refreshToken,
          type: type
        })
        
        // Clear hash from URL
        window.history.replaceState(null, '', window.location.pathname)
      } catch (error) {
        console.error('Auth callback error:', error)
      }
    }
  },
  
  // Login
  async login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      
      if (response.data.success) {
        this.currentUser = response.data.user
        return { success: true, user: response.data.user }
      }
      
      return { success: false, error: 'Login failed' }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  },
  
  // Register
  async register(email, password, name) {
    try {
      const response = await axios.post('/api/auth/register', { 
        email, 
        password, 
        name 
      })
      
      return { 
        success: true, 
        message: response.data.message,
        user: response.data.user
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  },
  
  // Logout
  async logout() {
    try {
      await axios.post('/api/auth/logout')
      this.currentUser = null
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Logout failed' }
    }
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null
  },
  
  // Get user email
  getUserEmail() {
    return this.currentUser?.email || 'usuario@example.com'
  },
  
  // Get user name
  getUserName() {
    return this.currentUser?.user_metadata?.name || this.currentUser?.email?.split('@')[0] || 'Aluno'
  }
}

// Login/Register UI Manager
const authUI = {
  // Show login form
  showLoginForm() {
    const html = `
      <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white text-center">
            <i class="fas fa-calculator text-5xl mb-3"></i>
            <h1 class="text-2xl font-bold">CCT</h1>
            <p class="text-blue-200 text-sm">Clube do Cálculo Trabalhista</p>
          </div>
          
          <div class="p-8">
            <!-- Tabs -->
            <div class="flex border-b border-gray-200 mb-6">
              <button onclick="authUI.switchTab('login')" 
                      id="loginTab"
                      class="flex-1 py-3 font-semibold text-blue-600 border-b-2 border-blue-600 transition-colors">
                Entrar
              </button>
              <button onclick="authUI.switchTab('register')" 
                      id="registerTab"
                      class="flex-1 py-3 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors">
                Registrar
              </button>
            </div>
            
            <!-- Login Form -->
            <div id="loginForm">
              <div id="loginError" class="hidden mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"></div>
              
              <form onsubmit="authUI.handleLogin(event)" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-envelope mr-1"></i> Email
                  </label>
                  <input type="email" 
                         id="loginEmail" 
                         required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="seu@email.com">
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-lock mr-1"></i> Senha
                  </label>
                  <input type="password" 
                         id="loginPassword" 
                         required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="••••••••">
                </div>
                
                <button type="submit" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <i class="fas fa-sign-in-alt"></i>
                  Entrar
                </button>
              </form>
              
              <div class="mt-6 text-center text-sm text-gray-600">
                <p>Use qualquer email para testar</p>
                <p class="text-xs mt-1 text-gray-400">Exemplo: teste@email.com / senha123</p>
              </div>
            </div>
            
            <!-- Register Form -->
            <div id="registerForm" class="hidden">
              <div id="registerError" class="hidden mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"></div>
              <div id="registerSuccess" class="hidden mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm"></div>
              
              <form onsubmit="authUI.handleRegister(event)" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-user mr-1"></i> Nome Completo
                  </label>
                  <input type="text" 
                         id="registerName" 
                         required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Seu nome">
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-envelope mr-1"></i> Email
                  </label>
                  <input type="email" 
                         id="registerEmail" 
                         required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="seu@email.com">
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-lock mr-1"></i> Senha
                  </label>
                  <input type="password" 
                         id="registerPassword" 
                         required
                         minlength="6"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Mínimo 6 caracteres">
                </div>
                
                <button type="submit" 
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <i class="fas fa-user-plus"></i>
                  Criar Conta
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.innerHTML = html
  },
  
  // Switch between login/register tabs
  switchTab(tab) {
    const loginTab = document.getElementById('loginTab')
    const registerTab = document.getElementById('registerTab')
    const loginForm = document.getElementById('loginForm')
    const registerForm = document.getElementById('registerForm')
    
    if (tab === 'login') {
      loginTab.classList.add('text-blue-600', 'border-blue-600')
      loginTab.classList.remove('text-gray-400', 'border-transparent')
      registerTab.classList.add('text-gray-400', 'border-transparent')
      registerTab.classList.remove('text-blue-600', 'border-blue-600')
      loginForm.classList.remove('hidden')
      registerForm.classList.add('hidden')
    } else {
      registerTab.classList.add('text-blue-600', 'border-blue-600')
      registerTab.classList.remove('text-gray-400', 'border-transparent')
      loginTab.classList.add('text-gray-400', 'border-transparent')
      loginTab.classList.remove('text-blue-600', 'border-blue-600')
      registerForm.classList.remove('hidden')
      loginForm.classList.add('hidden')
    }
  },
  
  // Handle login
  async handleLogin(event) {
    event.preventDefault()
    
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    const errorDiv = document.getElementById('loginError')
    
    errorDiv.classList.add('hidden')
    
    const result = await authManager.login(email, password)
    
    if (result.success) {
      // Redirect to main app
      window.location.reload()
    } else {
      errorDiv.textContent = result.error
      errorDiv.classList.remove('hidden')
    }
  },
  
  // Handle register
  async handleRegister(event) {
    event.preventDefault()
    
    const name = document.getElementById('registerName').value
    const email = document.getElementById('registerEmail').value
    const password = document.getElementById('registerPassword').value
    const errorDiv = document.getElementById('registerError')
    const successDiv = document.getElementById('registerSuccess')
    
    errorDiv.classList.add('hidden')
    successDiv.classList.add('hidden')
    
    const result = await authManager.register(email, password, name)
    
    if (result.success) {
      successDiv.textContent = result.message
      successDiv.classList.remove('hidden')
      
      // Switch to login tab after 3 seconds
      setTimeout(() => {
        authUI.switchTab('login')
      }, 3000)
    } else {
      errorDiv.textContent = result.error
      errorDiv.classList.remove('hidden')
    }
  }
}
