// pages/SellerOrdersPage.jsx
// Seller sees all incoming orders, updates status, tracks revenue.

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { logout } from '../services/authService'
import { getSellerOrders, updateOrderStatus, getSellerRevenue, fileUrl } from '../services/buyerService'

const STATUSES = [
    { value: 'placed',     label: '🆕 Order Placed',    color: '#2563eb', bg: '#eff6ff' },
    { value: 'processing', label: '⚙️ Processing',       color: '#7c3aed', bg: '#f5f3ff' },
    { value: 'packing',    label: '📦 Being Packed',     color: '#d97706', bg: '#fffbeb' },
    { value: 'on_the_way', label: '🚚 On the Way',       color: '#0891b2', bg: '#ecfeff' },
    { value: 'delivered',  label: '✅ Delivered',         color: '#16a34a', bg: '#f0fdf4' },
    { value: 'cancelled',  label: '❌ Cancelled',         color: '#ef4444', bg: '#fef2f2' },
]

function statusInfo(val) { return STATUSES.find(s => s.value === val) || STATUSES[0] }

export default function SellerOrdersPage() {
    const navigate = useNavigate()

    const [orders,   setOrders]   = useState([])
    const [revenue,  setRevenue]  = useState({ revenue: 0, totalOrders: 0, month: null })
    const [loading,  setLoading]  = useState(true)
    const [updating, setUpdating] = useState(null) // orderId being updated
    const [filter,   setFilter]   = useState('all')

    useEffect(() => { loadAll() }, [])

    async function loadAll() {
        setLoading(true)
        const [ordRes, revRes] = await Promise.all([getSellerOrders(), getSellerRevenue()])
        if (ordRes.success) setOrders(ordRes.orders)
        if (revRes.success) setRevenue(revRes)
        setLoading(false)
    }

    async function handleStatusChange(orderId, status) {
        setUpdating(orderId)
        await updateOrderStatus(orderId, status)
        await loadAll()
        setUpdating(null)
    }

    function handleLogout() { logout(); navigate('/') }

    const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>
            <nav style={{ background: '#fff', borderBottom: '1.5px solid var(--border)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Logo size="sm" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', background: '#7c3aed', padding: '4px 10px', borderRadius: 20 }}>Orders</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => navigate('/seller/dashboard')} style={{ padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>← Dashboard</button>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>Logout</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>

                {/* Revenue Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
                    {[
                        { icon: '💰', label: `Revenue (${MONTH_NAMES[revenue.month] || '—'})`, value: `₹${revenue.revenue || 0}`, color: '#10b981' },
                        { icon: '📦', label: 'Total Orders', value: revenue.totalOrders || 0, color: '#7c3aed' },
                        { icon: '🆕', label: 'New Orders', value: orders.filter(o => o.status === 'placed').length, color: '#2563eb' },
                        { icon: '🚚', label: 'In Transit', value: orders.filter(o => o.status === 'on_the_way').length, color: '#0891b2' },
                    ].map(s => (
                        <div key={s.label} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                    {[{ value: 'all', label: 'All' }, ...STATUSES].map(s => (
                        <button key={s.value} onClick={() => setFilter(s.value)} style={{
                            padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${filter === s.value ? '#7c3aed' : 'var(--border)'}`,
                            background: filter === s.value ? '#f5f3ff' : '#fff',
                            color: filter === s.value ? '#7c3aed' : 'var(--text-muted)',
                            fontSize: '0.8rem', fontWeight: filter === s.value ? 700 : 400,
                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>{s.label || 'All'}</button>
                    ))}
                </div>

                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', marginBottom: 20 }}>
                    Orders <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>({filtered.length})</span>
                </h1>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                        <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.map(order => {
                            const st = statusInfo(order.status)
                            return (
                                <div key={order._id} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>

                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                        <div>
                                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>Order ID: <span style={{ fontFamily: 'monospace' }}>{order._id.slice(-10).toUpperCase()}</span></p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <span style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color, fontWeight: 700 }}>{st.label}</span>
                                                <span style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20, background: '#f9fafb', color: 'var(--text-muted)', fontWeight: 600 }}>{order.paymentMethod === 'cod' ? '💵 COD' : '💳 Online'}</span>
                                                {order.paymentStatus === 'paid' && <span style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', fontWeight: 700 }}>✓ Paid</span>}
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1.1rem' }}>₹{order.totalAmount}</span>
                                    </div>

                                    {/* Items */}
                                    <div style={{ background: '#f9fafb', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 14 }}>
                                        {order.items.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: i < order.items.length - 1 ? 8 : 0, marginBottom: i < order.items.length - 1 ? 8 : 0, borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 6, background: '#e5e7eb', overflow: 'hidden', flexShrink: 0 }}>
                                                    {item.image ? <img src={fileUrl(item.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🪨</div>}
                                                </div>
                                                <p style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</p>
                                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>×{item.quantity}</p>
                                                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Buyer & Address */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                                        <div style={{ background: '#f9fafb', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                                            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>Customer</p>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.buyer?.fullName}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.buyer?.email}</p>
                                            {order.buyer?.mobile && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.buyer.mobile}</p>}
                                        </div>
                                        <div style={{ background: '#f9fafb', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                                            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>Delivery Address</p>
                                            <p style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                                                {order.deliveryAddress?.fullName && <><strong>{order.deliveryAddress.fullName}</strong><br /></>}
                                                {[order.deliveryAddress?.street, order.deliveryAddress?.city, order.deliveryAddress?.state, order.deliveryAddress?.pincode].filter(Boolean).join(', ')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Control */}
                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                        <div>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>Update Status</p>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                {STATUSES.filter(s => s.value !== order.status).map(s => (
                                                    <button key={s.value} onClick={() => handleStatusChange(order._id, s.value)} disabled={updating === order._id} style={{
                                                        padding: '7px 14px', borderRadius: 'var(--radius-sm)',
                                                        border: `1.5px solid ${s.bg === '#fef2f2' ? '#fecaca' : 'var(--border)'}`,
                                                        background: s.bg, color: s.color, fontSize: '0.8rem', fontWeight: 600,
                                                        cursor: updating === order._id ? 'not-allowed' : 'pointer',
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        opacity: updating === order._id ? 0.6 : 1,
                                                    }}>{updating === order._id ? '...' : s.label}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}