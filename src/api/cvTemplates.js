import api from '../utils/api'

// GET /api/cv-templates
export const getAllTemplates = () => api.get('/cv-templates')

// GET /api/cv-templates/active
export const getActiveTemplates = () => api.get('/cv-templates/active')

// GET /api/cv-templates/free
export const getFreeTemplates = () => api.get('/cv-templates/free')

// GET /api/cv-templates/premium
export const getPremiumTemplates = () => api.get('/cv-templates/premium')

// GET /api/cv-templates/category/{category}
export const getTemplatesByCategory = (category) => 
  api.get(`/cv-templates/category/${category}`)

// GET /api/cv-templates/search
export const searchTemplates = (keyword) => 
  api.get(`/cv-templates/search?keyword=${keyword}`)

// GET /api/cv-templates/categories
export const getAllCategories = () => api.get('/cv-templates/categories')

// GET /api/cv-templates/{id}
export const getTemplateById = (id) => api.get(`/cv-templates/${id}`)

// POST /api/cv-templates/{templateId}/build-cv
export const buildCvFromTemplate = (templateId, cvData) => 
  api.post(`/cv-templates/${templateId}/build-cv`, cvData)