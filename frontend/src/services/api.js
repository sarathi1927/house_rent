import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('househunt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid or expired, clear local storage
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        currentPath !== '/'
      ) {
        // Only clear if on a protected route to prevent loops
        localStorage.removeItem('househunt_token');
        localStorage.removeItem('househunt_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Properties Endpoints
export const propertiesAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  getMyProperties: () => api.get('/properties/user/my-properties'),
  getAdminPending: () => api.get('/properties/admin/pending'),
  updateStatus: (id, statusData) => api.put(`/properties/${id}/status`, statusData),
  addReview: (id, reviewData) => api.post(`/properties/${id}/reviews`, reviewData),
};

// Bookings Endpoints
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getOwnerRequests: () => api.get('/bookings/owner-requests'),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

// Stats Endpoints
export const statsAPI = {
  getPlatformStats: () => api.get('/stats/platform'),
  getOwnerStats: () => api.get('/stats/owner'),
};

export default api;
