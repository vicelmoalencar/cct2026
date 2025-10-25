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
  },
  
  // Certificate template - Upload image directly
  async uploadCertificateTemplate(courseId, imageData, fileName) {
    const response = await axios.post('/api/admin/certificate-template', {
      course_id: courseId,
      image_data: imageData,
      file_name: fileName
    })
    return response.data
  },
  
  async getCertificateTemplate(courseId) {
    const response = await axios.get(`/api/certificate-template/${courseId}`)
    return response.data.template
  },
  
  // Plans Management
  async getPlans() {
    const response = await axios.get('/api/plans')
    return response.data.plans
  },
  
  async createPlan(data) {
    const response = await axios.post('/api/admin/plans', data)
    return response.data
  },
  
  async updatePlan(id, data) {
    const response = await axios.put(`/api/admin/plans/${id}`, data)
    return response.data
  },
  
  async deletePlan(id) {
    const response = await axios.delete(`/api/admin/plans/${id}`)
    return response.data
  },
  
  // Find existing items (for duplicate checking)
  async findCourseByTitle(title) {
    try {
      const response = await axios.get(`/api/admin/courses/find?title=${encodeURIComponent(title)}`)
      return response.data.course
    } catch (error) {
      return null
    }
  },
  
  async findModuleByTitle(courseId, title) {
    try {
      const response = await axios.get(`/api/admin/modules/find?course_id=${courseId}&title=${encodeURIComponent(title)}`)
      return response.data.module
    } catch (error) {
      return null
    }
  },
  
  async findLessonByTitle(moduleId, title) {
    try {
      const response = await axios.get(`/api/admin/lessons/find?module_id=${moduleId}&title=${encodeURIComponent(title)}`)
      return response.data.lesson
    } catch (error) {
      return null
    }
  },
  
  // Subscriptions Management
  async getSubscriptions() {
    const response = await axios.get('/api/admin/subscriptions')
    return response.data.subscriptions
  },
  
  async createSubscription(data) {
    const response = await axios.post('/api/admin/subscriptions', data)
    return response.data
  },
  
  async expireSubscription(subscriptionId) {
    const response = await axios.post('/api/admin/subscriptions/expire', {
      subscription_id: subscriptionId
    })
    return response.data
  },
  
  async expireAllSubscriptions() {
    const response = await axios.post('/api/admin/subscriptions/expire')
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
  plans: [],
  subscriptions: [],
  
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
      
      // Load plans
      try {
        const plansResponse = await axios.get('/api/plans')
        this.plans = plansResponse.data.plans || []
      } catch (error) {
        console.error('Error loading plans:', error)
        this.plans = []
      }
      
      // Load subscriptions  
      try {
        const subsResponse = await axios.get('/api/admin/subscriptions')
        this.subscriptions = subsResponse.data.subscriptions || []
      } catch (error) {
        console.error('Error loading subscriptions:', error)
        this.subscriptions = []
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
        <div class="flex border-b border-gray-200 overflow-x-auto">
          <button onclick="adminUI.switchTab('courses')" 
                  id="tabCourses"
                  class="flex-1 py-4 px-6 font-semibold text-blue-600 border-b-2 border-blue-600 transition-colors whitespace-nowrap">
            <i class="fas fa-book mr-2"></i> Cursos
          </button>
          <button onclick="adminUI.switchTab('modules')" 
                  id="tabModules"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors whitespace-nowrap">
            <i class="fas fa-folder mr-2"></i> Módulos
          </button>
          <button onclick="adminUI.switchTab('lessons')" 
                  id="tabLessons"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors whitespace-nowrap">
            <i class="fas fa-play-circle mr-2"></i> Aulas
          </button>
          <button onclick="adminUI.switchTab('plans')" 
                  id="tabPlans"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors whitespace-nowrap">
            <i class="fas fa-tags mr-2"></i> Planos
          </button>
          <button onclick="adminUI.switchTab('subscriptions')" 
                  id="tabSubscriptions"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors whitespace-nowrap">
            <i class="fas fa-users mr-2"></i> Assinaturas
          </button>
          <button onclick="adminUI.switchTab('users')" 
                  id="tabUsers"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors whitespace-nowrap">
            <i class="fas fa-user-friends mr-2"></i> Usuários
          </button>
          <button onclick="adminUI.switchTab('certificates')" 
                  id="tabCertificates"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors whitespace-nowrap">
            <i class="fas fa-certificate mr-2"></i> Certificados
          </button>
          <button onclick="adminUI.switchTab('import')" 
                  id="tabImport"
                  class="flex-1 py-4 px-6 font-semibold text-gray-400 border-b-2 border-transparent hover:text-blue-600 transition-colors whitespace-nowrap">
            <i class="fas fa-file-import mr-2"></i> Importar
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
    const tabs = ['courses', 'modules', 'lessons', 'plans', 'subscriptions', 'users', 'certificates', 'import']
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
    if (tab === 'plans') this.renderPlansTab()
    if (tab === 'subscriptions') this.renderSubscriptionsTab()
    if (tab === 'certificates') this.renderCertificatesTab()
    if (tab === 'users') this.renderUsersTab()
    if (tab === 'import') this.renderImportTab()
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
  async showCourseForm(course = null) {
    const isEdit = course !== null
    const content = document.getElementById('adminContent')
    
    // Load certificate template if editing
    let certificateUrl = ''
    if (isEdit) {
      try {
        const template = await adminManager.getCertificateTemplate(course.id)
        if (template) {
          certificateUrl = template.template_url
        }
      } catch (error) {
        console.log('No certificate template found')
      }
    }
    
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
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-certificate text-yellow-500 mr-2"></i>
              Template de Certificado
            </label>
            
            <!-- Current Template Preview -->
            <div id="currentTemplatePreview" class="${certificateUrl ? '' : 'hidden'} mb-4">
              <p class="text-xs text-gray-600 mb-2">Template atual:</p>
              <img src="${certificateUrl}" 
                   alt="Template atual" 
                   class="max-w-full h-auto rounded-lg border-2 border-gray-300 shadow-sm">
              <p class="text-xs text-gray-500 mt-1">
                <i class="fas fa-check-circle text-green-500"></i> 
                Template salvo no Supabase Storage
              </p>
            </div>
            
            <!-- Upload New Template -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
              <input type="file" id="certificateTemplateFile" accept="image/*"
                     class="hidden" onchange="adminUI.handleCertificateImageSelect(event)">
              <button type="button" onclick="document.getElementById('certificateTemplateFile').click()"
                      class="w-full px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg font-semibold transition-colors">
                <i class="fas fa-cloud-upload-alt mr-2"></i>
                ${certificateUrl ? 'Alterar Template' : 'Fazer Upload do Template'}
              </button>
              <p class="text-xs text-gray-500 mt-2 text-center">
                <i class="fas fa-info-circle"></i> 
                Faça upload da imagem do certificado (JPG, PNG). A imagem será armazenada no Supabase Storage.
              </p>
              
              <!-- Preview new upload -->
              <div id="newTemplatePreview" class="hidden mt-4">
                <p class="text-xs text-gray-600 mb-2">Nova imagem selecionada:</p>
                <img id="newTemplateImage" src="" alt="Preview" 
                     class="max-w-full h-auto rounded-lg border-2 border-blue-300 shadow-sm">
                <p class="text-xs text-blue-600 mt-1">
                  <i class="fas fa-info-circle"></i> 
                  Clique em "Salvar" para fazer upload desta imagem
                </p>
              </div>
            </div>
            
            <p class="text-xs text-gray-500 mt-2">
              <i class="fas fa-magic text-purple-500"></i> 
              O certificado será gerado automaticamente quando o aluno completar 100% do curso.
            </p>
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
      let savedCourseId = courseId
      
      if (courseId) {
        await adminManager.updateCourse(courseId, data)
        console.log('✅ Curso atualizado')
      } else {
        const result = await adminManager.createCourse(data)
        savedCourseId = result.course_id
        console.log('✅ Curso criado com ID:', savedCourseId)
      }
      
      // Upload certificate template if new image was selected
      if (this.certificateImageData && this.certificateImageFileName) {
        try {
          console.log('📤 Fazendo upload do template de certificado...')
          const uploadResult = await adminManager.uploadCertificateTemplate(
            savedCourseId, 
            this.certificateImageData,
            this.certificateImageFileName
          )
          console.log('✅ Template de certificado salvo!', uploadResult)
          
          // Clear image data after successful upload
          this.certificateImageData = null
          this.certificateImageFileName = null
          
          alert('✅ Curso e template de certificado salvos com sucesso!')
        } catch (certError) {
          console.error('❌ Erro ao salvar template:', certError)
          console.error('📋 Detalhes do erro:', certError.response?.data)
          
          let errorMessage = 'Erro desconhecido'
          if (certError.response?.data) {
            const data = certError.response.data
            errorMessage = data.error || 'Erro ao fazer upload'
            if (data.hint) errorMessage += '\n\n💡 ' + data.hint
            if (data.details) {
              console.error('📝 Detalhes técnicos:', data.details)
              errorMessage += '\n\nDetalhes: ' + JSON.stringify(data.details, null, 2)
            }
          } else {
            errorMessage = certError.message
          }
          
          alert('⚠️ Curso salvo, mas houve erro ao fazer upload do template de certificado:\n\n' + errorMessage)
        }
      } else {
        alert('✅ Curso salvo com sucesso!')
      }
      
      await this.loadData()
      this.renderCoursesTab()
    } catch (error) {
      console.error('❌ Erro ao salvar curso:', error)
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
                          <div class="flex items-center gap-2 mb-1">
                            <h6 class="font-semibold text-gray-800">${lesson.title}</h6>
                            ${lesson.free_trial ? 
                              '<span class="text-xs bg-blue-500 text-white px-2 py-1 rounded font-semibold"><i class="fas fa-gift mr-1"></i>GRÁTIS</span>' : 
                              '<span class="text-xs bg-yellow-500 text-white px-2 py-1 rounded font-semibold"><i class="fas fa-crown mr-1"></i>PREMIUM</span>'
                            }
                          </div>
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
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" id="lessonFreeTrial" 
                     ${isEdit && lesson.free_trial ? 'checked' : ''}
                     class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-3">
                <span class="text-sm font-semibold text-gray-800">
                  <i class="fas fa-gift mr-2 text-blue-600"></i>Disponível no Teste Grátis
                </span>
                <span class="block text-xs text-gray-600 mt-1">
                  Marque esta opção para que usuários sem assinatura possam acessar esta aula
                </span>
              </span>
            </label>
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
      free_trial: document.getElementById('lessonFreeTrial').checked,
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
  },
  
  // Certificate template image handling
  certificateImageData: null,
  certificateImageFileName: null,
  
  handleCertificateImageSelect(event) {
    const file = event.target.files[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('❌ Por favor, selecione uma imagem (JPG, PNG, etc.)')
      return
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('❌ Imagem muito grande. Máximo: 5MB')
      return
    }
    
    // Store filename
    this.certificateImageFileName = file.name
    
    // Convert to base64 for preview and upload
    const reader = new FileReader()
    reader.onload = (e) => {
      this.certificateImageData = e.target.result
      
      // Show preview
      const previewContainer = document.getElementById('newTemplatePreview')
      const previewImage = document.getElementById('newTemplateImage')
      
      if (previewContainer && previewImage) {
        previewImage.src = this.certificateImageData
        previewContainer.classList.remove('hidden')
      }
      
      console.log('✅ Imagem selecionada:', {
        name: file.name,
        size: this.formatFileSize(file.size),
        type: file.type
      })
    }
    reader.readAsDataURL(file)
    
    // Clear input to allow re-selecting same file
    event.target.value = ''
  },
  
  // ==================== PLANS TAB ====================
  
  renderPlansTab() {
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-800">
              <i class="fas fa-tags mr-2"></i>Planos de Assinatura
            </h3>
            <p class="text-sm text-gray-600 mt-1">Gerencie os planos disponíveis para os usuários</p>
          </div>
          <button onclick="adminUI.showPlanForm()" 
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
            <i class="fas fa-plus mr-2"></i>Novo Plano
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${this.plans.map(plan => `
            <div class="border-2 ${plan.is_free_trial ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between mb-3">
                <h4 class="text-lg font-bold text-gray-800">${plan.name}</h4>
                ${plan.is_free_trial ? '<span class="text-xs bg-blue-500 text-white px-2 py-1 rounded">GRÁTIS</span>' : ''}
              </div>
              
              <p class="text-2xl font-bold text-blue-600 mb-2">
                ${plan.price > 0 ? `R$ ${parseFloat(plan.price).toFixed(2)}` : 'Grátis'}
              </p>
              
              <p class="text-sm text-gray-600 mb-3">${plan.description || 'Sem descrição'}</p>
              
              <div class="text-sm text-gray-700 mb-3">
                <i class="fas fa-calendar mr-1"></i>
                <strong>${plan.duration_days}</strong> dias
              </div>
              
              ${plan.features && Array.isArray(plan.features) && plan.features.length > 0 ? `
                <div class="space-y-1 mb-4">
                  ${plan.features.map(feature => `
                    <div class="text-xs text-gray-600">
                      <i class="fas fa-check text-green-600 mr-1"></i>${feature}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              <div class="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button onclick='adminUI.showPlanForm(${JSON.stringify(plan).replace(/'/g, "&#39;")})' 
                        class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                  <i class="fas fa-edit mr-1"></i>Editar
                </button>
                <button onclick="adminUI.deletePlan(${plan.id}, '${plan.name.replace(/'/g, "\\'")}')" 
                        class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              
              <div class="mt-2">
                <span class="text-xs ${plan.is_active ? 'text-green-600' : 'text-red-600'}">
                  <i class="fas fa-circle mr-1"></i>${plan.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          `).join('')}
          
          ${this.plans.length === 0 ? '<p class="col-span-full text-center text-gray-500 py-8">Nenhum plano cadastrado</p>' : ''}
        </div>
      </div>
    `
  },
  
  showPlanForm(plan = null) {
    const isEdit = plan !== null
    const content = document.getElementById('adminContent')
    
    // Parse features if it's a string
    let features = []
    if (isEdit && plan.features) {
      features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features)
    }
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">
          <i class="fas fa-${isEdit ? 'edit' : 'plus'} mr-2"></i>
          ${isEdit ? 'Editar' : 'Novo'} Plano
        </h3>
        
        <form onsubmit="adminUI.savePlan(event, ${isEdit ? plan.id : 'null'})" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nome do Plano *</label>
              <input type="text" id="planName" required
                     value="${isEdit ? plan.name : ''}"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Ex: Mensal, Trimestral, Anual">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Preço (R$) *</label>
              <input type="number" id="planPrice" required step="0.01" min="0"
                     value="${isEdit ? plan.price : '0.00'}"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="49.90">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea id="planDescription" rows="2"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Breve descrição do plano">${isEdit ? (plan.description || '') : ''}</textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Duração (dias) *</label>
              <input type="number" id="planDuration" required min="1"
                     value="${isEdit ? plan.duration_days : '30'}"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="30">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Ordem de Exibição</label>
              <input type="number" id="planOrder" min="0"
                     value="${isEdit ? plan.display_order : '0'}"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Recursos (um por linha)</label>
            <textarea id="planFeatures" rows="4"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Acesso a todos os cursos&#10;Certificados&#10;Suporte prioritário">${features.join('\n')}</textarea>
            <p class="text-xs text-gray-500 mt-1">Digite um recurso por linha</p>
          </div>
          
          <div class="flex gap-4">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" id="planIsActive" ${isEdit && plan.is_active ? 'checked' : (!isEdit ? 'checked' : '')}
                     class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-2 text-sm font-semibold text-gray-700">
                <i class="fas fa-check-circle mr-1 text-green-600"></i>Plano Ativo
              </span>
            </label>
            
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" id="planIsFreeTrial" ${isEdit && plan.is_free_trial ? 'checked' : ''}
                     class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-2 text-sm font-semibold text-gray-700">
                <i class="fas fa-gift mr-1 text-blue-600"></i>Plano de Teste Grátis
              </span>
            </label>
          </div>
          
          <div class="flex items-center gap-3 pt-4">
            <button type="submit" 
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-save mr-2"></i>Salvar
            </button>
            <button type="button" onclick="adminUI.switchTab('plans')"
                    class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-times mr-2"></i>Cancelar
            </button>
          </div>
        </form>
      </div>
    `
  },
  
  async savePlan(event, planId) {
    event.preventDefault()
    
    const featuresText = document.getElementById('planFeatures').value
    const features = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim())
    
    const data = {
      name: document.getElementById('planName').value,
      description: document.getElementById('planDescription').value,
      price: parseFloat(document.getElementById('planPrice').value),
      duration_days: parseInt(document.getElementById('planDuration').value),
      display_order: parseInt(document.getElementById('planOrder').value),
      is_active: document.getElementById('planIsActive').checked,
      is_free_trial: document.getElementById('planIsFreeTrial').checked,
      features: features
    }
    
    try {
      if (planId) {
        await adminManager.updatePlan(planId, data)
        alert('✅ Plano atualizado com sucesso!')
      } else {
        await adminManager.createPlan(data)
        alert('✅ Plano criado com sucesso!')
      }
      await this.loadData()
      this.switchTab('plans')
    } catch (error) {
      console.error('Error saving plan:', error)
      alert('❌ Erro ao salvar plano: ' + (error.response?.data?.error || error.message))
    }
  },
  
  async deletePlan(id, name) {
    if (!confirm(`Tem certeza que deseja excluir o plano "${name}"?\n\nISSO NÃO PODE SER DESFEITO!`)) {
      return
    }
    
    try {
      await adminManager.deletePlan(id)
      alert('✅ Plano excluído com sucesso!')
      await this.loadData()
      this.switchTab('plans')
    } catch (error) {
      console.error('Error deleting plan:', error)
      alert('❌ Erro ao excluir plano: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // ==================== SUBSCRIPTIONS TAB ====================
  
  async renderSubscriptionsTab() {
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-id-card mr-2"></i>
            Histórico de Assinaturas (Membros)
          </h2>
          <button onclick="csvImport.showMemberImportModal()" 
                  class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
            <i class="fas fa-file-upload mr-2"></i>
            Importar CSV de Membros
          </button>
        </div>
        
        <div id="subscriptionsTableContainer">
          <p class="text-center text-gray-500 py-8">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Carregando assinaturas...
          </p>
        </div>
      </div>
    `
    
    await this.loadSubscriptionsTable()
  },
  
  async loadSubscriptionsTable(filters = {}) {
    try {
      const response = await axios.get('/api/admin/member-subscriptions')
      let subscriptions = response.data.subscriptions || []
      
      const container = document.getElementById('subscriptionsTableContainer')
      
      if (subscriptions.length === 0) {
        container.innerHTML = `
          <p class="text-center text-gray-500 py-8">
            Nenhuma assinatura cadastrada. Importe o CSV de membros para começar.
          </p>
        `
        return
      }
      
      // Store original data
      this.allSubscriptions = subscriptions
      
      // Separate active and expired (before filtering)
      const now = new Date()
      const active = subscriptions.filter(s => s.ativo && (!s.data_expiracao || new Date(s.data_expiracao) > now))
      const expired = subscriptions.filter(s => !s.ativo || (s.data_expiracao && new Date(s.data_expiracao) <= now))
      
      // Get unique origins for filter dropdown
      const origins = [...new Set(subscriptions.map(s => s.origem).filter(Boolean))].sort()
      
      // Apply filters
      if (filters.status) {
        if (filters.status === 'active') {
          subscriptions = active
        } else if (filters.status === 'expired') {
          subscriptions = expired
        } else if (filters.status === 'free_trial') {
          subscriptions = subscriptions.filter(s => s.teste_gratis)
        }
      }
      
      if (filters.origem && filters.origem !== 'all') {
        subscriptions = subscriptions.filter(s => s.origem === filters.origem)
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        subscriptions = subscriptions.filter(s => 
          s.email_membro?.toLowerCase().includes(searchLower) ||
          s.detalhe?.toLowerCase().includes(searchLower)
        )
      }
      
      container.innerHTML = `
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" 
               onclick="adminUI.filterSubscriptions({status: null})">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-700 font-semibold">Total</p>
                <p class="text-2xl font-bold text-blue-800">${this.allSubscriptions.length}</p>
              </div>
              <i class="fas fa-list text-3xl text-blue-600"></i>
            </div>
          </div>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" 
               onclick="adminUI.filterSubscriptions({status: 'active'})">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-700 font-semibold">Ativas</p>
                <p class="text-2xl font-bold text-green-800">${active.length}</p>
              </div>
              <i class="fas fa-check-circle text-3xl text-green-600"></i>
            </div>
          </div>
          
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" 
               onclick="adminUI.filterSubscriptions({status: 'expired'})">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-red-700 font-semibold">Expiradas</p>
                <p class="text-2xl font-bold text-red-800">${expired.length}</p>
              </div>
              <i class="fas fa-times-circle text-3xl text-red-600"></i>
            </div>
          </div>
          
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" 
               onclick="adminUI.filterSubscriptions({status: 'free_trial'})">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-purple-700 font-semibold">Teste Grátis</p>
                <p class="text-2xl font-bold text-purple-800">${this.allSubscriptions.filter(s => s.teste_gratis).length}</p>
              </div>
              <i class="fas fa-gift text-3xl text-purple-600"></i>
            </div>
          </div>
        </div>
        
        <!-- Filters -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                <i class="fas fa-search mr-1"></i> Buscar
              </label>
              <input type="text" 
                     id="subscriptionSearch" 
                     placeholder="Email ou detalhes..."
                     value="${filters.search || ''}"
                     onkeyup="adminUI.handleSubscriptionSearch(event)"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="min-w-[180px]">
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                <i class="fas fa-filter mr-1"></i> Origem
              </label>
              <select id="subscriptionOriginFilter" 
                      onchange="adminUI.handleOriginFilter(event)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all" ${!filters.origem || filters.origem === 'all' ? 'selected' : ''}>Todas as origens</option>
                ${origins.map(origem => `
                  <option value="${origem}" ${filters.origem === origem ? 'selected' : ''}>${origem}</option>
                `).join('')}
              </select>
            </div>
            
            <div class="min-w-[150px]">
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                <i class="fas fa-toggle-on mr-1"></i> Status
              </label>
              <select id="subscriptionStatusFilter" 
                      onchange="adminUI.handleStatusFilter(event)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" ${!filters.status ? 'selected' : ''}>Todos</option>
                <option value="active" ${filters.status === 'active' ? 'selected' : ''}>Ativas</option>
                <option value="expired" ${filters.status === 'expired' ? 'selected' : ''}>Expiradas</option>
                <option value="free_trial" ${filters.status === 'free_trial' ? 'selected' : ''}>Teste Grátis</option>
              </select>
            </div>
            
            <div class="flex items-end">
              <button onclick="adminUI.clearSubscriptionFilters()" 
                      class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                <i class="fas fa-times mr-1"></i> Limpar
              </button>
            </div>
          </div>
        </div>
        
        <div class="mb-4 text-sm text-gray-600">
          <i class="fas fa-info-circle mr-1"></i>
          Exibindo <strong>${subscriptions.length}</strong> de <strong>${this.allSubscriptions.length}</strong> assinaturas
          ${filters.status || filters.origem || filters.search ? 
            '<span class="ml-2 text-blue-600 font-semibold">(filtrado)</span>' : ''}
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiração</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhe</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${subscriptions.map(sub => {
                const expirationDate = sub.data_expiracao ? new Date(sub.data_expiracao) : null
                const isExpired = expirationDate && expirationDate <= now
                const isActive = sub.ativo && !isExpired
                
                return `
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <i class="fas fa-user-circle text-2xl text-gray-400 mr-2"></i>
                        <div>
                          <div class="text-sm font-medium text-gray-900">${sub.email_membro}</div>
                          ${sub.teste_gratis ? '<span class="text-xs bg-purple-500 text-white px-2 py-1 rounded">Teste Grátis</span>' : ''}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${expirationDate ? `
                        <div>
                          <div class="${isExpired ? 'text-red-600 font-semibold' : 'text-gray-900'}">${expirationDate.toLocaleDateString('pt-BR')}</div>
                          <div class="text-xs text-gray-500">${expirationDate.toLocaleTimeString('pt-BR')}</div>
                        </div>
                      ` : '<span class="text-gray-400">Sem data</span>'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${sub.origem ? `
                        <span class="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">${sub.origem}</span>
                      ` : '<span class="text-gray-400">-</span>'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      ${isActive ? `
                        <span class="px-2 py-1 text-xs bg-green-500 text-white rounded font-semibold">
                          <i class="fas fa-check-circle mr-1"></i>ATIVA
                        </span>
                      ` : `
                        <span class="px-2 py-1 text-xs bg-red-500 text-white rounded font-semibold">
                          <i class="fas fa-ban mr-1"></i>EXPIRADA
                        </span>
                      `}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      ${sub.detalhe || '<span class="text-gray-400">-</span>'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onclick="adminUI.deleteSubscription(${sub.id}, '${sub.email_membro}')"
                              class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>
      `
    } catch (error) {
      console.error('Error loading subscriptions:', error)
      const container = document.getElementById('subscriptionsTableContainer')
      container.innerHTML = `
        <p class="text-center text-red-500 py-8">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Erro ao carregar assinaturas
        </p>
      `
    }
  },
  
  async deleteSubscription(id, email) {
    if (!confirm(`Tem certeza que deseja deletar a assinatura de "${email}"?`)) {
      return
    }
    
    try {
      await axios.delete(`/api/admin/member-subscriptions/${id}`)
      alert('✅ Assinatura deletada com sucesso!')
      
      // Preserve current filters
      const filters = this.getCurrentSubscriptionFilters()
      await this.loadSubscriptionsTable(filters)
    } catch (error) {
      console.error('Error deleting subscription:', error)
      alert('❌ Erro ao deletar assinatura: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // Filter helper functions
  getCurrentSubscriptionFilters() {
    return {
      search: document.getElementById('subscriptionSearch')?.value || '',
      origem: document.getElementById('subscriptionOriginFilter')?.value || 'all',
      status: document.getElementById('subscriptionStatusFilter')?.value || ''
    }
  },
  
  filterSubscriptions(filters) {
    this.loadSubscriptionsTable(filters)
  },
  
  handleSubscriptionSearch(event) {
    if (event.key === 'Enter' || event.type === 'keyup') {
      const filters = this.getCurrentSubscriptionFilters()
      this.loadSubscriptionsTable(filters)
    }
  },
  
  handleOriginFilter(event) {
    const filters = this.getCurrentSubscriptionFilters()
    this.loadSubscriptionsTable(filters)
  },
  
  handleStatusFilter(event) {
    const filters = this.getCurrentSubscriptionFilters()
    this.loadSubscriptionsTable(filters)
  },
  
  clearSubscriptionFilters() {
    document.getElementById('subscriptionSearch').value = ''
    document.getElementById('subscriptionOriginFilter').value = 'all'
    document.getElementById('subscriptionStatusFilter').value = ''
    this.loadSubscriptionsTable({})
  },
  
  // OLD FUNCTIONS - Keep for compatibility but update later
  renderOldSubscriptionsTab_DEPRECATED() {
    const content = document.getElementById('adminContent')
    
    // Group subscriptions by status
    const activeSubscriptions = this.subscriptions.filter(s => s.status === 'active')
    const expiredSubscriptions = this.subscriptions.filter(s => s.status === 'expired')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-800">
              <i class="fas fa-users mr-2"></i>Assinaturas de Usuários
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              Gerencie as assinaturas ativas e histó rico
            </p>
          </div>
          <div class="flex gap-2">
            <button onclick="adminUI.expireAllSubscriptions()" 
                    class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-sync mr-2"></i>Expirar Vencidas
            </button>
            <button onclick="adminUI.showSubscriptionForm()" 
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-plus mr-2"></i>Nova Assinatura
            </button>
          </div>
        </div>
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-700 font-semibold">Assinaturas Ativas</p>
                <p class="text-2xl font-bold text-green-800">${activeSubscriptions.length}</p>
              </div>
              <i class="fas fa-check-circle text-3xl text-green-600"></i>
            </div>
          </div>
          
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-red-700 font-semibold">Assinaturas Expiradas</p>
                <p class="text-2xl font-bold text-red-800">${expiredSubscriptions.length}</p>
              </div>
              <i class="fas fa-times-circle text-3xl text-red-600"></i>
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-700 font-semibold">Total de Assinaturas</p>
                <p class="text-2xl font-bold text-blue-800">${this.subscriptions.length}</p>
              </div>
              <i class="fas fa-list text-3xl text-blue-600"></i>
            </div>
          </div>
        </div>
        
        <!-- Active Subscriptions -->
        <div class="mb-6">
          <h4 class="text-lg font-bold text-gray-800 mb-3">
            <i class="fas fa-check-circle text-green-600 mr-2"></i>Assinaturas Ativas
          </h4>
          <div class="space-y-2">
            ${activeSubscriptions.map(sub => {
              const plan = this.plans.find(p => p.id === sub.plan_id)
              const endDate = new Date(sub.end_date)
              const daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
              
              return `
                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3">
                        <i class="fas fa-user-circle text-2xl text-blue-600"></i>
                        <div>
                          <p class="font-bold text-gray-800">${sub.user_email}</p>
                          <p class="text-sm text-gray-600">
                            <span class="font-semibold">${plan ? plan.name : 'Plano não encontrado'}</span>
                            ${plan && plan.is_free_trial ? '<span class="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">GRÁTIS</span>' : ''}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span><i class="fas fa-calendar-check mr-1"></i>Início: ${new Date(sub.start_date).toLocaleDateString('pt-BR')}</span>
                        <span><i class="fas fa-calendar-times mr-1"></i>Término: ${endDate.toLocaleDateString('pt-BR')}</span>
                        <span class="${daysRemaining <= 7 ? 'text-orange-600 font-bold' : 'text-green-600'}">
                          <i class="fas fa-clock mr-1"></i>${daysRemaining} dias restantes
                        </span>
                      </div>
                    </div>
                    <button onclick="adminUI.expireSubscription(${sub.id}, '${sub.user_email}')" 
                            class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                      <i class="fas fa-ban mr-1"></i>Expirar
                    </button>
                  </div>
                </div>
              `
            }).join('')}
            
            ${activeSubscriptions.length === 0 ? '<p class="text-center text-gray-500 py-4">Nenhuma assinatura ativa</p>' : ''}
          </div>
        </div>
        
        <!-- Expired Subscriptions -->
        ${expiredSubscriptions.length > 0 ? `
          <div>
            <h4 class="text-lg font-bold text-gray-800 mb-3">
              <i class="fas fa-times-circle text-red-600 mr-2"></i>Assinaturas Expiradas
            </h4>
            <div class="space-y-2 max-h-96 overflow-y-auto">
              ${expiredSubscriptions.map(sub => {
                const plan = this.plans.find(p => p.id === sub.plan_id)
                
                return `
                  <div class="border border-gray-200 bg-gray-50 rounded-lg p-3 opacity-75">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-3">
                          <i class="fas fa-user-circle text-xl text-gray-400"></i>
                          <div>
                            <p class="font-semibold text-gray-700">${sub.user_email}</p>
                            <p class="text-xs text-gray-600">
                              ${plan ? plan.name : 'Plano não encontrado'} - 
                              Expirou em ${new Date(sub.end_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span class="text-xs text-red-600 font-semibold">
                        <i class="fas fa-ban mr-1"></i>EXPIRADA
                      </span>
                    </div>
                  </div>
                `
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `
  },
  
  showSubscriptionForm() {
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">
          <i class="fas fa-plus mr-2"></i>Nova Assinatura
        </h3>
        
        <form onsubmit="adminUI.saveSubscription(event)" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email do Usuário *</label>
            <input type="email" id="subUserEmail" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="usuario@exemplo.com">
            <p class="text-xs text-gray-500 mt-1">Digite o email do usuário que receberá a assinatura</p>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Plano *</label>
            <select id="subPlanId" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione um plano</option>
              ${this.plans.filter(p => p.is_active).map(plan => `
                <option value="${plan.id}" data-duration="${plan.duration_days}">
                  ${plan.name} - R$ ${parseFloat(plan.price).toFixed(2)} (${plan.duration_days} dias)
                </option>
              `).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Duração (dias)</label>
            <input type="number" id="subDuration" min="1"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Deixe vazio para usar a duração padrão do plano">
            <p class="text-xs text-gray-500 mt-1">Opcional: personalize a duração (sobrescreve a duração do plano)</p>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">
              <i class="fas fa-info-circle mr-2"></i>
              A assinatura iniciará <strong>imediatamente</strong> e terminará após o número de dias especificado.
            </p>
          </div>
          
          <div class="flex items-center gap-3 pt-4">
            <button type="submit" 
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-save mr-2"></i>Criar Assinatura
            </button>
            <button type="button" onclick="adminUI.switchTab('subscriptions')"
                    class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-times mr-2"></i>Cancelar
            </button>
          </div>
        </form>
      </div>
    `
  },
  
  async saveSubscription(event) {
    event.preventDefault()
    
    const data = {
      user_email: document.getElementById('subUserEmail').value,
      plan_id: parseInt(document.getElementById('subPlanId').value),
      duration_days: document.getElementById('subDuration').value ? 
        parseInt(document.getElementById('subDuration').value) : null
    }
    
    try {
      await adminManager.createSubscription(data)
      alert('✅ Assinatura criada com sucesso!')
      await this.loadData()
      this.switchTab('subscriptions')
    } catch (error) {
      console.error('Error creating subscription:', error)
      alert('❌ Erro ao criar assinatura: ' + (error.response?.data?.error || error.message))
    }
  },
  
  async expireSubscription(id, userEmail) {
    if (!confirm(`Tem certeza que deseja expirar a assinatura de "${userEmail}"?`)) {
      return
    }
    
    try {
      await adminManager.expireSubscription(id)
      alert('✅ Assinatura expirada com sucesso!')
      await this.loadData()
      this.switchTab('subscriptions')
    } catch (error) {
      console.error('Error expiring subscription:', error)
      alert('❌ Erro ao expirar assinatura: ' + (error.response?.data?.error || error.message))
    }
  },
  
  async expireAllSubscriptions() {
    if (!confirm('Tem certeza que deseja expirar TODAS as assinaturas vencidas?')) {
      return
    }
    
    try {
      const result = await adminManager.expireAllSubscriptions()
      alert(`✅ ${result.expiredCount || 0} assinatura(s) expirada(s) com sucesso!`)
      await this.loadData()
      this.switchTab('subscriptions')
    } catch (error) {
      console.error('Error expiring subscriptions:', error)
      alert('❌ Erro ao expirar assinaturas: ' + (error.response?.data?.error || error.message))
    }
  },
  
  // ==================== USERS TAB ====================
  
  async renderUsersTab() {
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-user-friends mr-2"></i>
            Gerenciar Usuários
          </h2>
          <button onclick="csvImport.showUserImportModal()" 
                  class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
            <i class="fas fa-file-upload mr-2"></i>
            Importar CSV
          </button>
        </div>
        
        <div id="usersTableContainer">
          <p class="text-center text-gray-500 py-8">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Carregando usuários...
          </p>
        </div>
      </div>
    `
    
    await this.loadUsersTable()
  },
  
  async loadUsersTable() {
    try {
      const response = await axios.get('/api/admin/users')
      const users = response.data.users || []
      
      const container = document.getElementById('usersTableContainer')
      
      if (users.length === 0) {
        container.innerHTML = `
          <p class="text-center text-gray-500 py-8">
            Nenhum usuário cadastrado. Importe um arquivo CSV para começar.
          </p>
        `
        return
      }
      
      container.innerHTML = `
        <div class="mb-4 text-sm text-gray-600">
          <i class="fas fa-info-circle mr-1"></i>
          Total de usuários: <strong>${users.length}</strong>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiração</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${users.map(user => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      ${user.foto ? `
                        <img src="${user.foto}" alt="${user.nome || 'User'}" class="h-8 w-8 rounded-full object-cover mr-3">
                      ` : `
                        <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                          <i class="fas fa-user text-gray-600 text-sm"></i>
                        </div>
                      `}
                      <div>
                        <div class="text-sm font-medium text-gray-900">${user.nome || user.first_name || 'Sem nome'}</div>
                        ${user.telefone ? `<div class="text-xs text-gray-500">${user.telefone}</div>` : ''}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.cpf || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      ${user.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${user.dt_expiracao ? new Date(user.dt_expiracao).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="adminUI.editUser(${user.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="adminUI.deleteUser(${user.id})" class="text-red-600 hover:text-red-900">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
    } catch (error) {
      console.error('Error loading users:', error)
      const container = document.getElementById('usersTableContainer')
      container.innerHTML = `
        <p class="text-center text-red-500 py-8">
          <i class="fas fa-exclamation-circle mr-2"></i>
          Erro ao carregar usuários
        </p>
      `
    }
  },
  
  async editUser(userId) {
    alert('Funcionalidade de edição será implementada em breve')
  },
  
  async deleteUser(userId) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return
    
    try {
      await axios.delete(`/api/admin/users/${userId}`)
      alert('✅ Usuário excluído com sucesso!')
      this.loadUsersTable()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('❌ Erro ao excluir usuário')
    }
  },
  
  // ==================== CERTIFICATES TAB ====================
  
  async renderCertificatesTab() {
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-certificate mr-2"></i>
            Certificados Emitidos
          </h2>
          <button onclick="csvImport.showCertificateImportModal()" 
                  class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
            <i class="fas fa-file-upload mr-2"></i>
            Importar CSV de Certificados
          </button>
        </div>
        
        <div id="certificatesTableContainer">
          <p class="text-center text-gray-500 py-8">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Carregando certificados...
          </p>
        </div>
      </div>
    `
    
    await this.loadCertificatesTable()
  },
  
  async loadCertificatesTable(filters = {}) {
    try {
      const response = await axios.get('/api/admin/certificates')
      let certificates = response.data.certificates || []
      
      const container = document.getElementById('certificatesTableContainer')
      
      if (certificates.length === 0) {
        container.innerHTML = `
          <p class="text-center text-gray-500 py-8">
            Nenhum certificado cadastrado. Importe o CSV para começar.
          </p>
        `
        return
      }
      
      // Store original data
      this.allCertificates = certificates
      
      // Get unique courses for filter
      const courses = [...new Set(certificates.map(c => c.course_title).filter(Boolean))].sort()
      
      // Apply filters
      if (filters.course && filters.course !== 'all') {
        certificates = certificates.filter(c => c.course_title === filters.course)
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        certificates = certificates.filter(c => 
          c.user_email?.toLowerCase().includes(searchLower) ||
          c.user_name?.toLowerCase().includes(searchLower) ||
          c.course_title?.toLowerCase().includes(searchLower)
        )
      }
      
      container.innerHTML = `
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-700 font-semibold">Total de Certificados</p>
                <p class="text-2xl font-bold text-blue-800">${this.allCertificates.length}</p>
              </div>
              <i class="fas fa-certificate text-3xl text-blue-600"></i>
            </div>
          </div>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-700 font-semibold">Alunos Certificados</p>
                <p class="text-2xl font-bold text-green-800">${[...new Set(this.allCertificates.map(c => c.user_email))].length}</p>
              </div>
              <i class="fas fa-users text-3xl text-green-600"></i>
            </div>
          </div>
          
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-purple-700 font-semibold">Cursos Diferentes</p>
                <p class="text-2xl font-bold text-purple-800">${courses.length}</p>
              </div>
              <i class="fas fa-book text-3xl text-purple-600"></i>
            </div>
          </div>
        </div>
        
        <!-- Filters -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                <i class="fas fa-search mr-1"></i> Buscar
              </label>
              <input type="text" 
                     id="certificateSearch" 
                     placeholder="Email, nome ou curso..."
                     value="${filters.search || ''}"
                     onkeyup="adminUI.handleCertificateSearch(event)"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="min-w-[200px]">
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                <i class="fas fa-book mr-1"></i> Curso
              </label>
              <select id="certificateCourseFilter" 
                      onchange="adminUI.handleCertificateCourseFilter(event)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all" ${!filters.course || filters.course === 'all' ? 'selected' : ''}>Todos os cursos</option>
                ${courses.map(course => `
                  <option value="${course}" ${filters.course === course ? 'selected' : ''}>${course}</option>
                `).join('')}
              </select>
            </div>
            
            <div class="flex items-end">
              <button onclick="adminUI.clearCertificateFilters()" 
                      class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                <i class="fas fa-times mr-1"></i> Limpar
              </button>
            </div>
          </div>
        </div>
        
        <div class="mb-4 text-sm text-gray-600">
          <i class="fas fa-info-circle mr-1"></i>
          Exibindo <strong>${certificates.length}</strong> de <strong>${this.allCertificates.length}</strong> certificados
          ${filters.course || filters.search ? 
            '<span class="ml-2 text-blue-600 font-semibold">(filtrado)</span>' : ''}
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga Horária</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Verificação</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emitido em</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${certificates.map(cert => {
                const verificationUrl = cert.verification_code ? 
                  \`\${window.location.origin}/verificar/\${cert.verification_code}\` : null;
                
                return \`
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <i class="fas fa-user-circle text-2xl text-gray-400 mr-3"></i>
                      <div>
                        <div class="text-sm font-medium text-gray-900">\${cert.user_name || 'Sem nome'}</div>
                        <div class="text-xs text-gray-500">\${cert.user_email}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                      \${cert.course_title}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    \${cert.carga_horaria ? \`\${cert.carga_horaria}h\` : '<span class="text-gray-400">N/A</span>'}
                  </td>
                  <td class="px-6 py-4">
                    \${cert.verification_code ? \`
                      <div class="text-xs font-mono text-gray-700 mb-1">\${cert.verification_code}</div>
                      <a href="\${verificationUrl}" target="_blank" 
                         class="text-blue-600 hover:underline text-xs flex items-center gap-1">
                        <i class="fas fa-external-link-alt"></i> Verificar
                      </a>
                    \` : '<span class="text-gray-400 text-xs">Sem código</span>'}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    \${cert.created_at ? new Date(cert.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    \${cert.verification_code ? \`
                      <button onclick="adminUI.viewCertificate(\${cert.id})" 
                              title="Visualizar Certificado"
                              class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-eye"></i>
                      </button>
                    \` : ''}
                    <button onclick="adminUI.deleteCertificate(\${cert.id}, '\${cert.user_email}', '\${cert.course_title}')"
                            title="Deletar Certificado"
                            class="text-red-600 hover:text-red-900">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              \`}).join('')}
            </tbody>
          </table>
        </div>
      `
    } catch (error) {
      console.error('Error loading certificates:', error)
      const container = document.getElementById('certificatesTableContainer')
      container.innerHTML = `
        <p class="text-center text-red-500 py-8">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Erro ao carregar certificados
        </p>
      `
    }
  },
  
  viewCertificate(certId) {
    const url = `/api/certificates/${certId}/html`
    window.open(url, '_blank')
  },
  
  async deleteCertificate(id, email, course) {
    if (!confirm(`Tem certeza que deseja deletar o certificado de "${email}" para o curso "${course}"?`)) {
      return
    }
    
    try {
      await axios.delete(`/api/admin/certificates/${id}`)
      alert('✅ Certificado deletado com sucesso!')
      
      const filters = this.getCurrentCertificateFilters()
      await this.loadCertificatesTable(filters)
    } catch (error) {
      console.error('Error deleting certificate:', error)
      alert('❌ Erro ao deletar certificado: ' + (error.response?.data?.error || error.message))
    }
  },
  
  getCurrentCertificateFilters() {
    return {
      search: document.getElementById('certificateSearch')?.value || '',
      course: document.getElementById('certificateCourseFilter')?.value || 'all'
    }
  },
  
  handleCertificateSearch(event) {
    if (event.key === 'Enter' || event.type === 'keyup') {
      const filters = this.getCurrentCertificateFilters()
      this.loadCertificatesTable(filters)
    }
  },
  
  handleCertificateCourseFilter(event) {
    const filters = this.getCurrentCertificateFilters()
    this.loadCertificatesTable(filters)
  },
  
  clearCertificateFilters() {
    document.getElementById('certificateSearch').value = ''
    document.getElementById('certificateCourseFilter').value = 'all'
    this.loadCertificatesTable({})
  },
  
  // ==================== IMPORT TAB ====================
  
  renderImportTab() {
    const content = document.getElementById('adminContent')
    
    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-800 mb-2">
            <i class="fas fa-file-import text-blue-600 mr-2"></i>
            Importar Cursos Completos
          </h3>
          <p class="text-sm text-gray-600">
            Importe cursos, módulos e aulas de forma rápida usando arquivo CSV
          </p>
        </div>
        
        <!-- CSV Format Instructions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 class="font-bold text-blue-800 mb-2">
            <i class="fas fa-info-circle mr-1"></i>
            Formato do Arquivo CSV
          </h4>
          <p class="text-sm text-blue-700 mb-3">
            O arquivo CSV deve conter as seguintes colunas (nesta ordem):
          </p>
          <div class="bg-white rounded p-3 font-mono text-xs overflow-x-auto mb-3">
            <code class="text-gray-800">
              tipo,curso_titulo,curso_descricao,curso_instrutor,curso_duracao_horas,modulo_titulo,modulo_descricao,aula_titulo,aula_descricao,aula_video_provider,aula_video_id,aula_duracao_minutos,aula_ordem,aula_teste_gratis
            </code>
          </div>
          
          <div class="space-y-2 text-sm text-gray-700">
            <p><strong>tipo:</strong> "curso", "modulo" ou "aula"</p>
            <p><strong>aula_video_provider:</strong> "youtube", "vimeo" ou "url"</p>
            <p><strong>aula_teste_gratis:</strong> "sim" ou "nao"</p>
            <p><strong>Campos vazios:</strong> Use células vazias para campos não aplicáveis</p>
          </div>
        </div>
        
        <!-- Example CSV -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 class="font-bold text-yellow-800 mb-2">
            <i class="fas fa-lightbulb mr-1"></i>
            Exemplo de CSV
          </h4>
          <div class="bg-white rounded p-3 font-mono text-xs overflow-x-auto">
            <pre class="text-gray-800">tipo,curso_titulo,curso_descricao,curso_instrutor,curso_duracao_horas,modulo_titulo,modulo_descricao,aula_titulo,aula_descricao,aula_video_provider,aula_video_id,aula_duracao_minutos,aula_ordem,aula_teste_gratis
curso,Cálculos Trabalhistas Básico,Aprenda os fundamentos,João Silva,20,,,,,,,,
modulo,,,,,Módulo 1: Introdução,Conceitos básicos,,,,,,,
aula,,,,,,,Aula 1: O que é CLT,Introdução à CLT,youtube,dQw4w9WgXcQ,15,1,sim
aula,,,,,,,Aula 2: Conceitos iniciais,Conceitos fundamentais,youtube,dQw4w9WgXcQ,20,2,nao</pre>
          </div>
        </div>
        
        <!-- Download Template -->
        <div class="mb-6">
          <button onclick="adminUI.downloadCSVTemplate()" 
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
            <i class="fas fa-download mr-2"></i>
            Baixar Modelo CSV
          </button>
        </div>
        
        <!-- File Upload -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <input type="file" 
                 id="csvFileInput" 
                 accept=".csv"
                 class="hidden" 
                 onchange="adminUI.handleCSVFileSelect(event)">
          <button onclick="document.getElementById('csvFileInput').click()"
                  class="w-full px-6 py-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors">
            <i class="fas fa-cloud-upload-alt text-2xl mr-3"></i>
            <span class="text-lg">Selecionar Arquivo CSV</span>
          </button>
          <p class="text-center text-sm text-gray-500 mt-3">
            Clique para selecionar um arquivo CSV do seu computador
          </p>
        </div>
        
        <!-- Preview Area -->
        <div id="csvPreviewArea" class="hidden">
          <h4 class="font-bold text-gray-800 mb-3">
            <i class="fas fa-eye mr-2"></i>
            Preview dos Dados
          </h4>
          <div id="csvPreviewContent" class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-96 overflow-auto">
            <!-- Preview will be inserted here -->
          </div>
          <div class="flex gap-3">
            <button onclick="adminUI.importCSVData()" 
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-check mr-2"></i>
              Confirmar Importação
            </button>
            <button onclick="adminUI.cancelCSVImport()" 
                    class="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors">
              <i class="fas fa-times mr-2"></i>
              Cancelar
            </button>
          </div>
        </div>
        
        <!-- Import Progress -->
        <div id="importProgress" class="hidden">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-3">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Importando...
            </h4>
            <div class="space-y-2" id="importLog">
              <!-- Import log will be inserted here -->
            </div>
          </div>
        </div>
      </div>
    `
  },
  
  downloadCSVTemplate() {
    const template = `tipo,curso_titulo,curso_descricao,curso_instrutor,curso_duracao_horas,modulo_titulo,modulo_descricao,aula_titulo,aula_descricao,aula_video_provider,aula_video_id,aula_duracao_minutos,aula_ordem,aula_teste_gratis
curso,Cálculos Trabalhistas Básico,Aprenda os fundamentos dos cálculos,João Silva,20,,,,,,,,
modulo,,,,,Módulo 1: Introdução,Conceitos básicos e fundamentais,,,,,,,
aula,,,,,,,Aula 1: O que é CLT,Introdução à Consolidação das Leis do Trabalho,youtube,dQw4w9WgXcQ,15,1,sim
aula,,,,,,,Aula 2: Conceitos iniciais,Conceitos fundamentais do direito trabalhista,youtube,dQw4w9WgXcQ,20,2,nao
modulo,,,,,Módulo 2: Cálculos Básicos,Aprenda cálculos essenciais,,,,,,,
aula,,,,,,,Aula 3: Horas Extras,Como calcular horas extras,youtube,dQw4w9WgXcQ,25,1,nao
curso,Cálculos Trabalhistas Avançado,Cálculos complexos e avançados,Maria Santos,30,,,,,,,,
modulo,,,,,Módulo 1: Verbas Rescisórias,Cálculo de rescisões,,,,,,,
aula,,,,,,,Aula 1: Aviso Prévio,Como calcular aviso prévio,youtube,dQw4w9WgXcQ,30,1,nao`

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_importacao_cursos.csv')
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },
  
  csvData: null,
  
  handleCSVFileSelect(event) {
    const file = event.target.files[0]
    if (!file) return
    
    if (!file.name.endsWith('.csv')) {
      alert('❌ Por favor, selecione um arquivo CSV')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target.result
        this.parseCSV(csvText)
      } catch (error) {
        console.error('Error reading CSV:', error)
        alert('❌ Erro ao ler arquivo CSV: ' + error.message)
      }
    }
    reader.readAsText(file, 'UTF-8')
  },
  
  parseCSV(csvText) {
    // Remove \r characters and split by \n
    const lines = csvText.replace(/\r/g, '').split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      alert('❌ Arquivo CSV vazio ou inválido')
      return
    }
    
    // Parse header
    const header = lines[0].split(',').map(h => h.trim())
    
    // Validate header
    const requiredColumns = ['tipo', 'curso_titulo', 'modulo_titulo', 'aula_titulo']
    const hasRequiredColumns = requiredColumns.some(col => header.includes(col))
    
    if (!hasRequiredColumns) {
      alert('❌ Formato de CSV inválido. Certifique-se de que o arquivo contém as colunas necessárias.')
      return
    }
    
    // Parse data
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const values = this.parseCSVLine(line)
      
      if (values.length !== header.length) {
        console.warn(`Linha ${i + 1} ignorada: número de colunas não coincide`)
        continue
      }
      
      const row = {}
      header.forEach((col, idx) => {
        row[col] = values[idx]
      })
      
      data.push(row)
    }
    
    this.csvData = data
    this.showCSVPreview(data)
  },
  
  parseCSVLine(line) {
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    values.push(current.trim())
    return values
  },
  
  showCSVPreview(data) {
    const previewArea = document.getElementById('csvPreviewArea')
    const previewContent = document.getElementById('csvPreviewContent')
    
    // Count items
    const courses = data.filter(row => row.tipo === 'curso')
    const modules = data.filter(row => row.tipo === 'modulo')
    const lessons = data.filter(row => row.tipo === 'aula')
    
    let html = `
      <div class="mb-4 p-4 bg-white rounded-lg border border-gray-200">
        <h5 class="font-bold text-gray-800 mb-3">Resumo da Importação:</h5>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-3 bg-blue-50 rounded">
            <div class="text-3xl font-bold text-blue-600">${courses.length}</div>
            <div class="text-sm text-gray-600">Cursos</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded">
            <div class="text-3xl font-bold text-green-600">${modules.length}</div>
            <div class="text-sm text-gray-600">Módulos</div>
          </div>
          <div class="text-center p-3 bg-purple-50 rounded">
            <div class="text-3xl font-bold text-purple-600">${lessons.length}</div>
            <div class="text-sm text-gray-600">Aulas</div>
          </div>
        </div>
      </div>
      
      <div class="space-y-4">
    `
    
    // Group by course
    let currentCourse = null
    let currentModule = null
    
    data.forEach(row => {
      if (row.tipo === 'curso') {
        if (currentCourse) html += '</div></div>' // Close previous course
        currentCourse = row
        html += `
          <div class="border-2 border-blue-200 rounded-lg overflow-hidden">
            <div class="bg-blue-100 p-3">
              <h5 class="font-bold text-blue-800">
                <i class="fas fa-book mr-2"></i>
                ${row.curso_titulo}
              </h5>
              <p class="text-sm text-blue-600">${row.curso_instrutor} | ${row.curso_duracao_horas}h</p>
            </div>
            <div class="p-3 space-y-2">
        `
      } else if (row.tipo === 'modulo') {
        if (currentModule) html += '</div>' // Close previous module
        currentModule = row
        html += `
          <div class="border-l-4 border-green-400 pl-3 ml-3">
            <h6 class="font-semibold text-green-700">
              <i class="fas fa-folder mr-1"></i>
              ${row.modulo_titulo}
            </h6>
            <div class="ml-4 mt-2 space-y-1">
        `
      } else if (row.tipo === 'aula') {
        html += `
          <div class="text-sm text-gray-700 flex items-center gap-2">
            <i class="fas fa-play-circle text-purple-500"></i>
            <span>${row.aula_titulo}</span>
            <span class="text-xs text-gray-500">(${row.aula_duracao_minutos}min)</span>
            ${row.aula_teste_gratis === 'sim' ? '<span class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">GRÁTIS</span>' : ''}
          </div>
        `
      }
    })
    
    if (currentModule) html += '</div></div>' // Close last module
    if (currentCourse) html += '</div></div>' // Close last course
    
    html += '</div>'
    
    previewContent.innerHTML = html
    previewArea.classList.remove('hidden')
  },
  
  async importCSVData() {
    if (!this.csvData) {
      alert('❌ Nenhum dado para importar')
      return
    }
    
    const previewArea = document.getElementById('csvPreviewArea')
    const progressArea = document.getElementById('importProgress')
    const importLog = document.getElementById('importLog')
    
    previewArea.classList.add('hidden')
    progressArea.classList.remove('hidden')
    importLog.innerHTML = ''
    
    const log = (message, type = 'info') => {
      const colors = {
        info: 'text-blue-600',
        success: 'text-green-600',
        error: 'text-red-600'
      }
      importLog.innerHTML += `<div class="${colors[type]}">• ${message}</div>`
      importLog.scrollTop = importLog.scrollHeight
    }
    
    try {
      let currentCourseId = null
      let currentModuleId = null
      let coursesCreated = 0
      let coursesSkipped = 0
      let modulesCreated = 0
      let modulesSkipped = 0
      let lessonsCreated = 0
      let lessonsSkipped = 0
      
      for (const row of this.csvData) {
        if (row.tipo === 'curso') {
          log(`Verificando curso: ${row.curso_titulo}`, 'info')
          
          // Check if course already exists
          const existingCourse = await adminManager.findCourseByTitle(row.curso_titulo)
          
          if (existingCourse) {
            currentCourseId = existingCourse.id
            coursesSkipped++
            log(`⊙ Curso já existe (ID: ${currentCourseId}): ${row.curso_titulo}`, 'info')
          } else {
            const courseData = {
              title: row.curso_titulo,
              description: row.curso_descricao || '',
              instructor: row.curso_instrutor || 'Instrutor',
              duration_hours: parseInt(row.curso_duracao_horas) || 0
            }
            
            const result = await adminManager.createCourse(courseData)
            currentCourseId = result.course_id
            coursesCreated++
            
            log(`✓ Curso criado (ID: ${currentCourseId}): ${row.curso_titulo}`, 'success')
          }
          
        } else if (row.tipo === 'modulo') {
          if (!currentCourseId) {
            log(`✗ Erro: Módulo sem curso definido`, 'error')
            continue
          }
          
          log(`Verificando módulo: ${row.modulo_titulo}`, 'info')
          
          // Check if module already exists in this course
          const existingModule = await adminManager.findModuleByTitle(currentCourseId, row.modulo_titulo)
          
          if (existingModule) {
            currentModuleId = existingModule.id
            modulesSkipped++
            log(`⊙ Módulo já existe (ID: ${currentModuleId}): ${row.modulo_titulo}`, 'info')
          } else {
            const moduleData = {
              course_id: currentCourseId,
              title: row.modulo_titulo,
              description: row.modulo_descricao || '',
              order_index: modulesCreated
            }
            
            const result = await adminManager.createModule(moduleData)
            currentModuleId = result.module_id
            modulesCreated++
            
            log(`✓ Módulo criado (ID: ${currentModuleId}): ${row.modulo_titulo}`, 'success')
          }
          
        } else if (row.tipo === 'aula') {
          if (!currentModuleId) {
            log(`✗ Erro: Aula sem módulo definido`, 'error')
            continue
          }
          
          log(`Verificando aula: ${row.aula_titulo}`, 'info')
          
          // Check if lesson already exists in this module
          const existingLesson = await adminManager.findLessonByTitle(currentModuleId, row.aula_titulo)
          
          if (existingLesson) {
            lessonsSkipped++
            log(`⊙ Aula já existe (ID: ${existingLesson.id}): ${row.aula_titulo}`, 'info')
          } else {
            const lessonData = {
              module_id: currentModuleId,
              title: row.aula_titulo,
              description: row.aula_descricao || '',
              video_provider: row.aula_video_provider || 'youtube',
              video_id: row.aula_video_id || '',
              duration_minutes: parseInt(row.aula_duracao_minutos) || 0,
              order_index: parseInt(row.aula_ordem) || lessonsCreated,
              free_trial: row.aula_teste_gratis === 'sim'
            }
            
            await adminManager.createLesson(lessonData)
            lessonsCreated++
            
            log(`✓ Aula criada: ${row.aula_titulo}`, 'success')
          }
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      log('', 'info')
      log('========================================', 'info')
      log(`✅ Importação concluída com sucesso!`, 'success')
      log('', 'info')
      log(`📦 CRIADOS:`, 'success')
      log(`  • ${coursesCreated} cursos`, 'success')
      log(`  • ${modulesCreated} módulos`, 'success')
      log(`  • ${lessonsCreated} aulas`, 'success')
      log('', 'info')
      log(`⊙ PULADOS (já existiam):`, 'info')
      log(`  • ${coursesSkipped} cursos`, 'info')
      log(`  • ${modulesSkipped} módulos`, 'info')
      log(`  • ${lessonsSkipped} aulas`, 'info')
      
      setTimeout(async () => {
        await this.loadData()
        this.switchTab('courses')
        alert(`✅ Importação concluída!\n\n📦 CRIADOS:\n${coursesCreated} cursos\n${modulesCreated} módulos\n${lessonsCreated} aulas\n\n⊙ PULADOS:\n${coursesSkipped} cursos\n${modulesSkipped} módulos\n${lessonsSkipped} aulas`)
      }, 2000)
      
    } catch (error) {
      console.error('Import error:', error)
      
      // Try to extract more detailed error information
      let errorMessage = error.message || error.toString()
      
      if (error.response) {
        // Axios error with response
        errorMessage = error.response.data?.error || error.response.statusText || errorMessage
        log(`❌ Erro HTTP ${error.response.status}: ${errorMessage}`, 'error')
      } else if (error.request) {
        // Axios error without response
        log(`❌ Erro de rede: ${errorMessage}`, 'error')
      } else {
        log(`❌ Erro na importação: ${errorMessage}`, 'error')
      }
      
      alert(`❌ Erro durante a importação:\n\n${errorMessage}\n\nVerifique o log para mais detalhes.`)
    }
  },
  
  cancelCSVImport() {
    this.csvData = null
    document.getElementById('csvPreviewArea').classList.add('hidden')
    document.getElementById('csvFileInput').value = ''
  }
}

// ==================== CSV USER IMPORT ====================

const csvImport = {
  usersData: null,
  
  showUserImportModal() {
    const modal = document.createElement('div')
    modal.id = 'userImportModal'
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">
              <i class="fas fa-file-upload mr-2"></i>
              Importar Usuários via CSV
            </h2>
            <button onclick="csvImport.closeModal()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <!-- Upload Section -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Selecione o arquivo CSV
            </label>
            <input type="file" 
                   id="userCsvFileInput" 
                   accept=".csv"
                   onchange="csvImport.handleFileSelect(event)"
                   class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer">
            <p class="mt-2 text-xs text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>
              Formato: CSV com delimitador ponto e vírgula (;)
            </p>
          </div>
          
          <!-- Preview Area -->
          <div id="userCsvPreviewArea" class="hidden">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 class="font-semibold text-blue-900 mb-2">
                <i class="fas fa-eye mr-2"></i>
                Preview da Importação
              </h3>
              <div id="userCsvStats" class="text-sm text-blue-800"></div>
            </div>
            
            <div class="mb-4">
              <div id="userCsvPreviewContent" class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto text-sm"></div>
            </div>
            
            <div class="flex gap-3">
              <button onclick="csvImport.importUsers()" 
                      class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                <i class="fas fa-check mr-2"></i>
                Confirmar Importação
              </button>
              <button onclick="csvImport.cancel()" 
                      class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-colors">
                <i class="fas fa-times mr-2"></i>
                Cancelar
              </button>
            </div>
          </div>
          
          <!-- Progress Area -->
          <div id="userImportProgress" class="hidden">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 class="font-semibold text-green-900 mb-2">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Importando Usuários...
              </h3>
              <div id="userImportLog" class="text-sm text-green-800 max-h-96 overflow-y-auto font-mono"></div>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
  },
  
  closeModal() {
    const modal = document.getElementById('userImportModal')
    if (modal) modal.remove()
    this.usersData = null
  },
  
  handleFileSelect(event) {
    const file = event.target.files[0]
    if (!file) return
    
    if (!file.name.endsWith('.csv')) {
      alert('❌ Por favor, selecione um arquivo CSV')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target.result
        this.parseUserCSV(csvText)
      } catch (error) {
        console.error('Error reading CSV:', error)
        alert('❌ Erro ao ler arquivo CSV: ' + error.message)
      }
    }
    reader.readAsText(file, 'UTF-8')
  },
  
  parseUserCSV(csvText) {
    // Remove \r and split by lines
    const lines = csvText.replace(/\r/g, '').split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      alert('❌ Arquivo CSV vazio ou inválido')
      return
    }
    
    // Parse header
    const header = lines[0].split(';').map(h => h.trim())
    
    // Parse data
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const values = line.split(';').map(v => v.trim())
      
      if (values.length !== header.length) {
        console.warn(`Linha ${i + 1} ignorada: número de colunas não coincide`)
        continue
      }
      
      const row = {}
      header.forEach((col, idx) => {
        row[col] = values[idx]
      })
      
      // Skip empty emails
      if (!row.email || row.email === '') {
        continue
      }
      
      data.push(row)
    }
    
    this.usersData = data
    this.showUserPreview(data)
  },
  
  showUserPreview(data) {
    const previewArea = document.getElementById('userCsvPreviewArea')
    const statsDiv = document.getElementById('userCsvStats')
    const previewContent = document.getElementById('userCsvPreviewContent')
    
    statsDiv.innerHTML = `
      <p><strong>${data.length}</strong> usuários serão importados</p>
    `
    
    previewContent.innerHTML = `
      <div class="space-y-2">
        ${data.slice(0, 10).map((user, idx) => `
          <div class="flex items-center gap-3 p-2 bg-white rounded border">
            <span class="text-gray-500 font-mono text-xs">${idx + 1}</span>
            <div class="flex-1">
              <div class="font-semibold">${user.nome || user.first_name || 'Sem nome'}</div>
              <div class="text-xs text-gray-600">${user.email}</div>
            </div>
            <span class="text-xs ${user.ativo === 'sim' ? 'text-green-600' : 'text-red-600'}">
              ${user.ativo === 'sim' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        `).join('')}
        ${data.length > 10 ? `<p class="text-gray-500 text-center text-sm mt-3">... e mais ${data.length - 10} usuários</p>` : ''}
      </div>
    `
    
    previewArea.classList.remove('hidden')
  },
  
  async importUsers() {
    if (!this.usersData) {
      alert('❌ Nenhum dado para importar')
      return
    }
    
    const previewArea = document.getElementById('userCsvPreviewArea')
    const progressArea = document.getElementById('userImportProgress')
    const importLog = document.getElementById('userImportLog')
    
    previewArea.classList.add('hidden')
    progressArea.classList.remove('hidden')
    importLog.innerHTML = ''
    
    const log = (message, type = 'info') => {
      const colors = {
        info: 'text-blue-600',
        success: 'text-green-600',
        error: 'text-red-600'
      }
      importLog.innerHTML += `<div class="${colors[type]}">• ${message}</div>`
      importLog.scrollTop = importLog.scrollHeight
    }
    
    try {
      let created = 0
      let skipped = 0
      let errors = 0
      
      for (const row of this.usersData) {
        if (!row.email) {
          errors++
          continue
        }
        
        log(`Verificando: ${row.email}`, 'info')
        
        // Check if user exists
        try {
          const existingUser = await adminManager.findUserByEmail(row.email)
          
          if (existingUser) {
            skipped++
            log(`⊙ Usuário já existe: ${row.email}`, 'info')
            continue
          }
        } catch (error) {
          // User doesn't exist, continue to create
        }
        
        // Parse date
        let dt_expiracao = null
        if (row.dt_expiracao && row.dt_expiracao.trim()) {
          try {
            const parts = row.dt_expiracao.split(' ')[0].split('/')
            if (parts.length === 3) {
              dt_expiracao = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`
            }
          } catch (e) {
            console.error('Error parsing date:', e)
          }
        }
        
        // Create user
        const userData = {
          email: row.email,
          nome: row.nome || null,
          first_name: row.first_name || null,
          last_name: row.last_name || null,
          cpf: row.cpf || null,
          telefone: row.telefone || null,
          whatsapp: row.whatsapp || null,
          foto: row.foto || null,
          end_cep: row.end_cep || null,
          end_logradouro: row.end_logradouro || null,
          end_numero: row.end_numero || null,
          end_cidade: row.end_cidade || null,
          end_estado: row.end_estado || null,
          ativo: row.ativo === 'sim',
          teste_gratis: row.teste_gratis === 'sim',
          dt_expiracao: dt_expiracao
        }
        
        try {
          await axios.post('/api/admin/users', userData)
          created++
          log(`✓ Usuário criado: ${row.email}`, 'success')
        } catch (error) {
          errors++
          log(`✗ Erro ao criar ${row.email}: ${error.response?.data?.error || error.message}`, 'error')
        }
        
        // Delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      
      log('', 'info')
      log('========================================', 'info')
      log(`✅ Importação concluída!`, 'success')
      log('', 'info')
      log(`📦 CRIADOS: ${created} usuários`, 'success')
      log(`⊙ PULADOS: ${skipped} usuários`, 'info')
      log(`✗ ERROS: ${errors} usuários`, errors > 0 ? 'error' : 'info')
      
      setTimeout(() => {
        this.closeModal()
        adminUI.loadUsersTable()
        alert(`✅ Importação concluída!\n\n${created} criados\n${skipped} pulados\n${errors} erros`)
      }, 2000)
      
    } catch (error) {
      console.error('Import error:', error)
      log(`❌ Erro na importação: ${error.message}`, 'error')
      alert('❌ Erro durante a importação. Verifique o log para detalhes.')
    }
  },
  
  cancel() {
    this.usersData = null
    document.getElementById('userCsvPreviewArea').classList.add('hidden')
    document.getElementById('userCsvFileInput').value = ''
  },
  
  // ==================== MEMBER SUBSCRIPTION IMPORT ====================
  
  membersData: null,
  
  showMemberImportModal() {
    const modal = document.createElement('div')
    modal.id = 'memberImportModal'
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">
              <i class="fas fa-id-card mr-2"></i>
              Importar Membros/Assinaturas via CSV
            </h2>
            <button onclick="csvImport.closeMemberModal()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          <p class="mt-2 text-purple-100 text-sm">
            Importe o histórico de assinaturas dos membros do sistema
          </p>
        </div>
        
        <div class="p-6">
          <!-- Upload Section -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Selecione o arquivo CSV de Membros
            </label>
            <input type="file" 
                   id="memberCsvFileInput" 
                   accept=".csv"
                   onchange="csvImport.handleMemberFileSelect(event)"
                   class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer">
            <p class="mt-2 text-xs text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>
              Formato esperado: email_membro; data_expiracao; detalhe; origem; teste_gratis
            </p>
          </div>
          
          <!-- Preview Area -->
          <div id="memberCsvPreviewArea" class="hidden">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 class="font-semibold text-blue-900 mb-2">
                <i class="fas fa-eye mr-2"></i>
                Preview da Importação
              </h3>
              <div id="memberCsvStats" class="text-sm text-blue-800"></div>
            </div>
            
            <div class="mb-4">
              <div id="memberCsvPreviewContent" class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto text-sm"></div>
            </div>
            
            <div class="flex gap-3">
              <button onclick="csvImport.importMembers()" 
                      class="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
                <i class="fas fa-check mr-2"></i>
                Confirmar Importação
              </button>
              <button onclick="csvImport.cancelMember()" 
                      class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-colors">
                <i class="fas fa-times mr-2"></i>
                Cancelar
              </button>
            </div>
          </div>
          
          <!-- Progress Area -->
          <div id="memberImportProgress" class="hidden">
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h3 class="font-semibold text-purple-900 mb-2">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Importando Membros...
              </h3>
              <div id="memberImportLog" class="text-sm text-purple-800 max-h-96 overflow-y-auto font-mono"></div>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
  },
  
  closeMemberModal() {
    const modal = document.getElementById('memberImportModal')
    if (modal) modal.remove()
    this.membersData = null
  },
  
  handleMemberFileSelect(event) {
    const file = event.target.files[0]
    if (!file) return
    
    if (!file.name.endsWith('.csv')) {
      alert('❌ Por favor, selecione um arquivo CSV')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target.result
        this.membersData = this.parseMemberCSV(csvText)
        this.showMemberPreview()
      } catch (error) {
        console.error('Parse error:', error)
        alert('❌ Erro ao ler arquivo CSV: ' + error.message)
      }
    }
    reader.readAsText(file, 'UTF-8')
  },
  
  parseMemberCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim())
    const headers = lines[0].split(';').map(h => h.trim())
    
    const members = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';').map(v => v.trim().replace(/^"|"$/g, ''))
      
      const email = values[0]
      if (!email || !email.includes('@')) continue // Skip empty or invalid emails
      
      const member = {
        email_membro: email,
        data_expiracao: values[1] || null,
        detalhe: values[2] || null,
        origem: values[3] || null,
        teste_gratis: values[4] || 'não'
      }
      
      members.push(member)
    }
    
    return members
  },
  
  showMemberPreview() {
    document.getElementById('memberCsvPreviewArea').classList.remove('hidden')
    
    const stats = document.getElementById('memberCsvStats')
    stats.innerHTML = `
      <p class="mb-1"><strong>Total de membros:</strong> ${this.membersData.length}</p>
      <p class="mb-1"><strong>Teste grátis:</strong> ${this.membersData.filter(m => m.teste_gratis.toLowerCase() === 'sim').length}</p>
      <p><strong>Origens:</strong> ${[...new Set(this.membersData.map(m => m.origem).filter(Boolean))].join(', ')}</p>
    `
    
    const preview = document.getElementById('memberCsvPreviewContent')
    const sample = this.membersData.slice(0, 10)
    preview.innerHTML = `
      <p class="font-semibold mb-2">Primeiros 10 membros:</p>
      <div class="space-y-1">
        ${sample.map((m, i) => `
          <div class="text-xs bg-white p-2 rounded border">
            <strong>${i + 1}.</strong> ${m.email_membro} - 
            Exp: ${m.data_expiracao || 'N/A'} - 
            Origem: ${m.origem || 'N/A'} - 
            ${m.teste_gratis.toLowerCase() === 'sim' ? '🎁 Teste Grátis' : ''}
          </div>
        `).join('')}
      </div>
      ${this.membersData.length > 10 ? `<p class="text-xs text-gray-500 mt-2">... e mais ${this.membersData.length - 10} membros</p>` : ''}
    `
  },
  
  async importMembers() {
    if (!this.membersData || this.membersData.length === 0) {
      alert('❌ Nenhum dado para importar')
      return
    }
    
    const confirmed = confirm(`Tem certeza que deseja importar ${this.membersData.length} membros?\n\n⚠️ Esta operação pode levar alguns minutos.`)
    if (!confirmed) return
    
    // Hide preview, show progress
    document.getElementById('memberCsvPreviewArea').classList.add('hidden')
    document.getElementById('memberImportProgress').classList.remove('hidden')
    
    const logArea = document.getElementById('memberImportLog')
    const log = (message, type = 'info') => {
      const color = type === 'error' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-gray-700'
      logArea.innerHTML += `<div class="${color}">${message}</div>`
      logArea.scrollTop = logArea.scrollHeight
    }
    
    let created = 0
    let skipped = 0
    let errors = 0
    
    try {
      log(`🚀 Iniciando importação de ${this.membersData.length} membros...`)
      log(`⏳ Aguarde, processando...`)
      
      for (let i = 0; i < this.membersData.length; i++) {
        const row = this.membersData[i]
        const progress = Math.round(((i + 1) / this.membersData.length) * 100)
        
        if (i % 10 === 0) {
          log(`📊 Progresso: ${i + 1}/${this.membersData.length} (${progress}%)`)
        }
        
        try {
          // Check if member subscription already exists
          const existing = await adminManager.findMemberSubscriptionByEmail(row.email_membro)
          
          if (existing && existing.length > 0) {
            skipped++
            if (i % 50 === 0) {
              log(`⏭️  Pulado (duplicado): ${row.email_membro}`)
            }
            continue
          }
          
          // Parse date from "Aug 10, 2023 12:00 am" to ISO format
          let data_expiracao = null
          if (row.data_expiracao) {
            try {
              const parsedDate = new Date(row.data_expiracao)
              if (!isNaN(parsedDate.getTime())) {
                data_expiracao = parsedDate.toISOString()
              }
            } catch (e) {
              log(`⚠️  Data inválida para ${row.email_membro}: ${row.data_expiracao}`, 'error')
            }
          }
          
          // Create member subscription
          await axios.post('/api/admin/member-subscriptions', {
            email_membro: row.email_membro,
            data_expiracao: data_expiracao,
            detalhe: row.detalhe || null,
            origem: row.origem || null,
            teste_gratis: row.teste_gratis.toLowerCase() === 'sim',
            ativo: true
          })
          
          created++
          
          if (i % 100 === 0 && i > 0) {
            log(`✅ ${created} criados até agora...`, 'success')
          }
          
        } catch (error) {
          errors++
          log(`❌ Erro ao criar ${row.email_membro}: ${error.message}`, 'error')
        }
        
        // Small delay to avoid overwhelming the server
        if (i % 50 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      log('', 'info')
      log('═'.repeat(50), 'info')
      log(`✅ Importação concluída!`, 'success')
      log(`📊 Resumo:`, 'info')
      log(`   ✅ Criados: ${created}`, 'success')
      log(`   ⏭️  Pulados (duplicados): ${skipped}`, 'info')
      log(`   ❌ Erros: ${errors}`, errors > 0 ? 'error' : 'info')
      log('═'.repeat(50), 'info')
      
      setTimeout(() => {
        this.closeMemberModal()
        adminUI.loadSubscriptionsTable()
        alert(`✅ Importação concluída!\n\n${created} criados\n${skipped} pulados\n${errors} erros`)
      }, 2000)
      
    } catch (error) {
      console.error('Import error:', error)
      log(`❌ Erro na importação: ${error.message}`, 'error')
      alert('❌ Erro durante a importação. Verifique o log para detalhes.')
    }
  },
  
  cancelMember() {
    this.membersData = null
    document.getElementById('memberCsvPreviewArea').classList.add('hidden')
    document.getElementById('memberCsvFileInput').value = ''
  },
  
  // ==================== CERTIFICATE IMPORT ====================
  
  certificatesData: null,
  
  showCertificateImportModal() {
    const modal = document.createElement('div')
    modal.id = 'certificateImportModal'
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">
              <i class="fas fa-certificate mr-2"></i>
              Importar Certificados via CSV
            </h2>
            <button onclick="csvImport.closeCertificateModal()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          <p class="mt-2 text-yellow-100 text-sm">
            Importe certificados emitidos para alunos
          </p>
        </div>
        
        <div class="p-6">
          <!-- Upload Section -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Selecione o arquivo CSV de Certificados
            </label>
            <input type="file" 
                   id="certificateCsvFileInput" 
                   accept=".csv"
                   onchange="csvImport.handleCertificateFileSelect(event)"
                   class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer">
            <p class="mt-2 text-xs text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>
              Formato esperado: user_email; user_name; course_title; carga_horaria
            </p>
          </div>
          
          <!-- Preview Area -->
          <div id="certificateCsvPreviewArea" class="hidden">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 class="font-semibold text-blue-900 mb-2">
                <i class="fas fa-eye mr-2"></i>
                Preview da Importação
              </h3>
              <div id="certificateCsvStats" class="text-sm text-blue-800"></div>
            </div>
            
            <div class="mb-4">
              <div id="certificateCsvPreviewContent" class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto text-sm"></div>
            </div>
            
            <div class="flex gap-3">
              <button onclick="csvImport.importCertificates()" 
                      class="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors">
                <i class="fas fa-check mr-2"></i>
                Confirmar Importação
              </button>
              <button onclick="csvImport.cancelCertificate()" 
                      class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-colors">
                <i class="fas fa-times mr-2"></i>
                Cancelar
              </button>
            </div>
          </div>
          
          <!-- Progress Area -->
          <div id="certificateImportProgress" class="hidden">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 class="font-semibold text-yellow-900 mb-2">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Importando Certificados...
              </h3>
              <div id="certificateImportLog" class="text-sm text-yellow-800 max-h-96 overflow-y-auto font-mono"></div>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
  },
  
  closeCertificateModal() {
    const modal = document.getElementById('certificateImportModal')
    if (modal) modal.remove()
    this.certificatesData = null
  },
  
  handleCertificateFileSelect(event) {
    const file = event.target.files[0]
    if (!file) return
    
    if (!file.name.endsWith('.csv')) {
      alert('❌ Por favor, selecione um arquivo CSV')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target.result
        this.certificatesData = this.parseCertificateCSV(csvText)
        this.showCertificatePreview()
      } catch (error) {
        console.error('Parse error:', error)
        alert('❌ Erro ao ler arquivo CSV: ' + error.message)
      }
    }
    reader.readAsText(file, 'UTF-8')
  },
  
  parseCertificateCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim())
    const headers = lines[0].split(';').map(h => h.trim())
    
    const certificates = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';').map(v => v.trim().replace(/^"|"$/g, ''))
      
      const email = values[0]
      const name = values[1]
      const course = values[2]
      
      // Skip if email or course is empty
      if (!email || !email.includes('@') || !course) continue
      
      // Fix malformed data (sometimes name is in course position)
      let finalName = name
      let finalCourse = course
      
      // If name looks like course title (all caps or no @), it's probably wrong
      if (name && !name.includes(' ') && name === name.toUpperCase()) {
        finalName = null
        finalCourse = name
      }
      
      const certificate = {
        user_email: email,
        user_name: finalName || null,
        course_title: finalCourse,
        carga_horaria: values[3] ? parseInt(values[3]) : null
      }
      
      certificates.push(certificate)
    }
    
    return certificates
  },
  
  showCertificatePreview() {
    document.getElementById('certificateCsvPreviewArea').classList.remove('hidden')
    
    const courses = [...new Set(this.certificatesData.map(c => c.course_title))]
    const students = [...new Set(this.certificatesData.map(c => c.user_email))]
    
    const stats = document.getElementById('certificateCsvStats')
    stats.innerHTML = `
      <p class="mb-1"><strong>Total de certificados:</strong> ${this.certificatesData.length}</p>
      <p class="mb-1"><strong>Alunos únicos:</strong> ${students.length}</p>
      <p><strong>Cursos:</strong> ${courses.join(', ')}</p>
    `
    
    const preview = document.getElementById('certificateCsvPreviewContent')
    const sample = this.certificatesData.slice(0, 10)
    preview.innerHTML = `
      <p class="font-semibold mb-2">Primeiros 10 certificados:</p>
      <div class="space-y-1">
        ${sample.map((c, i) => `
          <div class="text-xs bg-white p-2 rounded border">
            <strong>${i + 1}.</strong> ${c.user_name || 'Sem nome'} (${c.user_email}) - 
            <span class="font-semibold text-blue-600">${c.course_title}</span> - 
            ${c.carga_horaria ? c.carga_horaria + 'h' : 'Sem carga horária'}
          </div>
        `).join('')}
      </div>
      ${this.certificatesData.length > 10 ? `<p class="text-xs text-gray-500 mt-2">... e mais ${this.certificatesData.length - 10} certificados</p>` : ''}
    `
  },
  
  async importCertificates() {
    if (!this.certificatesData || this.certificatesData.length === 0) {
      alert('❌ Nenhum dado para importar')
      return
    }
    
    const confirmed = confirm(`Tem certeza que deseja importar ${this.certificatesData.length} certificados?\n\n⚠️ Duplicatas serão detectadas por email + curso.`)
    if (!confirmed) return
    
    // Hide preview, show progress
    document.getElementById('certificateCsvPreviewArea').classList.add('hidden')
    document.getElementById('certificateImportProgress').classList.remove('hidden')
    
    const logArea = document.getElementById('certificateImportLog')
    const log = (message, type = 'info') => {
      const color = type === 'error' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-gray-700'
      logArea.innerHTML += `<div class="${color}">${message}</div>`
      logArea.scrollTop = logArea.scrollHeight
    }
    
    let created = 0
    let skipped = 0
    let errors = 0
    
    try {
      log(`🚀 Iniciando importação de ${this.certificatesData.length} certificados...`)
      log(`⏳ Aguarde, processando...`)
      
      for (let i = 0; i < this.certificatesData.length; i++) {
        const row = this.certificatesData[i]
        const progress = Math.round(((i + 1) / this.certificatesData.length) * 100)
        
        if (i % 10 === 0) {
          log(`📊 Progresso: ${i + 1}/${this.certificatesData.length} (${progress}%)`)
        }
        
        try {
          // Check if certificate already exists (email + course)
          const existing = await adminManager.findCertificateBoth(row.user_email, row.course_title)
          
          if (existing && existing.length > 0) {
            skipped++
            if (i % 20 === 0) {
              log(`⏭️  Pulado (duplicado): ${row.user_email} - ${row.course_title}`)
            }
            continue
          }
          
          // Create certificate
          await axios.post('/api/admin/certificates', {
            user_email: row.user_email,
            user_name: row.user_name,
            course_title: row.course_title,
            carga_horaria: row.carga_horaria
          })
          
          created++
          
          if (i % 50 === 0 && i > 0) {
            log(`✅ ${created} criados até agora...`, 'success')
          }
          
        } catch (error) {
          errors++
          log(`❌ Erro ao criar certificado para ${row.user_email}: ${error.message}`, 'error')
        }
        
        // Small delay to avoid overwhelming the server
        if (i % 25 === 0) {
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }
      
      log('', 'info')
      log('═'.repeat(50), 'info')
      log(`✅ Importação concluída!`, 'success')
      log(`📊 Resumo:`, 'info')
      log(`   ✅ Criados: ${created}`, 'success')
      log(`   ⏭️  Pulados (duplicados): ${skipped}`, 'info')
      log(`   ❌ Erros: ${errors}`, errors > 0 ? 'error' : 'info')
      log('═'.repeat(50), 'info')
      
      setTimeout(() => {
        this.closeCertificateModal()
        adminUI.loadCertificatesTable()
        alert(`✅ Importação concluída!\n\n${created} criados\n${skipped} pulados\n${errors} erros`)
      }, 2000)
      
    } catch (error) {
      console.error('Import error:', error)
      log(`❌ Erro na importação: ${error.message}`, 'error')
      alert('❌ Erro durante a importação. Verifique o log para detalhes.')
    }
  },
  
  cancelCertificate() {
    this.certificatesData = null
    document.getElementById('certificateCsvPreviewArea').classList.add('hidden')
    document.getElementById('certificateCsvFileInput').value = ''
  }
}

// Add findUserByEmail to adminManager
adminManager.findUserByEmail = async function(email) {
  try {
    const response = await axios.get(`/api/admin/users/find?email=${encodeURIComponent(email)}`)
    return response.data.user
  } catch (error) {
    return null
  }
}

// Add findMemberSubscriptionByEmail to adminManager
adminManager.findMemberSubscriptionByEmail = async function(email) {
  try {
    const response = await axios.get(`/api/admin/member-subscriptions/find?email=${encodeURIComponent(email)}`)
    return response.data.subscriptions || []
  } catch (error) {
    return []
  }
}

// Add findCertificateBoth to adminManager
adminManager.findCertificateBoth = async function(email, course) {
  try {
    const response = await axios.get(`/api/admin/certificates/find?email=${encodeURIComponent(email)}&course=${encodeURIComponent(course)}`)
    return response.data.certificates || []
  } catch (error) {
    return []
  }
}
