import api from '../utils/api.js'

// POST /api/cvs/upload
export const uploadCV = async (fileData) => {
  const formData = new FormData()
  formData.append('file', fileData.file)
  if (fileData.cvName) formData.append('cvName', fileData.cvName)
  formData.append('isDefault', fileData.isDefault || false)
  
  if (fileData.fullName) formData.append('fullName', fileData.fullName)
  if (fileData.email) formData.append('email', fileData.email)
  if (fileData.phone) formData.append('phone', fileData.phone)
  
  return api.post('/cvs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// POST /api/cvs/build
export const buildCV = (cvData) => api.post('/cvs/build', cvData)

// GET /api/cvs
export const getAllCVs = () => api.get('/cvs')

// GET /api/cvs/active
export const getActiveCVs = () => api.get('/cvs/active')

// GET /api/cvs/{id}
export const getCVById = (id) => api.get(`/cvs/${id}`)

// GET /api/cvs/default
export const getDefaultCV = () => api.get('/cvs/default')

// PUT /api/cvs/{id}
export const updateCV = (id, cvData) => api.put(`/cvs/${id}`, cvData)

// PATCH /api/cvs/{id}/default
export const setAsDefault = (id) => api.patch(`/cvs/${id}/default`)

// PATCH /api/cvs/{id}/status
export const toggleCVStatus = (id, isActive) => 
  api.patch(`/cvs/${id}/status?isActive=${isActive}`)

// DELETE /api/cvs/{id}
export const deleteCV = (id) => api.delete(`/cvs/${id}`)

// GET /api/cvs/{id}/download
export const downloadCV = (id) => 
  api.get(`/cvs/${id}/download`, { responseType: 'blob' })

// GET /api/cvs/stats
export const getCVStats = () => api.get('/cvs/stats')