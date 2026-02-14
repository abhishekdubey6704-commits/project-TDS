import axios from 'axios';

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  validateResetToken: (token) => api.post('/auth/validate-reset-token', { token }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ============================================
// VOLUMES API
// ============================================
export const volumesApi = {
  getAll: () => api.get('/volumes'),
  getById: (volumeId) => api.get(`/volumes/${volumeId}`),
  getEpisodes: (volumeId) => api.get(`/volumes/${volumeId}/episodes`),
};

// ============================================
// EPISODES API
// ============================================
export const episodesApi = {
  getById: (volumeId, episodeId) => api.get(`/volumes/${volumeId}/episodes/${episodeId}`),
  getContent: (volumeId, episodeId) => api.get(`/volumes/${volumeId}/episodes/${episodeId}/content`),
  markComplete: (volumeId, episodeId) => api.post(`/volumes/${volumeId}/episodes/${episodeId}/complete`),
};

// ============================================
// READING PROGRESS API
// ============================================
export const progressApi = {
  get: (volumeId, episodeId) => api.get(`/progress/${volumeId}/${episodeId}`),
  update: (volumeId, episodeId, data) => api.put(`/progress/${volumeId}/${episodeId}`, data),
  getAll: () => api.get('/progress'),
  getContinueReading: () => api.get('/progress/continue'),
};

// ============================================
// CHARACTERS API
// ============================================
export const charactersApi = {
  getAll: () => api.get('/characters'),
  getById: (characterId) => api.get(`/characters/${characterId}`),
  getByVolume: (volumeId) => api.get(`/volumes/${volumeId}/characters`),
};

// ============================================
// DONATIONS API
// ============================================
export const donationsApi = {
  create: (data) => api.post('/donations', data),
  getHistory: () => api.get('/donations/history'),
  getStats: () => api.get('/donations/stats'),
  getRecent: () => api.get('/donations/recent'),
  verifyPayment: (paymentId, signature) => api.post('/donations/verify', { paymentId, signature }),
};

// ============================================
// BOOKMARKS API
// ============================================
export const bookmarksApi = {
  getAll: () => api.get('/bookmarks'),
  add: (volumeId, episodeId, position) => api.post('/bookmarks', { volumeId, episodeId, position }),
  remove: (bookmarkId) => api.delete(`/bookmarks/${bookmarkId}`),
};

// ============================================
// SEARCH API
// ============================================
export const searchApi = {
  search: (query) => api.get('/search', { params: { q: query } }),
  searchEpisodes: (query) => api.get('/search/episodes', { params: { q: query } }),
  searchCharacters: (query) => api.get('/search/characters', { params: { q: query } }),
};

// ============================================
// ANALYTICS API (for tracking)
// ============================================
export const analyticsApi = {
  trackEvent: (eventName, data) => api.post('/analytics/events', { eventName, ...data }),
  trackPageView: (page) => api.post('/analytics/pageview', { page }),
};

// ============================================
// PURCHASES API
// ============================================
export const purchasesApi = {
  create: (productId, customerEmail, customerName) => 
    api.post('/purchases/create', { productId, customerEmail, customerName }),
  verify: (razorpayOrderId, razorpayPaymentId, razorpaySignature) => 
    api.post('/purchases/verify', { razorpayOrderId, razorpayPaymentId, razorpaySignature }),
  getHistory: () => api.get('/purchases/history'),
  getOrder: (orderId) => api.get(`/purchases/${orderId}`),
  checkAccess: (volumeId, contentType) => api.get(`/purchases/check-access/${volumeId}/${contentType}`),
};

// ============================================
// CONTENT ACCESS API (OTP protected)
// ============================================
export const contentApi = {
  requestOtp: (volumeId, contentType) => 
    api.post('/content/request-otp', { volumeId, contentType }),
  verifyOtp: (volumeId, contentType, otp) => 
    api.post('/content/verify-otp', { volumeId, contentType, otp }),
  getContent: (volumeId, contentType, page, accessToken) => 
    api.get(`/content/view/${volumeId}/${contentType}`, {
      params: { page },
      headers: { 'X-Access-Token': accessToken }
    }),
  getLibrary: () => api.get('/content/my-library'),
};

// ============================================
// PRODUCTS API (Shop)
// ============================================
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (productId) => api.get(`/products/${productId}`),
  getByVolume: (volumeId) => api.get(`/products/volume/${volumeId}`),
  getFeatured: () => api.get('/products/featured'),
};

// ============================================
// ADMIN API
// ============================================
export const adminApi = {
  // Volumes
  getVolumes: () => api.get('/admin/volumes'),
  createVolume: (data) => api.post('/admin/volumes', data),
  updateVolume: (volumeId, data) => api.put(`/admin/volumes/${volumeId}`, data),
  deleteVolume: (volumeId) => api.delete(`/admin/volumes/${volumeId}`),
  
  // Episodes
  getEpisodes: (volumeId) => api.get(`/admin/volumes/${volumeId}/episodes`),
  createEpisode: (volumeId, data) => api.post(`/admin/episodes/${volumeId}`, data),
  updateEpisode: (episodeId, data) => api.put(`/admin/episodes/${episodeId}`, data),
  deleteEpisode: (episodeId) => api.delete(`/admin/episodes/${episodeId}`),
  
  // Products
  getProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (productId, data) => api.put(`/admin/products/${productId}`, data),
  deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),
  
  // Characters
  getCharacters: () => api.get('/admin/characters'),
  createCharacter: (volumeId, data) => api.post(`/admin/characters/${volumeId}`, data),
  updateCharacter: (characterId, data) => api.put(`/admin/characters/${characterId}`, data),
  deleteCharacter: (characterId) => api.delete(`/admin/characters/${characterId}`),
  
  // Orders
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (orderId, status) => api.patch(`/admin/orders/${orderId}/status?status=${status}`),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  getUser: (userId) => api.get(`/admin/users/${userId}`),
  updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role?role=${role}`),
  
  // Stats
  getStats: () => api.get('/admin/stats'),
};

export default api;
