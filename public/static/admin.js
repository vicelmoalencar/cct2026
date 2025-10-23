// Admin Manager
const adminManager = {
  isAdmin: false,
  
  // Check if user is admin
  async checkAdmin() {
    try {
      const response = await axios.get('/api/admin/check')
      this.isAdmin = response.data.isAdmin
      return this.isAdmin
    } catch (error) {
      this.isAdmin = false
      return false
    }
  },
  
  // CRUD Operations - Courses
  async createCourse(data) {
    const response = await axios.post('/api/admin/courses', data)
    return response.data
  },
  
  async updateCourse(id, data) {
    const response = await axios.put(`/api/admin/courses/${id}`, data)
    return response.data
  },
  
  async deleteCourse(id) {
    const response = await axios.delete(`/api/admin/courses/${id}`)
    return response.data
  },
  
  // CRUD Operations - Modules
  async createModule(data) {
    const response = await axios.post('/api/admin/modules', data)
    return response.data
  },
  
  async updateModule(id, data) {
    const response = await axios.put(`/api/admin/modules/${id}`, data)
    return response.data
  },
  
  async deleteModule(id) {
    const response = await axios.delete(`/api/admin/modules/${id}`)
    return response.data
  },
  
  // CRUD Operations - Lessons
  async createLesson(data) {
    const response = await axios.post('/api/admin/lessons', data)
    return response.data
  },
  
  async updateLesson(id, data) {
    const response = await axios.put(`/api/admin/lessons/${id}`, data)
    return response.data
  },
  
  async deleteLesson(id) {
    const response = await axios.delete(`/api/admin/lessons/${id}`)
    return response.data
  }
}

