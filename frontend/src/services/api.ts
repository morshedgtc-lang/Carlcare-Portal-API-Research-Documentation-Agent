import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken })
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          original.headers.Authorization = `Bearer ${data.accessToken}`
          return api(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const auth = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
}

export const imei = {
  search: (imei: string) => api.post('/imei/search', { imei }),
  getByImei: (imei: string) => api.get(`/imei/${imei}`),
}

export const service = {
  submit: (data: { imei: string; brand?: string; model?: string; country?: string }) =>
    api.post('/service/submit', data),
  status: (imei: string) => api.get(`/service/status/${imei}`),
  myRequests: (page = 1, limit = 20) =>
    api.get(`/service/my-requests?page=${page}&limit=${limit}`),
}

export const admin = {
  dashboard: () => api.get('/admin/dashboard'),
  requests: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    api.get('/admin/requests', { params }),
  updateRequest: (id: number, data: { status?: string; note?: string; adminNote?: string }) =>
    api.put(`/admin/request/${id}`, data),
  searchImei: (imei: string) => api.get('/admin/search', { params: { imei } }),
  users: (page = 1, limit = 20) => api.get('/admin/users', { params: { page, limit } }),
  exportCsv: () => api.get('/admin/export', { responseType: 'blob' }),
  logs: (params?: { page?: number; limit?: number; imei?: string }) =>
    api.get('/admin/logs', { params }),
  charts: (days = 30) => api.get('/admin/charts', { params: { days } }),
}
