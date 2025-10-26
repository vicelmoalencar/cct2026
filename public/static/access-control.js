// ============================================================================
// ACCESS CONTROL MANAGER - Gerenciamento de Acesso e UI
// ============================================================================

const accessManager = {
  userAccessStatus: null,
  
  // Initialize access control
  async init() {
    await this.loadUserAccessStatus()
    this.renderAccessBanner()
    this.attachLessonClickHandlers()
  },
  
  // Load user access status from API
  async loadUserAccessStatus() {
    try {
      const response = await axios.get('/api/user/access-status')
      this.userAccessStatus = response.data
      console.log('User access status:', this.userAccessStatus)
    } catch (error) {
      console.error('Error loading access status:', error)
      // Default to no access if error
      this.userAccessStatus = {
        accessType: 'SEM_ACESSO',
        hasFullAccess: false
      }
    }
  },
  
  // Render access banner at the top of the page
  renderAccessBanner() {
    const existingBanner = document.getElementById('accessBanner')
    if (existingBanner) {
      existingBanner.remove()
    }
    
    const { accessType, expirationDate } = this.userAccessStatus
    
    let bannerHTML = ''
    
    if (accessType === 'COMPLETO') {
      // Green banner - Full access
      const expDate = new Date(expirationDate)
      const daysLeft = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24))
      
      bannerHTML = `
        <div id="accessBanner" class="bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 shadow-md">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-check-circle text-2xl"></i>
              <div>
                <div class="font-bold text-lg">✅ Acesso Completo</div>
                <div class="text-sm opacity-90">Você tem acesso a todas as 754 aulas do curso</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm opacity-90">Expira em</div>
              <div class="font-bold">${daysLeft} dias</div>
            </div>
          </div>
        </div>
      `
    } else if (accessType === 'TESTE_GRATIS') {
      // Yellow banner - Free trial
      const expDate = new Date(expirationDate)
      const daysLeft = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24))
      
      bannerHTML = `
        <div id="accessBanner" class="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white py-3 px-6 shadow-md">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-gift text-2xl"></i>
              <div>
                <div class="font-bold text-lg">⚠️ Teste Grátis - 253 aulas disponíveis</div>
                <div class="text-sm opacity-90">Upgrade para acesso completo a todas as 754 aulas</div>
              </div>
            </div>
            <div class="text-right">
              <button onclick="accessManager.showUpgradeModal()" class="bg-white text-yellow-600 px-4 py-2 rounded-lg font-bold hover:bg-yellow-50 transition-colors">
                <i class="fas fa-crown mr-2"></i>Fazer Upgrade
              </button>
            </div>
          </div>
        </div>
      `
    } else {
      // Red banner - No access / Expired
      bannerHTML = `
        <div id="accessBanner" class="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-6 shadow-md">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-exclamation-triangle text-2xl"></i>
              <div>
                <div class="font-bold text-lg">❌ Plano Expirado - Renove agora</div>
                <div class="text-sm opacity-90">Você tem acesso apenas às 253 aulas gratuitas. Renove para acesso completo!</div>
              </div>
            </div>
            <div class="text-right">
              <button onclick="accessManager.showUpgradeModal()" class="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors">
                <i class="fas fa-shopping-cart mr-2"></i>Renovar Plano
              </button>
            </div>
          </div>
        </div>
      `
    }
    
    // Insert banner after header
    const header = document.querySelector('header')
    if (header) {
      header.insertAdjacentHTML('afterend', bannerHTML)
    }
  },
  
  // Check if user can access a specific lesson
  async checkLessonAccess(lessonId) {
    try {
      const response = await axios.get(`/api/lessons/${lessonId}/access`)
      return response.data
    } catch (error) {
      console.error('Error checking lesson access:', error)
      return { hasAccess: false, reason: 'error' }
    }
  },
  
  // Add lock icons and click handlers to lessons
  async attachLessonClickHandlers() {
    // Wait for lessons to be loaded
    setTimeout(() => {
      const lessonItems = document.querySelectorAll('.lesson-item')
      
      for (const item of lessonItems) {
        const isPremium = item.dataset.isPremium === 'true'
        const lessonId = item.dataset.lessonId
        
        if (!lessonId) continue
        
        // If premium lesson and user doesn't have full access
        if (isPremium && this.userAccessStatus?.accessType !== 'COMPLETO') {
          // Add visual styling
          item.style.opacity = '0.7'
          item.classList.add('premium-locked')
          
          // Override click handler
          const originalOnClick = item.getAttribute('onclick')
          item.removeAttribute('onclick')
          
          // Add new click handler that shows modal
          item.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.showUpgradeModal()
          })
        }
      }
    }, 500)
  },
  
  // Add lock icon to lesson item
  addLockIcon(lessonItem) {
    const title = lessonItem.querySelector('.lesson-title, h4, .text-gray-800')
    if (title && !title.querySelector('.fa-lock')) {
      const lockIcon = document.createElement('i')
      lockIcon.className = 'fas fa-lock text-red-500 ml-2'
      title.appendChild(lockIcon)
    }
  },
  
  // Show upgrade modal
  showUpgradeModal() {
    const { accessType } = this.userAccessStatus
    
    let modalTitle = ''
    let modalMessage = ''
    let ctaText = ''
    
    if (accessType === 'TESTE_GRATIS') {
      modalTitle = '🔒 Aula Premium Bloqueada'
      modalMessage = `
        <p class="text-gray-700 mb-4">
          Esta aula faz parte do conteúdo premium e está disponível apenas para membros com plano pago.
        </p>
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
          <div class="flex items-start">
            <i class="fas fa-gift text-yellow-600 text-xl mr-3 mt-1"></i>
            <div>
              <p class="font-bold text-yellow-800">Você está no Teste Grátis</p>
              <p class="text-sm text-yellow-700">Acesso a 253 aulas gratuitas. Faça upgrade para acessar todas as 754 aulas!</p>
            </div>
          </div>
        </div>
        <ul class="text-left space-y-2 mb-6">
          <li class="flex items-center gap-2">
            <i class="fas fa-check text-green-600"></i>
            <span>Acesso completo a <strong>754 aulas</strong></span>
          </li>
          <li class="flex items-center gap-2">
            <i class="fas fa-check text-green-600"></i>
            <span>Certificados de conclusão</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="fas fa-check text-green-600"></i>
            <span>Suporte prioritário</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="fas fa-check text-green-600"></i>
            <span>Atualizações de conteúdo</span>
          </li>
        </ul>
      `
      ctaText = 'Fazer Upgrade Agora'
    } else {
      modalTitle = '❌ Plano Expirado'
      modalMessage = `
        <p class="text-gray-700 mb-4">
          Seu plano expirou. Renove agora para continuar acessando o conteúdo premium!
        </p>
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div class="flex items-start">
            <i class="fas fa-exclamation-triangle text-red-600 text-xl mr-3 mt-1"></i>
            <div>
              <p class="font-bold text-red-800">Acesso Limitado</p>
              <p class="text-sm text-red-700">Você tem acesso apenas às 253 aulas gratuitas até renovar seu plano.</p>
            </div>
          </div>
        </div>
        <ul class="text-left space-y-2 mb-6">
          <li class="flex items-center gap-2">
            <i class="fas fa-check text-green-600"></i>
            <span>Recupere acesso a <strong>todas as 754 aulas</strong></span>
          </li>
          <li class="flex items-center gap-2">
            <i class="fas fa-check text-green-600"></i>
            <span>Continue de onde parou</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="fas fa-check text-green-600"></i>
            <span>Gere seus certificados</span>
          </li>
        </ul>
      `
      ctaText = 'Renovar Plano Agora'
    }
    
    const modalHTML = `
      <div id="upgradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
            <div class="flex justify-between items-start">
              <h2 class="text-2xl font-bold">${modalTitle}</h2>
              <button onclick="accessManager.closeUpgradeModal()" class="text-white hover:text-gray-200">
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
          </div>
          
          <div class="p-6 text-center">
            ${modalMessage}
            
            <div class="flex gap-3 justify-center">
              <button onclick="accessManager.redirectToPayment()" class="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-600 transition-all transform hover:scale-105">
                <i class="fas fa-crown mr-2"></i>${ctaText}
              </button>
              <button onclick="accessManager.closeUpgradeModal()" class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Agora Não
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    
    // Remove existing modal if any
    this.closeUpgradeModal()
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML)
  },
  
  // Close upgrade modal
  closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal')
    if (modal) {
      modal.remove()
    }
  },
  
  // Redirect to payment page (customize this URL)
  redirectToPayment() {
    // TODO: Replace with your actual payment URL
    const paymentUrl = 'https://pay.hotmart.com/YOUR_PRODUCT_URL'
    window.open(paymentUrl, '_blank')
    this.closeUpgradeModal()
  }
}

// Auto-initialize when page loads (after auth)
if (typeof authManager !== 'undefined') {
  const originalAuthInit = authManager.init.bind(authManager)
  authManager.init = async function() {
    const result = await originalAuthInit()
    if (result) {
      // User is authenticated, initialize access control
      await accessManager.init()
    }
    return result
  }
}
