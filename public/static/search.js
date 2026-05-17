// ============================================================================
// INTELLIGENT SEARCH MANAGER - Busca Inteligente de Aulas
// ============================================================================

window.searchManager = {
  allLessons: [],
  searchResults: [],
  searchTimeout: null,
  currentFilters: {
    query: '',
    courseId: null,
    moduleId: null,
    lessonType: 'all', // all, free, premium
    minDuration: 0,
    maxDuration: 120,
    sortBy: 'relevance' // relevance, title, duration, date
  },
  
  // Initialize search
  async init() {
    await this.loadAllLessons()
    this.setupEventListeners()
  },
  
  // Load all lessons from all courses
  async loadAllLessons() {
    // Show loading spinner
    this.showLoadingSpinner()
    
    try {
      console.log('📚 Loading all lessons for search...')
      
      // Get all courses
      const coursesResponse = await axios.get('/api/courses')
      const courses = coursesResponse.data.courses || coursesResponse.data
      
      console.log('📚 Courses loaded:', courses.length, 'courses')
      
      if (!Array.isArray(courses)) {
        console.error('❌ courses is not an array:', courses)
        throw new Error('API returned invalid courses data')
      }
      
      this.allLessons = []
      
      // Load lessons from each course
      for (const course of courses) {
        const courseResponse = await axios.get(`/api/courses/${course.id}`)
        const { modules } = courseResponse.data
        
        for (const module of modules) {
          for (const lesson of (module.lessons || [])) {
            this.allLessons.push({
              ...lesson,
              courseName: course.name,
              courseId: course.id,
              moduleName: module.title,
              moduleId: module.id,
              isFree: lesson.teste_gratis || lesson.free_trial || false
            })
          }
        }
      }
      
      console.log(`✅ Loaded ${this.allLessons.length} lessons for search`)
      
      // Populate course filter
      this.populateCourseFilter(courses)
    } catch (error) {
      console.error('Error loading lessons:', error)
      throw error
    } finally {
      // Hide loading spinner
      this.hideLoadingSpinner()
    }
  },
  
  // Populate course filter dropdown
  populateCourseFilter(courses) {
    const courseFilter = document.getElementById('courseFilter')
    if (!courseFilter) return
    
    // Keep "All courses" option
    courseFilter.innerHTML = '<option value="">Todos os cursos</option>'
    
    // Add course options
    courses.forEach(course => {
      const option = document.createElement('option')
      option.value = course.id
      option.textContent = course.title || course.name
      courseFilter.appendChild(option)
    })
  },
  
  // Setup event listeners
  setupEventListeners() {
    // Search input with debounce
    const searchInput = document.getElementById('searchInput')
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilters.query = e.target.value
        
        // Clear previous timeout
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        
        // Show spinner immediately for better UX
        if (e.target.value.length >= 2) {
          this.showSearchSpinner()
        }
        
        // Debounce search (300ms delay)
        this.searchTimeout = setTimeout(() => {
          this.performSearch()
        }, 300)
      })
    }
    
    // Course filter
    const courseFilter = document.getElementById('courseFilter')
    if (courseFilter) {
      courseFilter.addEventListener('change', (e) => {
        this.currentFilters.courseId = e.target.value ? parseInt(e.target.value) : null
        this.showSearchSpinner()
        setTimeout(() => this.performSearch(), 100)
      })
    }
    
    // Lesson type filter
    const typeFilter = document.getElementById('typeFilter')
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.currentFilters.lessonType = e.target.value
        this.showSearchSpinner()
        setTimeout(() => this.performSearch(), 100)
      })
    }
    
    // Duration filter
    const durationFilter = document.getElementById('durationFilter')
    if (durationFilter) {
      durationFilter.addEventListener('change', (e) => {
        const [min, max] = e.target.value.split('-').map(Number)
        this.currentFilters.minDuration = min
        this.currentFilters.maxDuration = max || 999
        this.showSearchSpinner()
        setTimeout(() => this.performSearch(), 100)
      })
    }
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter')
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.currentFilters.sortBy = e.target.value
        this.showSearchSpinner()
        setTimeout(() => this.performSearch(), 100)
      })
    }
  },
  
  // Perform search with filters
  performSearch() {
    const { query, courseId, moduleId, lessonType, minDuration, maxDuration, sortBy } = this.currentFilters
    
    // Start with all lessons
    let results = [...this.allLessons]
    
    // Apply text search filter
    if (query && query.length >= 2) {
      const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 0)
      
      results = results.filter(lesson => {
        const searchableText = `
          ${lesson.title} 
          ${lesson.description || ''} 
          ${lesson.courseName} 
          ${lesson.moduleName}
        `.toLowerCase()
        
        // All search terms must be present
        return searchTerms.every(term => searchableText.includes(term))
      })
      
      // Calculate relevance score
      results.forEach(lesson => {
        let score = 0
        const titleLower = lesson.title.toLowerCase()
        const descLower = (lesson.description || '').toLowerCase()
        
        searchTerms.forEach(term => {
          // Title match is worth more
          if (titleLower.includes(term)) score += 10
          // Description match
          if (descLower.includes(term)) score += 5
          // Exact title match is worth most
          if (titleLower === query.toLowerCase()) score += 50
        })
        
        lesson.relevanceScore = score
      })
    }
    
    // Apply course filter
    if (courseId) {
      results = results.filter(lesson => lesson.courseId === courseId)
    }
    
    // Apply module filter
    if (moduleId) {
      results = results.filter(lesson => lesson.moduleId === moduleId)
    }
    
    // Apply lesson type filter
    if (lessonType !== 'all') {
      if (lessonType === 'free') {
        results = results.filter(lesson => lesson.isFree)
      } else if (lessonType === 'premium') {
        results = results.filter(lesson => !lesson.isFree)
      } else if (lessonType === 'rented') {
        results = results.filter(lesson => app?.activeRentals?.has(lesson.id))
      }
    }
    
    // Apply duration filter
    results = results.filter(lesson => {
      const duration = lesson.duration_minutes || 0
      return duration >= minDuration && duration <= maxDuration
    })
    
    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.relevanceScore || 0) - (a.relevanceScore || 0)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'duration':
          return (a.duration_minutes || 0) - (b.duration_minutes || 0)
        case 'date':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0)
        default:
          return 0
      }
    })
    
    this.searchResults = results
    this.renderResults()
  },
  
  // Highlight search terms in text
  escapeHtml(text) {
    if (!text) return ''
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
  },

  highlightText(text, query) {
    const escaped = this.escapeHtml(text)
    if (!query || query.length < 2) return escaped
    const terms = query.trim().split(/\s+/)
      .filter(t => t.length > 1)
      .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    if (!terms.length) return escaped
    const regex = new RegExp(`(${terms.join('|')})`, 'gi')
    return escaped.replace(regex, '<mark class="bg-yellow-200 font-semibold">$1</mark>')
  },
  
  // Render search results
  renderResults() {
    const resultsContainer = document.getElementById('searchResults')
    const resultsCount = document.getElementById('resultsCount')
    
    if (!resultsContainer) return
    
    // Get user access type
    const userAccessType = accessManager?.userAccessStatus?.accessType || 'SEM_ACESSO'
    const hasFullAccess = userAccessType === 'COMPLETO'
    
    // Update count
    if (resultsCount) {
      resultsCount.textContent = `${this.searchResults.length} aula${this.searchResults.length !== 1 ? 's' : ''} encontrada${this.searchResults.length !== 1 ? 's' : ''}`
    }
    
    // Show message if no results
    if (this.searchResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <p class="text-xl text-gray-600 mb-2">Nenhuma aula encontrada</p>
          <p class="text-gray-500">Tente ajustar os filtros ou usar outros termos de busca</p>
        </div>
      `
      return
    }
    
    // Render results
    const resultsHTML = this.searchResults.map(lesson => {
      const isPremium = !lesson.isFree
      const isRented = app?.activeRentals?.has(lesson.id) || false
      const isRentable = isPremium && !isRented && !hasFullAccess && lesson.rentable && lesson.rental_credits > 0
      const isBlocked = isPremium && !hasFullAccess && !isRented

      const borderColor = isRented ? 'border-teal-500' : isPremium ? 'border-orange-500' : 'border-green-500'

      let titleIcon
      if (isRented) titleIcon = '<i class="fas fa-key text-teal-500 ml-2 text-sm"></i>'
      else if (isBlocked) titleIcon = '<i class="fas fa-lock text-red-500 ml-2 text-sm"></i>'
      else if (isPremium) titleIcon = '<i class="fas fa-crown text-orange-500 ml-2 text-sm"></i>'
      else titleIcon = '<i class="fas fa-gift text-green-500 ml-2 text-sm"></i>'

      let statusBadge
      if (isRented) statusBadge = '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">🔑 ALUGADO</span>'
      else if (isBlocked) statusBadge = '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">🔒 BLOQUEADO</span>'
      else if (isPremium) statusBadge = '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">👑 PREMIUM</span>'
      else statusBadge = '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">🎁 GRÁTIS</span>'

      return `
        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 cursor-pointer border-l-4 ${borderColor} ${isBlocked && !isRentable ? 'opacity-75 hover:opacity-90' : ''}"
             onclick="searchManager.openLesson(${lesson.id})"
             data-lesson-id="${lesson.id}">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <!-- Title -->
              <h3 class="text-lg font-bold text-gray-800 mb-2">
                ${this.highlightText(lesson.title, this.currentFilters.query)}
                ${titleIcon}
              </h3>

              <!-- Course and Module -->
              <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span class="flex items-center gap-1">
                  <i class="fas fa-book text-blue-600"></i>
                  ${lesson.courseName}
                </span>
                <span class="flex items-center gap-1">
                  <i class="fas fa-folder text-purple-600"></i>
                  ${lesson.moduleName}
                </span>
              </div>

              <!-- Description -->
              ${lesson.description ? `
                <p class="text-gray-700 text-sm mb-3 line-clamp-2">
                  ${this.highlightText(lesson.description, this.currentFilters.query)}
                </p>
              ` : ''}

              <!-- Rented access banner -->
              ${isRented ? `
                <div class="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-3">
                  <p class="text-xs text-teal-700 flex items-center gap-2">
                    <i class="fas fa-key"></i>
                    <span>Você tem acesso via aluguel. Clique para entrar direto.</span>
                  </p>
                </div>
              ` : ''}

              <!-- Blocked message with optional rent button -->
              ${isBlocked ? `
                <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <p class="text-xs text-red-700 flex items-center gap-2 ${isRentable ? 'mb-2' : ''}">
                    <i class="fas fa-lock"></i>
                    <span>Esta aula requer plano ${userAccessType === 'TESTE_GRATIS' ? 'pago' : 'ativo'}.</span>
                  </p>
                  ${isRentable ? `
                    <button onclick="event.stopPropagation(); app.showRentModal(${lesson.id}, '${lesson.title.replace(/'/g, "\\'")}', ${lesson.rental_credits})"
                            class="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors">
                      <i class="fas fa-coins"></i>
                      Alugar por ${lesson.rental_credits} crédito${lesson.rental_credits !== 1 ? 's' : ''}
                    </button>
                  ` : ''}
                </div>
              ` : ''}

              <!-- Meta info -->
              <div class="flex items-center gap-4 text-sm">
                <span class="flex items-center gap-1 text-gray-600">
                  <i class="fas fa-clock"></i>
                  ${lesson.duration_minutes} min
                </span>
                ${statusBadge}
              </div>
            </div>

            <!-- Arrow icon -->
            <div class="flex-shrink-0">
              <i class="fas fa-chevron-right text-gray-400 text-xl"></i>
            </div>
          </div>
        </div>
      `
    }).join('')
    
    resultsContainer.innerHTML = resultsHTML
  },
  
  // Show loading spinner
  showLoadingSpinner() {
    const container = document.getElementById('searchResults')
    if (!container) return
    
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16">
        <i class="fas fa-spinner fa-spin text-6xl text-purple-600 mb-4"></i>
        <p class="text-gray-600 text-lg">Carregando aulas...</p>
        <p class="text-gray-400 text-sm mt-2">Por favor, aguarde</p>
      </div>
    `
  },
  
  // Hide loading spinner
  hideLoadingSpinner() {
    // Spinner will be replaced by search results
  },
  
  // Show search spinner (during filtering)
  showSearchSpinner() {
    const container = document.getElementById('searchResults')
    if (!container) return
    
    container.innerHTML = `
      <div class="flex items-center justify-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-purple-600 mr-3"></i>
        <p class="text-gray-600">Buscando...</p>
      </div>
    `
  },
  
  // Open lesson
  openLesson(lessonId) {
    const lesson = this.searchResults.find(l => l.id === lessonId)
    if (!lesson) return
    
    // Check if user has access
    if (typeof accessManager !== 'undefined') {
      accessManager.navigateToLesson(lessonId, lesson)
    } else if (typeof app !== 'undefined') {
      app.loadLesson(lessonId)
    }
  },
  
  // Show search view
  async showSearchView() {
    console.log('🔍 showSearchView called, allLessons.length:', this.allLessons.length)
    
    // Initialize if not already done
    if (this.allLessons.length === 0) {
      console.log('📚 Search not initialized yet, initializing now...')
      try {
        await this.init()
        console.log('✅ Search initialized, total lessons:', this.allLessons.length)
      } catch (error) {
        console.error('❌ Failed to initialize search:', error)
        alert('Erro ao carregar sistema de busca. Tente recarregar a página.')
        return
      }
    }
    
    // Hide other views
    document.getElementById('coursesView')?.classList.add('hidden')
    document.getElementById('lessonView')?.classList.add('hidden')
    
    // Show search view
    const searchView = document.getElementById('searchView')
    if (searchView) {
      searchView.classList.remove('hidden')
      
      // Focus search input
      const searchInput = document.getElementById('searchInput')
      if (searchInput) {
        searchInput.focus()
      }
      
      // Perform initial search
      this.performSearch()
    }
  },
  
  // Clear search
  clearSearch() {
    this.currentFilters = {
      query: '',
      courseId: null,
      moduleId: null,
      lessonType: 'all',
      minDuration: 0,
      maxDuration: 120,
      sortBy: 'relevance'
    }
    
    // Reset form
    document.getElementById('searchInput').value = ''
    document.getElementById('courseFilter').value = ''
    document.getElementById('typeFilter').value = 'all'
    document.getElementById('durationFilter').value = '0-120'
    document.getElementById('sortFilter').value = 'relevance'
    
    this.performSearch()
  }
}

// Initialize search when first accessed (lazy initialization)
// This is handled by showSearchView() method
console.log('✅ Search manager module loaded (will initialize on first use)')