// Admin UI Manager
const adminUI = {
  currentView: 'courses',
  editingItem: null,
  
  // Show admin panel
  async showAdminPanel() {
    const isAdmin = await adminManager.checkAdmin()
    
    if (!isAdmin) {
      alert('❌ Acesso negado! Você não tem permissão de administrador.')
      return
    }
    
    // Hide main app
    document.getElementById('coursesView').classList.add('hidden')
    document.getElementById('courseView').classList.add('hidden')
    document.getElementById('lessonView').classList.add('hidden')
    
    // Create admin container if not exists
    let adminContainer = document.getElementById('adminView')
    if (!adminContainer) {
      adminContainer = document.createElement('div')
      adminContainer.id = 'adminView'
      document.querySelector('main').appendChild(adminContainer)
    }
    
    adminContainer.classList.remove('hidden')
    this.renderAdminPanel()
  },
  
  // Hide admin panel
  hideAdminPanel() {
    document.getElementById('adminView').classList.add('hidden')
    app.showCourses()
  },
  
  // Render admin panel
  renderAdminPanel() {
    const container = document.getElementById('adminView')
    container.innerHTML = `
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i class="fas fa-tools text-blue-600"></i>
            Painel de Administração
          </h2>
          <p class="text-gray-600 mt-1">Gerencie cursos, módulos e aulas</p>
        </div>
        <button onclick="adminUI.hideAdminPanel()" 
                class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
          <i class="fas fa-arrow-left mr-2"></i>
          Voltar aos Cursos
        </button>
      </div>
      
      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="flex border-b border-gray-200">
          <button onclick="adminUI.switchTab('courses')" 
                  id="tabCourses"
                  class="flex-1 py-4 px-6 font-semibold text-blue-600 border-b-2 border-blue-600 transition-colors">
            <i class="fas fa-book mr-2"></i> Cursos
          </button>
          <button onclick="adminUI.switchTab('modules')" 
                  id="tabModules"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors">
            <i class="fas fa-folder mr-2"></i> Módulos
          </button>
          <button onclick="adminUI.switchTab('lessons')" 
                  id="tabLessons"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors">
            <i class="fas fa-play-circle mr-2"></i> Aulas
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div id="adminContent"></div>
    `
    
    this.switchTab('courses')
  },
  
  // Switch between tabs
  switchTab(tab) {
    this.currentView = tab
    
    // Update tab styles
    const tabs = ['courses', 'modules', 'lessons']
    tabs.forEach(t => {
      const tabEl = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}`)
      if (t === tab) {
        tabEl.classList.add('text-blue-600', 'border-blue-600')
        tabEl.classList.remove('text-gray-400', 'border-transparent')
      } else {
        tabEl.classList.add('text-gray-400', 'border-transparent')
        tabEl.classList.remove('text-blue-600', 'border-blue-600')
      }
    })
    
    // Render content
    if (tab === 'courses') this.renderCoursesTab()
    if (tab === 'modules') this.renderModulesTab()
    if (tab === 'lessons') this.renderLessonsTab()
  },
  
  // Render courses tab
  async renderCoursesTab() {
    const content = document.getElementById('adminContent')
    content.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>'
    
    try {
      const response = await axios.get('/api/courses')
      const courses = response.data.courses
      
      content.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">
              <i class="fas fa-list mr-2"></i>Lista de Cursos
            </h3>
            <button onclick="adminUI.showCourseForm()" 
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-plus mr-2"></i>Novo Curso
            </button>
          </div>
          
          <div class="space-y-4">
            ${courses.map(course => `
              <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="text-lg font-bold text-gray-800">${course.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">${course.description || 'Sem descrição'}</p>
                    <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span><i class="fas fa-user mr-1"></i>${course.instructor}</span>
                      <span><i class="fas fa-clock mr-1"></i>${course.duration_hours}h</span>
                      <span><i class="fas fa-folder mr-1"></i>${course.modules_count} módulos</span>
                      <span><i class="fas fa-play-circle mr-1"></i>${course.lessons_count} aulas</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button onclick='adminUI.showCourseForm(${JSON.stringify(course)})' 
                            class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="adminUI.deleteCourse(${course.id}, '${course.title}')" 
                            class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
            
            ${courses.length === 0 ? '<p class="text-center text-gray-500 py-8">Nenhum curso cadastrado</p>' : ''}
          </div>
        </div>
      `
    } catch (error) {
      content.innerHTML = '<p class="text-red-600">Erro ao carregar cursos</p>'
    }
  },
  
  // Show course form
  showCourseForm(course = null) {
    const isEdit = course !== null
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">
          <i class="fas fa-${isEdit ? 'edit' : 'plus'} mr-2"></i>
          ${isEdit ? 'Editar' : 'Novo'} Curso
        </h3>
        
        <form onsubmit="adminUI.saveCourse(event, ${isEdit ? course.id : 'null'})" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
            <input type="text" id="courseTitle" required
                   value="${isEdit ? course.title : ''}"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Nome do curso">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea id="courseDescription" rows="3"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descrição do curso">${isEdit ? (course.description || '') : ''}</textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Duração (horas)</label>
              <input type="number" id="courseDuration" min="0"
                     value="${isEdit ? course.duration_hours : '0'}"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Instrutor</label>
              <input type="text" id="courseInstructor"
                     value="${isEdit ? course.instructor : 'Vicelmo'}"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          
          <div class="flex items-center gap-3 pt-4">
            <button type="submit" 
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-save mr-2"></i>Salvar
            </button>
            <button type="button" onclick="adminUI.renderCoursesTab()"
                    class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-times mr-2"></i>Cancelar
            </button>
          </div>
        </form>
      </div>
    `
  },
  
  // Save course
  async saveCourse(event, courseId) {
    event.preventDefault()
    
    const data = {
      title: document.getElementById('courseTitle').value,
      description: document.getElementById('courseDescription').value,
      duration_hours: parseInt(document.getElementById('courseDuration').value),
      instructor: document.getElementById('courseInstructor').value
    }
    
    try {
      if (courseId) {
        await adminManager.updateCourse(courseId, data)
        alert('✅ Curso atualizado com sucesso!')
      } else {
        await adminManager.createCourse(data)
        alert('✅ Curso criado com sucesso!')
      }
      this.renderCoursesTab()
    } catch (error) {
      alert('❌ Erro ao salvar curso: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Delete course
  async deleteCourse(id, title) {
    if (!confirm(`Tem certeza que deseja excluir o curso "${title}"?\n\nIsso também excluirá todos os módulos e aulas deste curso.`)) {
      return
    }
    
    try {
      await adminManager.deleteCourse(id)
      alert('✅ Curso excluído com sucesso!')
      this.renderCoursesTab()
    } catch (error) {
      alert('❌ Erro ao excluir curso: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Render modules tab (simplified - just show message to implement)
  renderModulesTab() {
    document.getElementById('adminContent').innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-12 text-center">
        <i class="fas fa-folder text-6xl text-blue-600 mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Gestão de Módulos</h3>
        <p class="text-gray-600">Gestão de módulos será implementada em breve...</p>
        <p class="text-sm text-gray-500 mt-4">Por enquanto, edite os módulos diretamente no banco de dados.</p>
      </div>
    `
  },
  
  // Render lessons tab (simplified - just show message to implement)
  renderLessonsTab() {
    document.getElementById('adminContent').innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-12 text-center">
        <i class="fas fa-play-circle text-6xl text-blue-600 mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Gestão de Aulas</h3>
        <p class="text-gray-600">Gestão completa de aulas com YouTube/Vimeo será implementada em breve...</p>
        <p class="text-sm text-gray-500 mt-4">Por enquanto, edite as aulas diretamente no banco de dados.</p>
      </div>
    `
  }
}
