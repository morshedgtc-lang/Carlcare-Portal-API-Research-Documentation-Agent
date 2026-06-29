export interface User {
  id: number
  email: string
  name: string | null
  role: 'ADMIN' | 'USER'
  createdAt?: string
  _count?: { serviceRequests: number }
}

export interface AuthResponse {
  success: boolean
  user: User
  accessToken: string
  refreshToken: string
}

export interface ServiceRequest {
  id: number
  serviceNumber: string
  imei: string
  brand: string | null
  model: string | null
  country: string | null
  status: RequestStatus
  applicationTime: string | null
  reviewTime: string | null
  note: string | null
  adminNote: string | null
  source: string
  submittedBy: number | null
  submittedByUser?: { id: number; email: string; name: string | null }
  createdAt: string
  updatedAt: string
}

export type RequestStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'DISAPPROVED' | 'CANCELLED'

export interface LookupLog {
  id: number
  imei: string
  source: string
  found: boolean
  responseRaw: string | null
  ip: string | null
  userId: number | null
  duration: number | null
  createdAt: string
}

export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  read: boolean
  type: string
  link: string | null
  createdAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface DashboardStats {
  totalUsers: number
  totalSearches: number
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  todaySearches: number
  monthSearches: number
}

export interface SearchResult {
  imei?: string
  brand?: string
  model?: string
  country?: string
  serviceNumber?: string
  status?: string
  applicationTime?: string
  reviewTime?: string
  note?: string
  source?: string
  found?: boolean
  autoSubmitted?: boolean
  message?: string
  existingServiceNumber?: string
}
