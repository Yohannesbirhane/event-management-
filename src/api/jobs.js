import api from '../utils/api'

// GET /api/jobs
export const getAllJobs = () => api.get('/jobs')

// GET /api/jobs/{id}
export const getJobById = (id) => api.get(`/jobs/${id}`)

// POST /api/jobs
export const createJob = (jobData) => api.post('/jobs', jobData)

// PUT /api/jobs/{id}
export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData)

// DELETE /api/jobs/{id}
export const deleteJob = (id) => api.delete(`/jobs/${id}`)

// GET /api/jobs/search?keyword=...
export const searchJobs = (keyword) => api.get(`/jobs/search?keyword=${keyword}`)

// GET /api/jobs/filter
export const filterJobs = (filters) => {
  const params = new URLSearchParams()
  if (filters.location) params.append('location', filters.location)
  if (filters.jobType) params.append('jobType', filters.jobType)
  if (filters.minSalary) params.append('minSalary', filters.minSalary)
  if (filters.maxSalary) params.append('maxSalary', filters.maxSalary)
  
  return api.get(`/jobs/filter?${params.toString()}`)
}

// GET /api/jobs/employer/{employerId}
export const getJobsByEmployer = (employerId) => 
  api.get(`/jobs/employer/${employerId}`)

// PATCH /api/jobs/{id}/status
export const toggleJobStatus = (id, isActive) => 
  api.patch(`/jobs/${id}/status?isActive=${isActive}`)