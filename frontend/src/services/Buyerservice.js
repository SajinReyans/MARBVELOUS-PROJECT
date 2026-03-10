// services/buyerService.js
import api from './api.js'

const BASE = 'http://localhost:5000'
export const fileUrl = (p) => (!p ? '' : p.startsWith('http') ? p : `${BASE}/${p.replace(/\\/g, '/').replace(/^\//, '')}`)

// ── Search ────────────────────────────────────────────
export const searchProducts = (params) => api.get('/search/products', { params }).then(r => r.data)
export const searchShops    = (params) => api.get('/search/shops',    { params }).then(r => r.data)
export const getAllShops     = ()       => api.get('/search/all-shops').then(r => r.data)
export const getAllProducts  = ()       => api.get('/search/all-products').then(r => r.data)
export const getPublicStore  = (slug)  => api.get(`/store/${slug}`).then(r => r.data)
export const getProduct      = (id)   => api.get(`/products/${id}`).then(r => r.data)

// ── Cart ──────────────────────────────────────────────
export const getCart        = ()                       => api.get('/cart').then(r => r.data)
export const addToCart      = (productId, quantity=1)  => api.post('/cart/add', { productId, quantity }).then(r => r.data)
export const updateCartItem = (productId, quantity)    => api.put('/cart/update', { productId, quantity }).then(r => r.data)
export const removeFromCart = (productId)              => api.delete(`/cart/item/${productId}`).then(r => r.data)
export const clearCart      = ()                       => api.delete('/cart/clear').then(r => r.data)

// ── Orders ────────────────────────────────────────────
export const placeOrder        = (data) => api.post('/orders', data).then(r => r.data)
export const getBuyerOrders    = ()     => api.get('/orders/my').then(r => r.data)
export const getSellerOrders   = ()     => api.get('/orders/seller').then(r => r.data)
export const getSellerRevenue  = ()     => api.get('/orders/revenue').then(r => r.data)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status }).then(r => r.data)
export const cancelOrder       = (id)   => api.post(`/orders/${id}/cancel`).then(r => r.data)

// ── Distance (Haversine formula) ──────────────────────
export function getDistanceKm(lat1, lng1, lat2, lng2) {
    const R  = 6371
    const dL = (lat2 - lat1) * Math.PI / 180
    const dG = (lng2 - lng1) * Math.PI / 180
    const a  = Math.sin(dL/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dG/2)**2
    return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
}