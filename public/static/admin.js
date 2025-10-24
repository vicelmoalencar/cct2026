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
  courses: [],
  modules: [],
  lessons: [],
  
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
    await this.loadData()
    this.renderAdminPanel()
  },
  
  // Load all data
  async loadData() {
    try {
      const response = await axios.get('/api/courses')
      this.courses = response.data.courses
      
      // Load modules and lessons for each course
      for (const course of this.courses) {
        const detailResponse = await axios.get(`/api/courses/${course.id}`)
        course.modules = detailResponse.data.modules || []
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
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
  renderCoursesTab() {
    const content = document.getElementById('adminContent')
    
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
          ${this.courses.map(course => `
            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-gray-800">${course.title}</h4>
                  <p class="text-sm text-gray-600 mt-1">${course.description || 'Sem descrição'}</p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span><i class="fas fa-user mr-1"></i>${course.instructor}</span>
                    <span><i class="fas fa-clock mr-1"></i>${course.duration_hours}h</span>
                    <span><i class="fas fa-folder mr-1"></i>${course.modules_count || 0} módulos</span>
                    <span><i class="fas fa-play-circle mr-1"></i>${course.lessons_count || 0} aulas</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick='adminUI.showCourseForm(${JSON.stringify(course).replace(/'/g, "&#39;")})' 
                          class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button onclick="adminUI.deleteCourse(${course.id}, '${course.title.replace(/'/g, "\\'")}\')" 
                          class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
          
          ${this.courses.length === 0 ? '<p class="text-center text-gray-500 py-8">Nenhum curso cadastrado</p>' : ''}
        </div>
      </div>
    `
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
            <button type="button" onclick="adminUI.reloadAndShowCourses()"
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
      await this.loadData()
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
      await this.loadData()
      this.renderCoursesTab()
    } catch (error) {
      alert('❌ Erro ao excluir curso: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Render modules tab
  renderModulesTab() {
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800">
            <i class="fas fa-folder mr-2"></i>Gestão de Módulos
          </h3>
          <button onclick="adminUI.showModuleForm()" 
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
            <i class="fas fa-plus mr-2"></i>Novo Módulo
          </button>
        </div>
        
        <div class="space-y-6">
          ${this.courses.map(course => `
            <div class="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 class="text-lg font-bold text-blue-900 mb-3">
                <i class="fas fa-book mr-2"></i>${course.title}
              </h4>
              
              <div class="space-y-2">
                ${(course.modules || []).length === 0 ? 
                  '<p class="text-sm text-gray-500 italic pl-4">Nenhum módulo cadastrado</p>' 
                  : 
                  (course.modules || []).map(module => `
                    <div class="bg-white border border-gray-200 rounded p-3 flex items-center justify-between">
                      <div class="flex-1">
                        <h5 class="font-semibold text-gray-800">${module.title}</h5>
                        <p class="text-xs text-gray-600">${module.description || 'Sem descrição'}</p>
                        <p class="text-xs text-gray-500 mt-1">
                          <i class="fas fa-sort mr-1"></i>Ordem: ${module.order_index} • 
                          <i class="fas fa-play-circle mr-1"></i>${(module.lessons || []).length} aulas
                        </p>
                      </div>
                      <div class="flex items-center gap-2">
                        <button onclick='adminUI.showModuleForm(${JSON.stringify(module).replace(/'/g, "&#39;")}, ${course.id})' 
                                class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="adminUI.deleteModule(${module.id}, '${module.title.replace(/'/g, "\\'")}\')" 
                                class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  `).join('')
                }
              </div>
            </div>
          `).join('')}
          
          ${this.courses.length === 0 ? '<p class="text-center text-gray-500 py-8">Nenhum curso cadastrado. Crie um curso primeiro.</p>' : ''}
        </div>
      </div>
    `
  },
  
  // Show module form
  showModuleForm(module = null, courseId = null) {
    const isEdit = module !== null
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">
          <i class="fas fa-${isEdit ? 'edit' : 'plus'} mr-2"></i>
          ${isEdit ? 'Editar' : 'Novo'} Módulo
        </h3>
        
        <form onsubmit="adminUI.saveModule(event, ${isEdit ? module.id : 'null'})" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Curso *</label>
            <select id="moduleCourse" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione um curso</option>
              ${this.courses.map(c => `
                <option value="${c.id}" ${(isEdit && module.course_id === c.id) || (!isEdit && courseId === c.id) ? 'selected' : ''}>
                  ${c.title}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
            <input type="text" id="moduleTitle" required
                   value="${isEdit ? module.title : ''}"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Nome do módulo">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea id="moduleDescription" rows="3"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descrição do módulo">${isEdit ? (module.description || '') : ''}</textarea>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Ordem de exibição</label>
            <input type="number" id="moduleOrder" min="0"
                   value="${isEdit ? module.order_index : '0'}"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <p class="text-xs text-gray-500 mt-1">Menor número aparece primeiro</p>
          </div>
          
          <div class="flex items-center gap-3 pt-4">
            <button type="submit" 
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-save mr-2"></i>Salvar
            </button>
            <button type="button" onclick="adminUI.reloadAndShowModules()"
                    class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-times mr-2"></i>Cancelar
            </button>
          </div>
        </form>
      </div>
    `
  },
  
  // Save module
  async saveModule(event, moduleId) {
    event.preventDefault()
    
    const data = {
      course_id: parseInt(document.getElementById('moduleCourse').value),
      title: document.getElementById('moduleTitle').value,
      description: document.getElementById('moduleDescription').value,
      order_index: parseInt(document.getElementById('moduleOrder').value)
    }
    
    try {
      if (moduleId) {
        await adminManager.updateModule(moduleId, data)
        alert('✅ Módulo atualizado com sucesso!')
      } else {
        await adminManager.createModule(data)
        alert('✅ Módulo criado com sucesso!')
      }
      await this.loadData()
      this.renderModulesTab()
    } catch (error) {
      alert('❌ Erro ao salvar módulo: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Delete module
  async deleteModule(id, title) {
    if (!confirm(`Tem certeza que deseja excluir o módulo "${title}"?\n\nIsso também excluirá todas as aulas deste módulo.`)) {
      return
    }
    
    try {
      await adminManager.deleteModule(id)
      alert('✅ Módulo excluído com sucesso!')
      await this.loadData()
      this.renderModulesTab()
    } catch (error) {
      alert('❌ Erro ao excluir módulo: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Render lessons tab
  renderLessonsTab() {
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 class="text-xl font-bold text-gray-800">
            <i class="fas fa-play-circle mr-2"></i>Gestão de Aulas
          </h3>
          <button onclick="adminUI.showLessonForm()" 
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
            <i class="fas fa-plus mr-2"></i>Nova Aula
          </button>
        </div>
        
        <!-- Filters and Search -->
        <div class="mb-6 space-y-4">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Filtrar por Curso</label>
              <select id="filterCourse" onchange="adminUI.filterLessons()" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os cursos</option>
                ${this.courses.map(c => `
                  <option value="${c.id}">${c.title}</option>
                `).join('')}
              </select>
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Filtrar por Módulo</label>
              <select id="filterModule" onchange="adminUI.filterLessons()" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os módulos</option>
              </select>
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar Aula</label>
              <input type="text" id="searchLesson" oninput="adminUI.filterLessons()" 
                     placeholder="Digite o nome da aula..."
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">
              <span id="lessonCount" class="font-semibold">0</span> aulas encontradas
            </span>
            <button onclick="adminUI.resetLessonFilters()" 
                    class="text-blue-600 hover:text-blue-800 font-semibold">
              <i class="fas fa-redo mr-1"></i>Limpar Filtros
            </button>
          </div>
        </div>
        
        <!-- Lessons List (organized by course and module) -->
        <div id="lessonsContainer" class="space-y-6">
          ${this.renderLessonsByCourse()}
        </div>
      </div>
    `
    
    this.updateLessonCount()
  },
  
  // Render lessons organized by course and module
  renderLessonsByCourse() {
    if (this.courses.length === 0) {
      return '<p class="text-center text-gray-500 py-8">Nenhum curso cadastrado.</p>'
    }
    
    let hasLessons = false
    
    const html = this.courses.map(course => {
      const modules = course.modules || []
      const modulesWithLessons = modules.filter(m => (m.lessons || []).length > 0)
      
      if (modulesWithLessons.length === 0) return ''
      
      hasLessons = true
      
      return `
        <div class="border-2 border-gray-200 rounded-lg overflow-hidden" data-course-id="${course.id}">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <h4 class="text-lg font-bold flex items-center gap-2">
              <i class="fas fa-book"></i>
              ${course.title}
              <span class="text-sm font-normal opacity-90">
                (${modules.reduce((sum, m) => sum + (m.lessons || []).length, 0)} aulas)
              </span>
            </h4>
          </div>
          
          <div class="divide-y divide-gray-200">
            ${modulesWithLessons.map(module => `
              <div class="bg-gray-50" data-module-id="${module.id}">
                <div class="bg-blue-50 p-3 border-b border-blue-100">
                  <h5 class="font-semibold text-gray-800 flex items-center gap-2">
                    <i class="fas fa-folder text-blue-600"></i>
                    ${module.title}
                    <span class="text-sm font-normal text-gray-600">
                      (${(module.lessons || []).length} aulas)
                    </span>
                  </h5>
                </div>
                
                <div class="divide-y divide-gray-200">
                  ${(module.lessons || []).map(lesson => `
                    <div class="p-4 hover:bg-white transition-colors lesson-item" 
                         data-lesson-id="${lesson.id}"
                         data-lesson-title="${lesson.title.toLowerCase()}">
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1 min-w-0">
                          <h6 class="font-semibold text-gray-800 mb-1">${lesson.title}</h6>
                          <p class="text-sm text-gray-600 mb-2">${lesson.description || 'Sem descrição'}</p>
                          <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span><i class="fas fa-video mr-1"></i>${lesson.video_provider || 'N/A'}</span>
                            <span><i class="fas fa-clock mr-1"></i>${lesson.duration_minutes} min</span>
                            <span><i class="fas fa-sort mr-1"></i>Ordem: ${lesson.order_index}</span>
                            ${lesson.support_text ? '<span class="text-blue-600"><i class="fas fa-file-alt mr-1"></i>Texto apoio</span>' : ''}
                            ${lesson.transcript ? '<span class="text-purple-600"><i class="fas fa-closed-captioning mr-1"></i>Transcrição</span>' : ''}
                            ${lesson.attachments && lesson.attachments.length > 0 ? `<span class="text-green-600"><i class="fas fa-paperclip mr-1"></i>${lesson.attachments.length} arquivo(s)</span>` : ''}
                          </div>
                        </div>
                        <div class="flex items-center gap-2 flex-shrink-0">
                          <button onclick='adminUI.showLessonForm(${JSON.stringify(lesson).replace(/'/g, "&#39;")})' 
                                  class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm whitespace-nowrap">
                            <i class="fas fa-edit"></i>
                            <span class="hidden sm:inline ml-1">Editar</span>
                          </button>
                          <button onclick="adminUI.deleteLesson(${lesson.id}, '${lesson.title.replace(/'/g, "\\'")}\')" 
                                  class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm whitespace-nowrap">
                            <i class="fas fa-trash"></i>
                            <span class="hidden sm:inline ml-1">Excluir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `
    }).join('')
    
    return hasLessons ? html : '<p class="text-center text-gray-500 py-8">Nenhuma aula cadastrada. Crie módulos e aulas primeiro.</p>'
  },
  
  // Filter lessons
  filterLessons() {
    const courseId = document.getElementById('filterCourse').value
    const moduleId = document.getElementById('filterModule').value
    const searchText = document.getElementById('searchLesson').value.toLowerCase()
    
    // Update module dropdown based on selected course
    if (courseId) {
      const course = this.courses.find(c => c.id == courseId)
      const moduleSelect = document.getElementById('filterModule')
      moduleSelect.innerHTML = '<option value="">Todos os módulos</option>'
      
      if (course && course.modules) {
        course.modules.forEach(m => {
          moduleSelect.innerHTML += `<option value="${m.id}">${m.title}</option>`
        })
      }
    } else {
      document.getElementById('filterModule').innerHTML = '<option value="">Todos os módulos</option>'
    }
    
    // Apply filters
    const allCourseContainers = document.querySelectorAll('[data-course-id]')
    const allModuleContainers = document.querySelectorAll('[data-module-id]')
    const allLessonItems = document.querySelectorAll('.lesson-item')
    
    // Reset visibility
    allCourseContainers.forEach(el => el.style.display = 'block')
    allModuleContainers.forEach(el => el.style.display = 'block')
    allLessonItems.forEach(el => el.style.display = 'block')
    
    let visibleCount = 0
    
    // Filter by course
    if (courseId) {
      allCourseContainers.forEach(el => {
        if (el.dataset.courseId != courseId) {
          el.style.display = 'none'
        }
      })
    }
    
    // Filter by module
    if (moduleId) {
      allModuleContainers.forEach(el => {
        if (el.dataset.moduleId != moduleId) {
          el.style.display = 'none'
        }
      })
    }
    
    // Filter by search text
    if (searchText) {
      allLessonItems.forEach(el => {
        const title = el.dataset.lessonTitle || ''
        if (!title.includes(searchText)) {
          el.style.display = 'none'
        }
      })
    }
    
    // Count visible lessons
    allLessonItems.forEach(el => {
      if (el.style.display !== 'none') {
        visibleCount++
      }
    })
    
    // Hide empty modules and courses
    allModuleContainers.forEach(moduleEl => {
      const visibleLessons = Array.from(moduleEl.querySelectorAll('.lesson-item'))
        .filter(el => el.style.display !== 'none')
      
      if (visibleLessons.length === 0) {
        moduleEl.style.display = 'none'
      }
    })
    
    allCourseContainers.forEach(courseEl => {
      const visibleModules = Array.from(courseEl.querySelectorAll('[data-module-id]'))
        .filter(el => el.style.display !== 'none')
      
      if (visibleModules.length === 0) {
        courseEl.style.display = 'none'
      }
    })
    
    this.updateLessonCount(visibleCount)
  },
  
  // Reset lesson filters
  resetLessonFilters() {
    document.getElementById('filterCourse').value = ''
    document.getElementById('filterModule').value = ''
    document.getElementById('searchLesson').value = ''
    this.filterLessons()
  },
  
  // Update lesson count
  updateLessonCount(count = null) {
    if (count === null) {
      // Count all lessons
      count = 0
      this.courses.forEach(course => {
        (course.modules || []).forEach(module => {
          count += (module.lessons || []).length
        })
      })
    }
    
    const countElement = document.getElementById('lessonCount')
    if (countElement) {
      countElement.textContent = count
    }
  },
  
  // Show lesson form
  showLessonForm(lesson = null, moduleId = null) {
    const isEdit = lesson !== null
    const content = document.getElementById('adminContent')
    
    // Initialize attachments array for editing
    this.currentAttachments = (isEdit && lesson.attachments) ? [...lesson.attachments] : []
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">
          <i class="fas fa-${isEdit ? 'edit' : 'plus'} mr-2"></i>
          ${isEdit ? 'Editar' : 'Nova'} Aula
        </h3>
        
        <form onsubmit="adminUI.saveLesson(event, ${isEdit ? lesson.id : 'null'})" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Módulo *</label>
            <select id="lessonModule" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione um módulo</option>
              ${this.courses.map(course => `
                <optgroup label="${course.title}">
                  ${(course.modules || []).map(m => `
                    <option value="${m.id}" ${(isEdit && lesson.module_id === m.id) || (!isEdit && moduleId === m.id) ? 'selected' : ''}>
                      ${m.title}
                    </option>
                  `).join('')}
                </optgroup>
              `).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
            <input type="text" id="lessonTitle" required
                   value="${isEdit ? lesson.title : ''}"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Nome da aula">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea id="lessonDescription" rows="3"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descrição da aula">${isEdit ? (lesson.description || '') : ''}</textarea>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Provedor de Vídeo *</label>
            <select id="lessonProvider" required onchange="adminUI.updateVideoIdPlaceholder()"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione o provedor</option>
              <option value="youtube" ${isEdit && lesson.video_provider === 'youtube' ? 'selected' : ''}>YouTube</option>
              <option value="vimeo" ${isEdit && lesson.video_provider === 'vimeo' ? 'selected' : ''}>Vimeo</option>
              <option value="url" ${isEdit && lesson.video_provider === 'url' ? 'selected' : ''}>URL Direta</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">ID ou URL do Vídeo *</label>
            <input type="text" id="lessonVideoId" required
                   value="${isEdit ? (lesson.video_id || '') : ''}"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Ex: dQw4w9WgXcQ (YouTube) ou 123456789 (Vimeo)">
            <p class="text-xs text-gray-500 mt-1" id="videoIdHelp">
              Para YouTube: use o ID do vídeo (ex: dQw4w9WgXcQ da URL youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>)<br>
              Para Vimeo: use o ID numérico (ex: 123456789 da URL vimeo.com/<strong>123456789</strong>)<br>
              Para URL: cole a URL completa do vídeo
            </p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Duração (minutos)</label>
              <input type="number" id="lessonDuration" min="0"
                     value="${isEdit ? lesson.duration_minutes : '0'}"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Ordem de exibição</label>
              <input type="number" id="lessonOrder" min="0"
                     value="${isEdit ? lesson.order_index : '0'}"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <p class="text-xs text-gray-500 mt-1">Menor número aparece primeiro</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-file-alt mr-2"></i>Texto de Apoio
            </label>
            <textarea id="lessonSupportText" rows="5"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Conteúdo complementar, links úteis, notas de estudo...">${isEdit ? (lesson.support_text || '') : ''}</textarea>
            <p class="text-xs text-gray-500 mt-1">Conteúdo que complementa a aula (suporta formatação Markdown)</p>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-closed-captioning mr-2"></i>Transcrição do Vídeo
            </label>
            <textarea id="lessonTranscript" rows="8"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Transcrição completa do vídeo...">${isEdit ? (lesson.transcript || '') : ''}</textarea>
            <p class="text-xs text-gray-500 mt-1">Texto transcrito do áudio/vídeo da aula para acessibilidade</p>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-paperclip mr-2"></i>Arquivos Anexados
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <input type="file" id="lessonAttachments" multiple
                     class="hidden" onchange="adminUI.handleFileSelect(event)">
              <button type="button" onclick="document.getElementById('lessonAttachments').click()"
                      class="w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors">
                <i class="fas fa-cloud-upload-alt mr-2"></i>Selecionar Arquivos
              </button>
              <p class="text-xs text-gray-500 mt-2 text-center">PDF, Excel, Word, PowerPoint, ZIP (máx. 10MB por arquivo)</p>
              
              <div id="filesList" class="mt-4 space-y-2">
                ${isEdit && lesson.attachments && Array.isArray(lesson.attachments) && lesson.attachments.length > 0 ? 
                  lesson.attachments.map((file, idx) => `
                    <div class="flex items-center justify-between bg-white border border-gray-200 rounded p-3" data-file-index="${idx}">
                      <div class="flex items-center gap-3">
                        <i class="fas fa-file-${adminUI.getFileIcon(file.type)} text-blue-600 text-xl"></i>
                        <div>
                          <p class="text-sm font-semibold text-gray-800">${file.name}</p>
                          <p class="text-xs text-gray-500">${adminUI.formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button type="button" onclick="adminUI.removeAttachment(${idx})"
                              class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  `).join('') 
                  : '<p class="text-sm text-gray-500 italic text-center">Nenhum arquivo anexado</p>'
                }
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 pt-4">
            <button type="submit" 
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-save mr-2"></i>Salvar
            </button>
            <button type="button" onclick="adminUI.reloadAndShowLessons()"
                    class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-times mr-2"></i>Cancelar
            </button>
          </div>
        </form>
      </div>
    `
  },
  
  // Update video ID placeholder based on provider
  updateVideoIdPlaceholder() {
    const provider = document.getElementById('lessonProvider').value
    const input = document.getElementById('lessonVideoId')
    const help = document.getElementById('videoIdHelp')
    
    if (provider === 'youtube') {
      input.placeholder = 'Ex: dQw4w9WgXcQ'
      help.innerHTML = 'Use o ID do vídeo do YouTube (ex: dQw4w9WgXcQ da URL youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>)'
    } else if (provider === 'vimeo') {
      input.placeholder = 'Ex: 123456789'
      help.innerHTML = 'Use o ID numérico do Vimeo (ex: 123456789 da URL vimeo.com/<strong>123456789</strong>)'
    } else if (provider === 'url') {
      input.placeholder = 'Ex: https://exemplo.com/video.mp4'
      help.innerHTML = 'Cole a URL completa do vídeo'
    }
  },
  
  // Save lesson
  async saveLesson(event, lessonId) {
    event.preventDefault()
    
    const data = {
      module_id: parseInt(document.getElementById('lessonModule').value),
      title: document.getElementById('lessonTitle').value,
      description: document.getElementById('lessonDescription').value,
      video_provider: document.getElementById('lessonProvider').value,
      video_id: document.getElementById('lessonVideoId').value,
      duration_minutes: parseInt(document.getElementById('lessonDuration').value),
      order_index: parseInt(document.getElementById('lessonOrder').value),
      support_text: document.getElementById('lessonSupportText').value || null,
      transcript: document.getElementById('lessonTranscript').value || null,
      attachments: this.currentAttachments || []
    }
    
    try {
      if (lessonId) {
        await adminManager.updateLesson(lessonId, data)
        alert('✅ Aula atualizada com sucesso!')
      } else {
        await adminManager.createLesson(data)
        alert('✅ Aula criada com sucesso!')
      }
      // Clear attachments cache
      this.currentAttachments = []
      await this.loadData()
      this.renderLessonsTab()
    } catch (error) {
      alert('❌ Erro ao salvar aula: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Delete lesson
  async deleteLesson(id, title) {
    if (!confirm(`Tem certeza que deseja excluir a aula "${title}"?`)) {
      return
    }
    
    try {
      await adminManager.deleteLesson(id)
      alert('✅ Aula excluída com sucesso!')
      await this.loadData()
      this.renderLessonsTab()
    } catch (error) {
      alert('❌ Erro ao excluir aula: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Helper methods to reload and show tabs
  async reloadAndShowCourses() {
    await this.loadData()
    this.renderCoursesTab()
  },
  
  async reloadAndShowModules() {
    await this.loadData()
    this.renderModulesTab()
  },
  
  async reloadAndShowLessons() {
    await this.loadData()
    this.renderLessonsTab()
  },
  
  // File handling methods
  currentAttachments: [],
  
  async handleFileSelect(event) {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/x-zip-compressed'
    ]
    
    for (const file of files) {
      // Validate size
      if (file.size > maxSize) {
        alert(`❌ Arquivo "${file.name}" muito grande. Máximo: 10MB`)
        continue
      }
      
      // Validate type
      if (!allowedTypes.includes(file.type)) {
        alert(`❌ Tipo de arquivo "${file.name}" não permitido. Use: PDF, Excel, Word, PowerPoint ou ZIP`)
        continue
      }
      
      // Convert to base64 for storage
      const base64 = await this.fileToBase64(file)
      
      // Add to current attachments
      this.currentAttachments.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64
      })
    }
    
    // Update files list display
    this.updateFilesListDisplay()
    
    // Clear input
    event.target.value = ''
  },
  
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1]) // Remove data:xxx;base64, prefix
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
  
  updateFilesListDisplay() {
    const container = document.getElementById('filesList')
    if (!container) return
    
    if (this.currentAttachments.length === 0) {
      container.innerHTML = '<p class="text-sm text-gray-500 italic text-center">Nenhum arquivo anexado</p>'
      return
    }
    
    container.innerHTML = this.currentAttachments.map((file, idx) => `
      <div class="flex items-center justify-between bg-white border border-gray-200 rounded p-3" data-file-index="${idx}">
        <div class="flex items-center gap-3">
          <i class="fas fa-file-${this.getFileIcon(file.type)} text-blue-600 text-xl"></i>
          <div>
            <p class="text-sm font-semibold text-gray-800">${file.name}</p>
            <p class="text-xs text-gray-500">${this.formatFileSize(file.size)}</p>
          </div>
        </div>
        <button type="button" onclick="adminUI.removeAttachment(${idx})"
                class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('')
  },
  
  removeAttachment(index) {
    this.currentAttachments.splice(index, 1)
    this.updateFilesListDisplay()
  },
  
  getFileIcon(mimeType) {
    if (mimeType.includes('pdf')) return 'pdf'
    if (mimeType.includes('word') || mimeType.includes('msword')) return 'word'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'powerpoint'
    if (mimeType.includes('zip')) return 'archive'
    return 'alt'
  },
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }
}
