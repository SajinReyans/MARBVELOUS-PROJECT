// services/api.js
// Base Axios instance used by all services.
// Automatically attaches the JWT token to every request if the user is logged in.

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('marbvelous_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle global errors (e.g. token expired → redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('marbvelous_token')
      localStorage.removeItem('marbvelous_user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api
