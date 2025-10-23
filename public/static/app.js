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
    
    this.loadCourses()
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
      
      const coursesList = document.getElementById('coursesList')
      coursesList.innerHTML = courses.map(course => `
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
             onclick="app.loadCourse(${course.id})">
          <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <i class="fas fa-book-open text-white text-6xl"></i>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">${course.title}</h3>
            <p class="text-gray-600 text-sm mb-4">${course.description || ''}</p>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span><i class="fas fa-list-ul mr-1"></i> ${course.modules_count} módulos</span>
              <span><i class="fas fa-play-circle mr-1"></i> ${course.lessons_count} aulas</span>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              <i class="fas fa-clock mr-1"></i> ${course.duration_hours}h de conteúdo
            </div>
          </div>
        </div>
      `).join('')
    } catch (error) {
      console.error('Error loading courses:', error)
      alert('Erro ao carregar cursos')
    }
  },
  
  // Load course with modules and lessons
  async loadCourse(courseId) {
    try {
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
    } catch (error) {
      console.error('Error loading course:', error)
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
  
  // Load lesson details
  async loadLesson(lessonId) {
    try {
      this.currentLesson = lessonId
      
      const response = await axios.get(`/api/lessons/${lessonId}`)
      const { lesson, comments } = response.data
      
      // Check if completed
      const progressResponse = await axios.get(`/api/progress/${this.currentUser}/${lesson.course_id}`)
      const progress = progressResponse.data.progress
      const isCompleted = progress.find(p => p.lesson_id == lessonId)?.completed || false
      
      const lessonDetail = document.getElementById('lessonDetail')
      lessonDetail.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-8 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm text-blue-600 font-semibold mb-1">${lesson.module_title}</p>
              <h2 class="text-3xl font-bold text-gray-800">${lesson.title}</h2>
            </div>
            <button onclick="app.toggleComplete(${lessonId}, ${isCompleted})"
                    class="px-6 py-3 rounded-lg font-semibold transition-colors ${
                      isCompleted 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }">
              <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'} mr-2"></i>
              ${isCompleted ? 'Concluída' : 'Marcar como concluída'}
            </button>
          </div>
          
          <p class="text-gray-600 mb-4">${lesson.description || ''}</p>
          <div class="text-sm text-gray-500">
            <i class="fas fa-clock mr-1"></i> ${lesson.duration_minutes} minutos
          </div>
          
          <!-- Video Placeholder -->
          <div class="mt-6 bg-gray-900 aspect-video rounded-lg flex items-center justify-center">
            <div class="text-center text-white">
              <i class="fas fa-video text-6xl mb-4"></i>
              <p class="text-lg">Vídeo da aula</p>
              <p class="text-sm text-gray-400 mt-2">URL: ${lesson.video_url || 'A ser configurado'}</p>
            </div>
          </div>
        </div>
        
        <!-- Comments Section -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-6">
            <i class="fas fa-comments mr-2"></i>
            Comentários (${comments.length})
          </h3>
          
          <!-- Add Comment Form -->
          <div class="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-700 mb-3">Adicionar comentário</h4>
            <textarea id="commentText" 
                      class="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Digite seu comentário..."></textarea>
            <div class="flex gap-3 mb-3">
              <input type="text" id="commentName" 
                     class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Seu nome">
              <input type="email" id="commentEmail" 
                     class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Seu email"
                     value="${this.currentUser}">
            </div>
            <button onclick="app.addComment(${lessonId})"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-paper-plane mr-2"></i>
              Enviar comentário
            </button>
          </div>
          
          <!-- Comments List -->
          <div class="space-y-4" id="commentsList">
            ${comments.length === 0 ? '<p class="text-gray-500 text-center py-8">Ainda não há comentários. Seja o primeiro!</p>' : ''}
            ${comments.map(comment => `
              <div class="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
                <div class="flex items-center gap-2 mb-2">
                  <i class="fas fa-user-circle text-blue-600 text-xl"></i>
                  <span class="font-semibold text-gray-800">${comment.user_name}</span>
                  <span class="text-sm text-gray-500">• ${new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <p class="text-gray-700">${comment.comment_text}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `
      
      this.showLessonView()
    } catch (error) {
      console.error('Error loading lesson:', error)
      alert('Erro ao carregar aula')
    }
  },
  
  // Add comment
  async addComment(lessonId) {
    const text = document.getElementById('commentText').value.trim()
    const name = document.getElementById('commentName').value.trim()
    const email = document.getElementById('commentEmail').value.trim()
    
    if (!text || !name || !email) {
      alert('Por favor, preencha todos os campos')
      return
    }
    
    try {
      await axios.post(`/api/lessons/${lessonId}/comments`, {
        user_name: name,
        user_email: email,
        comment_text: text
      })
      
      // Reload lesson to show new comment
      this.loadLesson(lessonId)
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Erro ao adicionar comentário')
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
    } catch (error) {
      console.error('Error updating progress:', error)
      alert('Erro ao atualizar progresso')
    }
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
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init()
})
