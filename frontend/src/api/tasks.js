import axios from 'axios';

// Base axios instance — all calls go to /api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});
// Unwrap response and extract error message automatically
api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(new Error(err.response?.data?.message || 'Something went wrong'))
);

export const taskAPI = {
  getAll:       (params)     => api.get('/tasks', { params }),
  getOne:       (id)         => api.get(`/tasks/${id}`),
  create:       (data)       => api.post('/tasks', data),
  update:       (id, data)   => api.put(`/tasks/${id}`, data),
  toggleStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  delete:       (id)         => api.delete(`/tasks/${id}`),
};
