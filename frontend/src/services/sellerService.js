// services/sellerService.js
// API calls for seller store and product management.

import api from './api.js'

const BASE_URL = 'http://localhost:5000'

// ── Convert file path to full URL ─────────────────────
export function getFileUrl(filePath) {
    if (!filePath) return ''
    if (filePath.startsWith('http')) return filePath
    return BASE_URL + '/' + filePath.replace(/\\/g, '/').replace(/^\//, '')
}

// ════════════════════════════════════════════════════
// STORE
// ════════════════════════════════════════════════════

export async function getMyStore() {
    try {
        const { data } = await api.get('/store/my')
        return { success: true, store: data.store }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to load store' }
    }
}

export async function updateMyStore(formData) {
    try {
        const { data } = await api.put('/store/my', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return { success: true, store: data.store }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to update store' }
    }
}

export async function getPublicStore(slug) {
    try {
        const { data } = await api.get(`/store/${slug}`)
        return { success: true, store: data.store, products: data.products }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Store not found' }
    }
}

// ════════════════════════════════════════════════════
// PRODUCTS
// ════════════════════════════════════════════════════

export async function addProduct(formData) {
    try {
        const { data } = await api.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return { success: true, product: data.product }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to add product' }
    }
}

export async function getMyProducts() {
    try {
        const { data } = await api.get('/products/my')
        return { success: true, products: data.products }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to load products' }
    }
}

export async function updateProduct(id, formData) {
    try {
        const { data } = await api.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return { success: true, product: data.product }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to update product' }
    }
}

export async function deleteProduct(id) {
    try {
        await api.delete(`/products/${id}`)
        return { success: true }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to delete product' }
    }
}

export async function deleteProductImage(productId, imagePath) {
    try {
        await api.delete(`/products/${productId}/image`, { data: { imagePath } })
        return { success: true }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to delete image' }
    }
}