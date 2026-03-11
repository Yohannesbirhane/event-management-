import api from '../utils/api'

// POST /api/job-alerts
export const createJobAlert = (alertData) => api.post('/job-alerts', alertData)

// GET /api/job-alerts
export const getAllJobAlerts = () => api.get('/job-alerts')

// GET /api/job-alerts/active
export const getActiveJobAlerts = () => api.get('/job-alerts/active')

// GET /api/job-alerts/{id}
export const getJobAlertById = (id) => api.get(`/job-alerts/${id}`)

// PUT /api/job-alerts/{id}
export const updateJobAlert = (id, alertData) => api.put(`/job-alerts/${id}`, alertData)

// PATCH /api/job-alerts/{id}/status
export const toggleJobAlertStatus = (id, isActive) => 
  api.patch(`/job-alerts/${id}/status?isActive=${isActive}`)

// DELETE /api/job-alerts/{id}
export const deleteJobAlert = (id) => api.delete(`/job-alerts/${id}`)

// POST /api/job-alerts/{id}/trigger
export const triggerJobAlert = (id) => api.post(`/job-alerts/${id}/trigger`)

// GET /api/job-alerts/{id}/matches
export const getMatchingJobs = (id) => api.get(`/job-alerts/${id}/matches`)