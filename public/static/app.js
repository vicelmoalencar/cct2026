// App state
const app = {
  currentUser: null,
  currentCourse: null,
  currentLesson: null,
  
  // Initialize app
  async init() {
    // Check authentication
    const user = await authManager.init()
    
    if (!user) {
      // Show login form
      authUI.showLoginForm()
      return
    }
    
    this.currentUser = authManager.getUserEmail()
    
    // Update user name in header
    const userNameEl = document.getElementById('userName')
    if (userNameEl) {
      userNameEl.textContent = authManager.getUserName()
    }
    
    // Check if user is admin and show admin button
    this.checkAdminAccess()
    
    // Check if email was just confirmed
    if (sessionStorage.getItem('email_confirmed') === 'true') {
      sessionStorage.removeItem('email_confirmed')
      this.showSuccessMessage('✅ Email confirmado com sucesso! Bem-vindo à plataforma.')
    }
    
    this.loadCourses()
  },
  
  // Check admin access
  async checkAdminAccess() {
    const isAdmin = await adminManager.checkAdmin()
    const adminButton = document.getElementById('adminButton')
    if (adminButton && isAdmin) {
      adminButton.classList.remove('hidden')
    }
  },
  
  // Show admin panel
  showAdminPanel() {
    adminUI.showAdminPanel()
  },
  
  // Logout
  async logout() {
    const result = await authManager.logout()
    if (result.success) {
      window.location.reload()
    }
  },
  
  // Load all courses
  async loadCourses() {
    try {
      const response = await axios.get('/api/courses')
      const courses = response.data.courses
      
      // Get last accessed lesson from localStorage
      const lastLesson = this.getLastAccessedLesson()
      
      const coursesView = document.getElementById('coursesView')
      const coursesList = document.getElementById('coursesList')
      
      if (courses.length === 0) {
        coursesList.innerHTML = `
          <div class="col-span-full text-center py-16">
            <i class="fas fa-book-open text-gray-300 text-6xl mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum curso disponível</h3>
            <p class="text-gray-500">Os cursos estarão disponíveis em breve!</p>
          </div>
        `
        return
      }
      
      // Remove any existing continue section first
      const existingContinue = document.getElementById('continueSection')
      if (existingContinue) {
        existingContinue.remove()
      }
      
      // Render "Continue Learning" section if there's a last lesson
      if (lastLesson) {
        const continueSection = `
          <div id="continueSection" class="mb-6 md:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl overflow-hidden">
            <div class="p-4 md:p-8 text-white">
              <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <i class="fas fa-play-circle text-2xl md:text-4xl"></i>
                <div>
                  <h3 class="text-lg md:text-2xl font-bold">Continue de onde parou</h3>
                  <p class="text-blue-100 text-xs md:text-sm">Retome seus estudos agora mesmo</p>
                </div>
              </div>
              
              <div class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex-1 w-full sm:w-auto">
                    <p class="text-xs md:text-sm text-blue-100 mb-1">${lastLesson.courseName}</p>
                    <h4 class="text-base md:text-xl font-bold mb-1 md:mb-2 line-clamp-2">${lastLesson.lessonTitle}</h4>
                    <p class="text-xs md:text-sm text-blue-100">
                      <i class="fas fa-folder mr-1"></i> ${lastLesson.moduleName}
                    </p>
                  </div>
                  <button onclick="app.loadLesson(${lastLesson.lessonId})" 
                          class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg text-sm md:text-base whitespace-nowrap">
                    <i class="fas fa-play"></i>
                    <span>Continuar Aula</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
        
        // Insert continue section before course list
        const heroSection = coursesView.querySelector('.text-center')
        if (heroSection) {
          heroSection.insertAdjacentHTML('afterend', continueSection)
        } else {
          // Fallback: insert at the beginning of coursesView
          coursesView.insertAdjacentHTML('afterbegin', continueSection)
        }
      }
      
      // Load progress for all courses to show completion badges
      console.log('🔄 Loading progress for', courses.length, 'courses')
      
      const progressPromises = courses.map(async (course) => {
        try {
          const response = await axios.get(`/api/progress/${this.currentUser}/${course.id}`)
          const progress = response.data.progress || []
          const completedLessons = progress.filter(p => p.completed).length
          const totalLessons = course.lessons_count || 0
          const isComplete = totalLessons > 0 && completedLessons === totalLessons
          
          console.log(`📊 Course "${course.title}":`, {
            id: course.id,
            completed: completedLessons,
            total: totalLessons,
            isComplete,
            percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
          })
          
          return { courseId: course.id, isComplete, progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0 }
        } catch (error) {
          console.error('Error loading progress for course', course.id, error)
          return { courseId: course.id, isComplete: false, progressPercent: 0 }
        }
      })
      
      const progressData = await Promise.all(progressPromises)
      const progressMap = {}
      
      // Check and generate certificates for completed courses
      for (const p of progressData) {
        progressMap[p.courseId] = p
        if (p.isComplete) {
          console.log('✅ Course', p.courseId, 'is complete! Badge should be visible.')
          // Try to generate certificate if not exists
          try {
            console.log('🎓 Attempting to generate certificate for course', p.courseId)
            const certResponse = await axios.post('/api/certificates/generate', {
              course_id: p.courseId
            })
            if (certResponse.data.success) {
              console.log('✨ Certificate generated for course', p.courseId)
            }
          } catch (certError) {
            // Certificate might already exist or there was an error
            if (certError.response?.status === 400 && certError.response?.data?.certificate) {
              console.log('ℹ️ Certificate already exists for course', p.courseId)
            } else {
              console.log('⚠️ Could not generate certificate:', certError.response?.data?.error)
            }
          }
        }
      }
      
      console.log('📋 Progress map:', progressMap)
      
      coursesList.innerHTML = courses.map((course, index) => {
        // Gradient colors for variety
        const gradients = [
          'from-blue-500 to-blue-700',
          'from-purple-500 to-purple-700',
          'from-green-500 to-green-700',
          'from-orange-500 to-orange-700',
          'from-pink-500 to-pink-700',
          'from-indigo-500 to-indigo-700'
        ]
        const gradient = gradients[index % gradients.length]
        
        const courseProgress = progressMap[course.id] || { isComplete: false, progressPercent: 0 }
        
        // Debug log for certificate badge
        if (courseProgress.isComplete) {
          console.log('🏆 Rendering certificate badge for course:', course.title)
        }
        
        return `
        <div class="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 active:scale-95"
             onclick="app.handleCourseClick(event, ${course.id})">
          <!-- Course Image/Icon -->
          <div class="relative h-40 md:h-52 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <i class="fas fa-graduation-cap text-white text-5xl md:text-7xl opacity-90 transform group-hover:scale-110 transition-transform duration-300"></i>
            
            <!-- Certificate Badge (if complete) -->
            ${courseProgress.isComplete === true ? 
              `<div style="position: absolute; top: 12px; left: 12px; background: linear-gradient(to right, #FBBF24, #F97316); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; color: white; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 10; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;">
                <i class="fas fa-certificate" style="margin-right: 4px;"></i>
                <span style="display: inline;">Certificado</span>
              </div>
              <style>
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: .7; }
                }
              </style>` 
            : ''}
            
            <!-- Duration Badge -->
            <div class="absolute top-3 right-3 md:top-4 md:right-4 bg-white bg-opacity-90 px-2 md:px-3 py-1 rounded-full text-xs font-bold text-gray-800">
              <i class="fas fa-star text-yellow-500 mr-1"></i>
              ${course.duration_hours}h
            </div>
            
            <!-- Progress Bar (if not complete) -->
            ${courseProgress.isComplete === false && courseProgress.progressPercent > 0 ? 
              `<div style="position: absolute; bottom: 0; left: 0; right: 0; height: 8px; background-color: rgba(0,0,0,0.2); z-index: 5;">
                <div style="height: 100%; background-color: #4ADE80; width: ${courseProgress.progressPercent}%; transition: width 0.3s ease;"></div>
              </div>` 
            : ''}
          </div>
          
          <!-- Course Info -->
          <div class="p-4 md:p-6">
            <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              ${course.title}
            </h3>
            <p class="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3 leading-relaxed">
              ${course.description || 'Aprenda os conceitos essenciais e práticos desta área de conhecimento.'}
            </p>
            
            <!-- Stats -->
            <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <i class="fas fa-folder text-blue-500"></i>
                <span class="font-medium">${course.modules_count || 0}</span>
                <span class="hidden sm:inline">módulos</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="fas fa-play-circle text-green-500"></i>
                <span class="font-medium">${course.lessons_count || 0}</span>
                <span class="hidden sm:inline">aulas</span>
              </div>
            </div>
            
            <!-- Instructor -->
            <div class="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
              <div class="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <div class="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  ${course.instructor.charAt(0).toUpperCase()}
                </div>
                <span class="font-medium truncate">${course.instructor}</span>
              </div>
              <button class="text-blue-600 hover:text-blue-700 font-semibold text-xs md:text-sm flex items-center gap-1 group-hover:gap-2 transition-all whitespace-nowrap">
                <span>Acessar</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `}).join('')
    } catch (error) {
      console.error('Error loading courses:', error)
      alert('Erro ao carregar cursos')
    }
  },
  
  // Handle course card click with visual feedback
  handleCourseClick(event, courseId) {
    const card = event.currentTarget
    
    // Add clicked effect
    card.classList.add('ring-4', 'ring-blue-400', 'ring-opacity-50')
    
    // Brief delay for visual feedback
    setTimeout(() => {
      card.classList.remove('ring-4', 'ring-blue-400', 'ring-opacity-50')
      this.loadCourse(courseId)
    }, 200)
  },
  
  // Load course with modules and lessons
  async loadCourse(courseId) {
    try {
      // Show loading state
      this.showLoadingState('Carregando curso...')
      
      this.currentCourse = courseId
      
      const [courseResponse, progressResponse] = await Promise.all([
        axios.get(`/api/courses/${courseId}`),
        axios.get(`/api/progress/${this.currentUser}/${courseId}`)
      ])
      
      const { course, modules } = courseResponse.data
      const progress = progressResponse.data.progress
      
      // Create progress map
      const progressMap = {}
      progress.forEach(p => {
        progressMap[p.lesson_id] = p.completed
      })
      
      // Calculate course progress
      const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)
      const completedLessons = progress.filter(p => p.completed).length
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      
      const courseDetail = document.getElementById('courseDetail')
      courseDetail.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">${course.title}</h2>
          <p class="text-gray-600 mb-4">${course.description || ''}</p>
          <div class="flex items-center gap-6 text-sm text-gray-600">
            <span><i class="fas fa-user mr-1"></i> ${course.instructor}</span>
            <span><i class="fas fa-clock mr-1"></i> ${course.duration_hours} horas</span>
            <span><i class="fas fa-list-ul mr-1"></i> ${modules.length} módulos</span>
          </div>
          
          <!-- Progress Bar -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-gray-700">Seu Progresso</span>
              <span class="text-sm font-semibold text-blue-600">${progressPercent}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-blue-600 h-3 rounded-full transition-all" style="width: ${progressPercent}%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">${completedLessons} de ${totalLessons} aulas concluídas</p>
          </div>
        </div>
        
        <!-- Modules -->
        <div class="space-y-4">
          ${modules.map((module, idx) => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="module-header bg-blue-50 p-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
                   onclick="app.toggleModule(${module.id})">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    ${idx + 1}
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800">${module.title}</h3>
                    <p class="text-sm text-gray-600">${module.description || ''}</p>
                  </div>
                </div>
                <i class="fas fa-chevron-down text-gray-400" id="icon-${module.id}"></i>
              </div>
              
              <div class="module-content" id="module-${module.id}">
                <div class="p-4 space-y-2">
                  ${(module.lessons || []).map((lesson, lessonIdx) => {
                    const isCompleted = progressMap[lesson.id]
                    return `
                      <div class="lesson-item p-3 rounded-lg border ${isCompleted ? 'completed border-green-300' : 'border-gray-200'} flex items-center justify-between cursor-pointer"
                           onclick="app.loadLesson(${lesson.id})">
                        <div class="flex items-center gap-3 flex-1">
                          <div class="w-8 h-8 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'} text-white rounded-full flex items-center justify-center text-sm">
                            ${isCompleted ? '<i class="fas fa-check"></i>' : lessonIdx + 1}
                          </div>
                          <div class="flex-1">
                            <p class="font-semibold text-gray-800">${lesson.title}</p>
                            <p class="text-xs text-gray-500">${lesson.duration_minutes} minutos</p>
                          </div>
                        </div>
                        <i class="fas fa-play-circle text-blue-600 text-xl"></i>
                      </div>
                    `
                  }).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `
      
      this.showCourseView()
      this.hideLoadingState()
    } catch (error) {
      console.error('Error loading course:', error)
      this.hideLoadingState()
      alert('Erro ao carregar curso')
    }
  },
  
  // Toggle module expand/collapse
  toggleModule(moduleId) {
    const content = document.getElementById(`module-${moduleId}`)
    const icon = document.getElementById(`icon-${moduleId}`)
    
    if (content.classList.contains('active')) {
      content.classList.remove('active')
      icon.classList.remove('fa-chevron-up')
      icon.classList.add('fa-chevron-down')
    } else {
      content.classList.add('active')
      icon.classList.remove('fa-chevron-down')
      icon.classList.add('fa-chevron-up')
    }
  },
  
  // Render video player based on provider
  renderVideoPlayer(lesson) {
    if (!lesson.video_provider || !lesson.video_id) {
      return `
        <div class="bg-gray-900 aspect-video rounded-lg flex items-center justify-center">
          <div class="text-center text-white">
            <i class="fas fa-video text-6xl mb-4"></i>
            <p class="text-lg">Vídeo não configurado</p>
            <p class="text-sm text-gray-400 mt-2">O instrutor ainda não adicionou o vídeo desta aula</p>
          </div>
        </div>
      `
    }
    
    if (lesson.video_provider === 'youtube') {
      return `
        <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${lesson.video_id}" 
            title="${lesson.title}"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            class="absolute top-0 left-0 w-full h-full">
          </iframe>
        </div>
      `
    }
    
    if (lesson.video_provider === 'vimeo') {
      return `
        <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
          <iframe 
            src="https://player.vimeo.com/video/${lesson.video_id}" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowfullscreen
            class="absolute top-0 left-0 w-full h-full">
          </iframe>
        </div>
      `
    }
    
    if (lesson.video_provider === 'url') {
      return `
        <div class="bg-gray-900 aspect-video rounded-lg overflow-hidden">
          <video 
            controls 
            class="w-full h-full"
            src="${lesson.video_id}">
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>
      `
    }
    
    return `
      <div class="bg-gray-900 aspect-video rounded-lg flex items-center justify-center">
        <div class="text-center text-white">
          <i class="fas fa-exclamation-triangle text-6xl mb-4 text-yellow-500"></i>
          <p class="text-lg">Formato de vídeo não suportado</p>
        </div>
      </div>
    `
  },
  
  // Load lesson details
  async loadLesson(lessonId) {
    try {
      // Show loading state
      this.showLoadingState('Carregando aula...')
      
      this.currentLesson = lessonId
      
      const response = await axios.get(`/api/lessons/${lessonId}`)
      const { lesson, comments } = response.data
      
      // Get course info with all modules and lessons
      const courseResponse = await axios.get(`/api/courses/${lesson.course_id}`)
      const { course, modules } = courseResponse.data
      
      // Find current module and get all lessons
      const currentModule = modules.find(m => m.id === lesson.module_id)
      const moduleLessons = currentModule ? currentModule.lessons : []
      
      // Find current lesson index
      const currentLessonIndex = moduleLessons.findIndex(l => l.id === lessonId)
      const previousLesson = currentLessonIndex > 0 ? moduleLessons[currentLessonIndex - 1] : null
      const nextLesson = currentLessonIndex < moduleLessons.length - 1 ? moduleLessons[currentLessonIndex + 1] : null
      
      // Save last accessed lesson
      this.saveLastAccessedLesson(
        lessonId,
        lesson.title,
        lesson.module_title,
        course.title
      )
      
      // Check if completed
      const progressResponse = await axios.get(`/api/progress/${this.currentUser}/${lesson.course_id}`)
      const progress = progressResponse.data.progress
      const isCompleted = progress.find(p => p.lesson_id == lessonId)?.completed || false
      
      const lessonDetail = document.getElementById('lessonDetail')
      lessonDetail.innerHTML = `
        <!-- Breadcrumb Navigation -->
        <div class="mb-4 flex items-center text-sm text-gray-600">
          <button onclick="app.showCourses()" class="hover:text-blue-600 transition-colors">
            <i class="fas fa-home mr-1"></i>Cursos
          </button>
          <i class="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
          <button onclick="app.loadCourse(${lesson.course_id})" class="hover:text-blue-600 transition-colors">
            ${course.title}
          </button>
          <i class="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
          <span class="text-gray-800 font-semibold">${lesson.module_title}</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content (Video + Info) -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Video Player Card -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="relative">
                ${this.renderVideoPlayer(lesson)}
                ${lesson.free_trial ? 
                  '<div class="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"><i class="fas fa-gift mr-1"></i>GRÁTIS</div>' : 
                  '<div class="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"><i class="fas fa-crown mr-1"></i>PREMIUM</div>'
                }
              </div>
              
              <!-- Lesson Info -->
              <div class="p-6">
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div class="flex-1">
                    <p class="text-sm text-blue-600 font-semibold mb-2">
                      <i class="fas fa-folder mr-1"></i>${lesson.module_title}
                    </p>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">${lesson.title}</h1>
                    ${lesson.description ? `<p class="text-gray-600 leading-relaxed">${lesson.description}</p>` : ''}
                  </div>
                </div>
                
                <!-- Lesson Meta -->
                <div class="flex flex-wrap items-center gap-4 py-4 border-t border-gray-200">
                  <div class="flex items-center text-gray-600">
                    <i class="fas fa-clock mr-2 text-blue-600"></i>
                    <span class="text-sm font-semibold">${lesson.duration_minutes} min</span>
                  </div>
                  <div class="flex items-center text-gray-600">
                    <i class="fas fa-comments mr-2 text-green-600"></i>
                    <span class="text-sm font-semibold">${comments.length} comentários</span>
                  </div>
                  ${lesson.attachments && lesson.attachments.length > 0 ? `
                    <div class="flex items-center text-gray-600">
                      <i class="fas fa-paperclip mr-2 text-purple-600"></i>
                      <span class="text-sm font-semibold">${lesson.attachments.length} arquivos</span>
                    </div>
                  ` : ''}
                </div>
                
                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button onclick="app.toggleComplete(${lessonId}, ${isCompleted})"
                          class="flex-1 px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' 
                              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                          }">
                    <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'} mr-2"></i>
                    ${isCompleted ? 'Aula Concluída' : 'Marcar como Concluída'}
                  </button>
                  <button onclick="app.loadCourse(${lesson.course_id})"
                          class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-list mr-2"></i>
                    Ver Todas as Aulas
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Navigation Buttons -->
            ${previousLesson || nextLesson ? `
              <div class="grid grid-cols-2 gap-4">
                ${previousLesson ? `
                  <button onclick="app.loadLesson(${previousLesson.id})"
                          class="flex items-center gap-3 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all group">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <i class="fas fa-chevron-left text-blue-600"></i>
                    </div>
                    <div class="flex-1 text-left">
                      <p class="text-xs text-gray-500 mb-1">Anterior</p>
                      <p class="text-sm font-semibold text-gray-800 line-clamp-2">${previousLesson.title}</p>
                    </div>
                  </button>
                ` : '<div></div>'}
                
                ${nextLesson ? `
                  <button onclick="app.loadLesson(${nextLesson.id})"
                          class="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all group">
                    <div class="flex-1 text-left">
                      <p class="text-xs text-blue-100 mb-1">Próxima</p>
                      <p class="text-sm font-semibold line-clamp-2">${nextLesson.title}</p>
                    </div>
                    <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-colors">
                      <i class="fas fa-chevron-right"></i>
                    </div>
                  </button>
                ` : '<div></div>'}
              </div>
            ` : ''}

            
            <!-- Tabs for Additional Content -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="flex border-b border-gray-200">
                <button onclick="app.switchLessonTab('comments')" 
                        id="tabComments"
                        class="flex-1 py-4 px-6 font-semibold text-blue-600 border-b-2 border-blue-600 transition-colors">
                  <i class="fas fa-comments mr-2"></i>
                  <span class="hidden sm:inline">Comentários</span>
                  <span class="sm:hidden">Coment.</span>
                  <span class="ml-1">(${comments.length})</span>
                </button>
                ${lesson.support_text ? `
                  <button onclick="app.switchLessonTab('support')" 
                          id="tabSupport"
                          class="flex-1 py-4 px-6 font-semibold text-gray-500 border-b-2 border-transparent hover:text-blue-600 transition-colors">
                    <i class="fas fa-file-alt mr-2"></i>
                    <span class="hidden sm:inline">Texto de Apoio</span>
                    <span class="sm:hidden">Apoio</span>
                  </button>
                ` : ''}
                ${lesson.attachments && lesson.attachments.length > 0 ? `
                  <button onclick="app.switchLessonTab('attachments')" 
                          id="tabAttachments"
                          class="flex-1 py-4 px-6 font-semibold text-gray-500 border-b-2 border-transparent hover:text-blue-600 transition-colors">
                    <i class="fas fa-paperclip mr-2"></i>
                    <span class="hidden sm:inline">Arquivos</span>
                    <span class="sm:hidden">Arq.</span>
                    <span class="ml-1">(${lesson.attachments.length})</span>
                  </button>
                ` : ''}
                ${lesson.transcript ? `
                  <button onclick="app.switchLessonTab('transcript')" 
                          id="tabTranscript"
                          class="flex-1 py-4 px-6 font-semibold text-gray-500 border-b-2 border-transparent hover:text-blue-600 transition-colors">
                    <i class="fas fa-closed-captioning mr-2"></i>
                    <span class="hidden sm:inline">Transcrição</span>
                    <span class="sm:hidden">Trans.</span>
                  </button>
                ` : ''}
              </div>
              
              <!-- Comments Tab -->
              <div id="contentComments" class="p-6">
          <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
            <i class="fas fa-comments mr-2"></i>
            Comentários (${comments.length})
          </h3>
          
          <!-- Add Comment Form -->
          <div class="mb-6 md:mb-8 p-3 md:p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-700 mb-3 text-sm md:text-base">Adicionar comentário</h4>
            <textarea id="commentText" 
                      class="w-full p-2 md:p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      rows="3"
                      placeholder="Digite seu comentário..."></textarea>
            <button onclick="app.addComment(${lessonId})"
                    class="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm md:text-base">
              <i class="fas fa-paper-plane mr-2"></i>
              Enviar comentário
            </button>
          </div>
          
          <!-- Comments List -->
          <div class="space-y-3 md:space-y-4" id="commentsList">
            ${comments.length === 0 ? '<p class="text-gray-500 text-center py-8 text-sm md:text-base">Ainda não há comentários. Seja o primeiro!</p>' : ''}
            ${comments.map(comment => `
              <div class="border-l-4 border-blue-500 bg-gray-50 p-3 md:p-4 rounded-r-lg">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-user-circle text-blue-600 text-lg md:text-xl"></i>
                    <span class="font-semibold text-gray-800 text-sm md:text-base break-all">${comment.user_name}</span>
                  </div>
                  <span class="text-xs md:text-sm text-gray-500 sm:ml-auto">${new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <p class="text-sm md:text-base text-gray-700 break-words">${comment.comment_text}</p>
              </div>
            `).join('')}
          </div>
              </div>
              
              <!-- Support Text Tab -->
              ${lesson.support_text ? `
                <div id="contentSupport" class="p-6 hidden">
                  <div class="prose max-w-none bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div class="text-gray-700 whitespace-pre-wrap leading-relaxed">${lesson.support_text}</div>
                  </div>
                </div>
              ` : ''}
              
              <!-- Attachments Tab -->
              ${lesson.attachments && lesson.attachments.length > 0 ? `
                <div id="contentAttachments" class="p-6 hidden">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${lesson.attachments.map(file => `
                      <div class="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i class="fas fa-file-${this.getFileIcon(file.type)} text-2xl text-blue-600"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-semibold text-gray-800 truncate">${file.name}</p>
                          <p class="text-sm text-gray-500">${this.formatFileSize(file.size)}</p>
                        </div>
                        <button onclick="app.downloadAttachment('${file.name}', '${file.data}')"
                                class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                          <i class="fas fa-download"></i>
                        </button>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              
              <!-- Transcript Tab -->
              ${lesson.transcript ? `
                <div id="contentTranscript" class="p-6 hidden">
                  <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <div class="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">${lesson.transcript}</div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Sidebar: Module Lessons -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
              <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                <h3 class="font-bold text-lg">
                  <i class="fas fa-list mr-2"></i>
                  Aulas do Módulo
                </h3>
                <p class="text-sm text-blue-100 mt-1">${currentModule ? currentModule.title : ''}</p>
              </div>
              
              <div class="max-h-[600px] overflow-y-auto">
                ${moduleLessons.map((l, index) => `
                  <button onclick="app.loadLesson(${l.id})"
                          class="w-full text-left p-4 border-b border-gray-100 transition-all ${
                            l.id === lessonId 
                              ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                              : 'hover:bg-gray-50'
                          }">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 ${
                        l.id === lessonId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      } rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        ${index + 1}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">${l.title}</p>
                        <div class="flex items-center gap-3 text-xs text-gray-500">
                          <span><i class="fas fa-clock mr-1"></i>${l.duration_minutes}min</span>
                          ${l.free_trial ? 
                            '<span class="text-blue-600 font-semibold"><i class="fas fa-gift mr-1"></i>Grátis</span>' : 
                            '<span class="text-yellow-600 font-semibold"><i class="fas fa-crown mr-1"></i>Premium</span>'
                          }
                        </div>
                      </div>
                      ${l.id === lessonId ? '<i class="fas fa-play text-blue-600"></i>' : ''}
                    </div>
                  </button>
                `).join('')}
              </div>
              
              <div class="p-4 bg-gray-50 border-t border-gray-200">
                <button onclick="app.loadCourse(${lesson.course_id})"
                        class="w-full px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm">
                  <i class="fas fa-th-list mr-2"></i>
                  Ver Todos os Módulos
                </button>
              </div>
            </div>
          </div>
        </div>
      `
      
      this.showLessonView()
      this.hideLoadingState()
    } catch (error) {
      console.error('Error loading lesson:', error)
      this.hideLoadingState()
      alert('Erro ao carregar aula')
    }
  },
  
  // Add comment
  async addComment(lessonId) {
    const text = document.getElementById('commentText').value.trim()
    
    if (!text) {
      alert('Por favor, escreva um comentário')
      return
    }
    
    try {
      await axios.post(`/api/lessons/${lessonId}/comments`, {
        comment_text: text
      })
      
      // Clear textarea
      document.getElementById('commentText').value = ''
      
      // Reload lesson to show new comment
      this.loadLesson(lessonId)
    } catch (error) {
      console.error('Error adding comment:', error)
      if (error.response?.status === 401) {
        alert('Você precisa estar logado para comentar')
        window.location.href = '/'
      } else {
        alert('Erro ao adicionar comentário')
      }
    }
  },
  
  // Toggle lesson completion
  async toggleComplete(lessonId, isCompleted) {
    try {
      const endpoint = isCompleted ? '/api/progress/uncomplete' : '/api/progress/complete'
      
      await axios.post(endpoint, {
        user_email: this.currentUser,
        lesson_id: lessonId
      })
      
      // Reload lesson to update UI
      this.loadLesson(lessonId)
      
      // If marking as complete, check if course is 100% done
      if (!isCompleted && this.currentCourse) {
        await this.checkCourseCompletion(this.currentCourse)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      alert('Erro ao atualizar progresso')
    }
  },
  
  // Check if course is 100% complete and generate certificate
  async checkCourseCompletion(courseId) {
    try {
      console.log('🔍 Checking course completion for course:', courseId)
      
      // Get course progress
      const progressResponse = await axios.get(`/api/progress/${this.currentUser}/${courseId}`)
      const progress = progressResponse.data.progress || []
      
      console.log('📊 Progress data:', progress)
      
      // Get course details
      const courseResponse = await axios.get(`/api/courses/${courseId}`)
      const course = courseResponse.data.course
      
      // Count total lessons
      let totalLessons = 0
      course.modules.forEach(module => {
        totalLessons += module.lessons.length
      })
      
      // Count completed lessons
      const completedLessons = progress.filter(p => p.completed).length
      
      console.log('📈 Course stats:', {
        totalLessons,
        completedLessons,
        percentage: Math.round((completedLessons / totalLessons) * 100)
      })
      
      // If 100% complete, generate certificate
      if (totalLessons > 0 && completedLessons === totalLessons) {
        console.log('🎉 Course 100% complete! Generating certificate...')
        
        try {
          console.log('📝 Calling API to generate certificate...')
          const certResponse = await axios.post('/api/certificates/generate', {
            course_id: courseId
          })
          
          console.log('✅ Certificate API response:', certResponse.data)
          
          if (certResponse.data.success) {
            // Show success message with link to certificates
            console.log('🎉 Showing certificate popup...')
            this.showCertificateMessage(course.title)
          }
        } catch (certError) {
          console.error('❌ Error generating certificate:', certError)
          console.error('Response data:', certError.response?.data)
          
          // Certificate might already exist, that's ok
          if (certError.response?.data?.certificate) {
            console.log('ℹ️ Certificate already exists')
          }
        }
      }
    } catch (error) {
      console.error('Error checking course completion:', error)
    }
  },
  
  // Show certificate generation message
  showCertificateMessage(courseTitle) {
    // Remove any existing certificate message
    const existing = document.getElementById('certificatePopup')
    if (existing) {
      existing.remove()
    }
    
    const message = document.createElement('div')
    message.id = 'certificatePopup'
    message.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;'
    message.innerHTML = `
      <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-2xl animate-bounce">
        <div class="flex items-start gap-4">
          <i class="fas fa-certificate text-4xl flex-shrink-0"></i>
          <div class="flex-1">
            <h3 class="font-bold text-xl mb-2">🎉 Parabéns!</h3>
            <p class="mb-2">Você concluiu o curso:</p>
            <p class="font-bold mb-3">${courseTitle}</p>
            <p class="text-sm mb-4">Seu certificado foi gerado e está disponível!</p>
            <button onclick="window.location.href='/certificates'" 
                    class="w-full bg-white text-orange-600 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <i class="fas fa-eye mr-2"></i>
              Ver Meu Certificado
            </button>
          </div>
          <button onclick="document.getElementById('certificatePopup').remove()" 
                  class="text-white hover:text-gray-200 text-xl flex-shrink-0">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `
    document.body.appendChild(message)
    
    // Log to console for debugging
    console.log('🎉 Certificate popup displayed!')
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      const popup = document.getElementById('certificatePopup')
      if (popup) {
        popup.remove()
      }
    }, 15000)
  },
  
  // View management
  showCourses() {
    document.getElementById('coursesView').classList.remove('hidden')
    document.getElementById('courseView').classList.add('hidden')
    document.getElementById('lessonView').classList.add('hidden')
    this.loadCourses()
  },
  
  showCourseView() {
    document.getElementById('coursesView').classList.add('hidden')
    document.getElementById('courseView').classList.remove('hidden')
    document.getElementById('lessonView').classList.add('hidden')
  },
  
  showLessonView() {
    document.getElementById('coursesView').classList.add('hidden')
    document.getElementById('courseView').classList.add('hidden')
    document.getElementById('lessonView').classList.remove('hidden')
  },
  
  backToCourse() {
    if (this.currentCourse) {
      this.loadCourse(this.currentCourse)
    }
  },
  
  // Show success message
  showSuccessMessage(message) {
    const alertDiv = document.createElement('div')
    alertDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in'
    alertDiv.innerHTML = `
      <i class="fas fa-check-circle text-2xl"></i>
      <span>${message}</span>
    `
    document.body.appendChild(alertDiv)
    
    // Remove after 5 seconds
    setTimeout(() => {
      alertDiv.style.opacity = '0'
      alertDiv.style.transform = 'translateX(100%)'
      alertDiv.style.transition = 'all 0.3s ease-out'
      setTimeout(() => alertDiv.remove(), 300)
    }, 5000)
  },
  
  // Show plans page
  async showPlans() {
    try {
      // Hide all views
      document.getElementById('coursesView').classList.add('hidden')
      document.getElementById('courseView').classList.add('hidden')
      document.getElementById('lessonView').classList.add('hidden')
      
      // Create plans view if doesn't exist
      let plansView = document.getElementById('plansView')
      if (!plansView) {
        plansView = document.createElement('div')
        plansView.id = 'plansView'
        plansView.className = 'container mx-auto px-4 py-8'
        document.querySelector('main').appendChild(plansView)
      }
      plansView.classList.remove('hidden')
      
      // Load plans
      const response = await axios.get('/api/plans')
      const plans = response.data.plans || []
      
      // Load current subscription
      let currentPlan = null
      try {
        const subResponse = await axios.get('/api/subscriptions/current')
        currentPlan = subResponse.data.subscription
      } catch (error) {
        console.log('No active subscription')
      }
      
      plansView.innerHTML = `
        <div class="mb-6">
          <button onclick="app.showCourses()" class="text-blue-600 hover:text-blue-800 font-semibold">
            <i class="fas fa-arrow-left mr-2"></i>Voltar aos Cursos
          </button>
        </div>
        
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">
            <i class="fas fa-crown text-yellow-500 mr-3"></i>
            Escolha seu Plano
          </h1>
          <p class="text-xl text-gray-600">
            Acesse todos os cursos e materiais exclusivos
          </p>
        </div>
        
        ${currentPlan ? `
          <div class="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-xl p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-bold mb-2">
                  <i class="fas fa-check-circle mr-2"></i>
                  Assinatura Ativa
                </h3>
                <p class="text-green-100 text-lg">
                  Plano: <strong>${currentPlan.plan_name}</strong>
                </p>
                <p class="text-green-100 text-sm mt-1">
                  Válido até: <strong>${new Date(currentPlan.end_date).toLocaleDateString('pt-BR')}</strong>
                  <span class="ml-2">(${currentPlan.days_remaining} dias restantes)</span>
                </p>
              </div>
              <i class="fas fa-star text-6xl opacity-20"></i>
            </div>
          </div>
        ` : ''}
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          ${plans.map(plan => {
            const isCurrent = currentPlan && currentPlan.plan_id === plan.id
            const isFreeTrial = plan.is_free_trial
            
            return `
              <div class="relative ${isCurrent ? 'ring-4 ring-green-500' : ''} ${isFreeTrial ? 'bg-blue-50 border-blue-300' : 'bg-white'} border-2 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                ${isCurrent ? `
                  <div class="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    <i class="fas fa-check mr-1"></i>SEU PLANO
                  </div>
                ` : ''}
                
                ${!isFreeTrial && plan.display_order === 3 ? `
                  <div class="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 px-4 py-1 text-xs font-bold shadow-md">
                    <i class="fas fa-star mr-1"></i>MAIS POPULAR
                  </div>
                ` : ''}
                
                <div class="p-6 pt-${isCurrent || (!isFreeTrial && plan.display_order === 3) ? '12' : '6'}">
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">${plan.name}</h3>
                  <p class="text-gray-600 text-sm mb-4">${plan.description || ''}</p>
                  
                  <div class="mb-6">
                    <div class="flex items-baseline gap-1">
                      <span class="text-4xl font-bold ${isFreeTrial ? 'text-blue-600' : 'text-gray-800'}">
                        ${plan.price > 0 ? `R$ ${parseFloat(plan.price).toFixed(2)}` : 'Grátis'}
                      </span>
                      ${plan.duration_days > 0 ? `<span class="text-gray-600 text-sm">/ ${plan.duration_days} dias</span>` : ''}
                    </div>
                    ${plan.price > 0 && plan.duration_days >= 30 ? `
                      <p class="text-xs text-gray-500 mt-1">
                        ${(plan.price / (plan.duration_days / 30)).toFixed(2)} por mês
                      </p>
                    ` : ''}
                  </div>
                  
                  <ul class="space-y-3 mb-6">
                    ${(plan.features || []).map(feature => `
                      <li class="flex items-start gap-2 text-sm text-gray-700">
                        <i class="fas fa-check text-green-600 mt-1"></i>
                        <span>${feature}</span>
                      </li>
                    `).join('')}
                  </ul>
                  
                  ${isCurrent ? `
                    <button disabled
                            class="w-full py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed">
                      <i class="fas fa-check mr-2"></i>Plano Atual
                    </button>
                  ` : isFreeTrial ? `
                    <button disabled
                            class="w-full py-3 bg-blue-200 text-blue-800 rounded-lg font-semibold cursor-not-allowed">
                      <i class="fas fa-gift mr-2"></i>Teste Grátis
                    </button>
                  ` : `
                    <button onclick="app.selectPlan(${plan.id}, '${plan.name}', ${plan.price})"
                            class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                      <i class="fas fa-shopping-cart mr-2"></i>Assinar Agora
                    </button>
                  `}
                </div>
              </div>
            `
          }).join('')}
        </div>
        
        <div class="max-w-4xl mx-auto mt-12 bg-gray-50 border border-gray-200 rounded-xl p-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">
            <i class="fas fa-question-circle text-blue-600 mr-2"></i>
            Perguntas Frequentes
          </h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-gray-800 mb-1">Como funciona o teste grátis?</h4>
              <p class="text-gray-600 text-sm">Você pode acessar aulas marcadas como "Teste Grátis" sem precisar assinar nenhum plano.</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 mb-1">Posso cancelar a qualquer momento?</h4>
              <p class="text-gray-600 text-sm">Sim! Entre em contato com o suporte para cancelar sua assinatura.</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 mb-1">Tenho acesso a todos os cursos?</h4>
              <p class="text-gray-600 text-sm">Com qualquer plano pago, você tem acesso completo a todos os cursos e materiais da plataforma.</p>
            </div>
          </div>
        </div>
      `
    } catch (error) {
      console.error('Error loading plans:', error)
      alert('❌ Erro ao carregar planos. Tente novamente.')
    }
  },
  
  selectPlan(planId, planName, price) {
    alert(`
      🚧 Funcionalidade em Desenvolvimento
      
      Plano selecionado: ${planName}
      Valor: R$ ${price.toFixed(2)}
      
      Em breve você poderá completar a assinatura aqui!
      Por enquanto, entre em contato com o administrador.
    `)
  },
  
  // Save last accessed lesson
  saveLastAccessedLesson(lessonId, lessonTitle, moduleName, courseName) {
    const lastLesson = {
      lessonId,
      lessonTitle,
      moduleName,
      courseName,
      timestamp: Date.now()
    }
    localStorage.setItem('lastAccessedLesson', JSON.stringify(lastLesson))
  },
  
  // Get last accessed lesson
  getLastAccessedLesson() {
    try {
      const data = localStorage.getItem('lastAccessedLesson')
      return data ? JSON.parse(data) : null
    } catch (error) {
      return null
    }
  },
  
  // Toggle section visibility (generic)
  toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}Content`)
    const icon = document.getElementById(`${sectionId}Icon`)
    
    if (!content || !icon) return
    
    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden')
      icon.classList.remove('fa-chevron-down')
      icon.classList.add('fa-chevron-up')
      icon.style.transform = 'rotate(180deg)'
    } else {
      content.classList.add('hidden')
      icon.classList.remove('fa-chevron-up')
      icon.classList.add('fa-chevron-down')
      icon.style.transform = 'rotate(0deg)'
    }
  },
  
  // Legacy support for old toggleTranscript() calls
  toggleTranscript() {
    this.toggleSection('transcript')
  },
  
  // Download attachment
  downloadAttachment(filename, base64Data) {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray])
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Erro ao baixar arquivo')
    }
  },
  
  // Get file icon based on mime type
  getFileIcon(mimeType) {
    if (!mimeType) return 'alt'
    if (mimeType.includes('pdf')) return 'pdf'
    if (mimeType.includes('word') || mimeType.includes('msword')) return 'word'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'powerpoint'
    if (mimeType.includes('zip')) return 'archive'
    return 'alt'
  },
  
  // Format file size
  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  },
  
  // Show loading state with spinner
  showLoadingState(message = 'Carregando...') {
    // Create or get loading overlay
    let overlay = document.getElementById('loadingOverlay')
    
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = 'loadingOverlay'
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity'
      overlay.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-4 transform transition-all">
          <div class="flex flex-col items-center">
            <!-- Spinner -->
            <div class="relative w-16 h-16 mb-4">
              <div class="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            
            <!-- Message -->
            <p class="text-lg font-semibold text-gray-800 mb-2" id="loadingMessage">${message}</p>
            <p class="text-sm text-gray-500">Aguarde um momento...</p>
          </div>
        </div>
      `
      document.body.appendChild(overlay)
    } else {
      // Update message if overlay already exists
      const messageElement = overlay.querySelector('#loadingMessage')
      if (messageElement) {
        messageElement.textContent = message
      }
      overlay.classList.remove('hidden')
    }
    
    // Force reflow for animation
    overlay.offsetHeight
    overlay.style.opacity = '1'
  },
  
  // Hide loading state
  hideLoadingState() {
    const overlay = document.getElementById('loadingOverlay')
    if (overlay) {
      overlay.style.opacity = '0'
      setTimeout(() => {
        overlay.classList.add('hidden')
      }, 300)
    }
  },
  
  // Switch lesson content tabs
  switchLessonTab(tab) {
    const tabs = ['comments', 'support', 'attachments', 'transcript']
    
    tabs.forEach(t => {
      const tabBtn = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}`)
      const content = document.getElementById(`content${t.charAt(0).toUpperCase() + t.slice(1)}`)
      
      if (tabBtn) {
        if (t === tab) {
          tabBtn.classList.remove('text-gray-500', 'border-transparent')
          tabBtn.classList.add('text-blue-600', 'border-blue-600')
        } else {
          tabBtn.classList.add('text-gray-500', 'border-transparent')
          tabBtn.classList.remove('text-blue-600', 'border-blue-600')
        }
      }
      
      if (content) {
        if (t === tab) {
          content.classList.remove('hidden')
        } else {
          content.classList.add('hidden')
        }
      }
    })
  },
  
  // Show my certificates
  async showMyCertificates() {
    try {
      const response = await axios.get('/api/my-certificates')
      const certificates = response.data.certificates
      
      const coursesView = document.getElementById('coursesView')
      
      if (certificates.length === 0) {
        coursesView.innerHTML = `
          <div class="text-center py-16">
            <i class="fas fa-certificate text-gray-300 text-6xl mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum certificado disponível</h3>
            <p class="text-gray-500">Complete cursos para receber seus certificados!</p>
            <button onclick="location.reload()" class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              <i class="fas fa-arrow-left mr-2"></i>Voltar aos Cursos
            </button>
          </div>
        `
        return
      }
      
      const certificatesHTML = certificates.map(cert => {
        const completionDate = new Date(cert.completion_date).toLocaleDateString('pt-BR')
        const verificationUrl = `${window.location.origin}/verificar/${cert.verification_code}`
        
        return `
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
                  <h3 class="text-xl font-bold mb-1">${cert.course_title}</h3>
                  <p class="text-blue-100 text-sm">Concluído em ${completionDate}</p>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-xs text-gray-500 mb-1">Carga Horária</div>
                  <div class="text-lg font-bold text-gray-800">
                    ${cert.carga_horaria || 'N/A'} ${cert.carga_horaria ? 'horas' : ''}
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-xs text-gray-500 mb-1">Código</div>
                  <div class="text-sm font-mono font-bold text-gray-800">
                    ${cert.verification_code}
                  </div>
                </div>
              </div>
              
              <div class="space-y-3">
                <button onclick="certificateManager.viewCertificate(${cert.id})" 
                  class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <i class="fas fa-eye"></i>
                  Visualizar Certificado
                </button>
                
                <button onclick="certificateManager.downloadCertificate(${cert.id})" 
                  class="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <i class="fas fa-download"></i>
                  Baixar PDF
                </button>
                
                <button onclick="certificateManager.shareCertificate('${verificationUrl}')" 
                  class="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2">
                  <i class="fas fa-share-alt"></i>
                  Compartilhar Link de Verificação
                </button>
              </div>
              
              <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <div class="text-xs text-gray-600">
                  <i class="fas fa-info-circle mr-1"></i>
                  Link de verificação: <a href="${verificationUrl}" target="_blank" class="text-blue-600 hover:underline break-all">${verificationUrl}</a>
                </div>
              </div>
            </div>
          </div>
        `
      }).join('')
      
      coursesView.innerHTML = `
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">
                <i class="fas fa-certificate mr-2 text-blue-600"></i>
                Meus Certificados
              </h2>
              <p class="text-gray-600">Total de ${certificates.length} certificado(s) disponível(is)</p>
            </div>
            <button onclick="location.reload()" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              <i class="fas fa-arrow-left mr-2"></i>Voltar aos Cursos
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${certificatesHTML}
        </div>
      `
    } catch (error) {
      console.error('Error loading certificates:', error)
      alert('Erro ao carregar certificados: ' + (error.response?.data?.error || error.message))
    }
  }
}

// Certificate Manager
const certificateManager = {
  // View certificate in new window
  async viewCertificate(certId) {
    try {
      const url = `/api/certificates/${certId}/html`
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error viewing certificate:', error)
      alert('Erro ao visualizar certificado: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Download certificate as PDF
  async downloadCertificate(certId) {
    try {
      // Open certificate in new window with print dialog
      const url = `/api/certificates/${certId}/html`
      const printWindow = window.open(url, '_blank')
      
      // Wait for window to load and trigger print
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.print()
        }, 500)
      })
      
      alert('📄 Certificado aberto em nova janela. Use Ctrl+P ou Cmd+P para imprimir ou salvar como PDF.')
    } catch (error) {
      console.error('Error downloading certificate:', error)
      alert('Erro ao baixar certificado: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Share verification link
  async shareCertificate(verificationUrl) {
    try {
      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'Verificar Certificado - CCT 2026',
          text: 'Verifique a autenticidade deste certificado',
          url: verificationUrl
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(verificationUrl)
        alert('✅ Link de verificação copiado para a área de transferência!')
      }
    } catch (error) {
      console.error('Error sharing certificate:', error)
      // Final fallback: show URL in prompt
      prompt('Link de verificação do certificado:', verificationUrl)
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init()
})
