// pages/BuyerOrdersPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'
import { getBuyerOrders, cancelOrder, fileUrl } from '../services/buyerService'

const STATUS_LABEL = {
    placed:     { label: 'Order Placed',   color: '#2563eb', bg: '#eff6ff' },
    processing: { label: 'Processing',     color: '#7c3aed', bg: '#f5f3ff' },
    packing:    { label: 'Being Packed',   color: '#d97706', bg: '#fffbeb' },
    on_the_way: { label: 'On the Way',     color: '#0891b2', bg: '#ecfeff' },
    delivered:  { label: 'Delivered',      color: '#16a34a', bg: '#f0fdf4' },
    cancelled:  { label: 'Cancelled',      color: '#ef4444', bg: '#fef2f2' },
}

// Buyer can only cancel when status is one of these
const CANCELLABLE = ['placed', 'processing']

export default function BuyerOrdersPage() {
    const navigate       = useNavigate()
    const [searchParams] = useSearchParams()
    const justPlaced     = searchParams.get('placed') === '1'

    const [orders,     setOrders]     = useState([])
    const [loading,    setLoading]    = useState(true)
    const [cancelling, setCancelling] = useState(null)
    const [errorMsg,   setErrorMsg]   = useState('')

    useEffect(() => { loadOrders() }, [])

    async function loadOrders() {
        setLoading(true)
        const res = await getBuyerOrders()
        if (res.success) setOrders(res.orders)
        setLoading(false)
    }

    async function handleCancel(orderId) {
        if (!window.confirm('Are you sure you want to cancel this order?')) return
        setErrorMsg('')
        setCancelling(orderId)
        try {
            const res = await cancelOrder(orderId)
            if (res.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o))
            } else {
                setErrorMsg(res.message || 'Could not cancel order')
            }
        } catch {
            setErrorMsg('Something went wrong')
        }
        setCancelling(null)
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>

            {/* Navbar */}
            <nav style={{ background: '#fff', borderBottom: '1.5px solid var(--border)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                <Logo size="sm" />
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => navigate('/buyer/dashboard')} style={{ padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>← Shop</button>
                    <button onClick={() => navigate('/buyer/cart')} style={{ padding: '8px 16px', background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: '#7c3aed', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>🛒 Cart</button>
                </div>
            </nav>

            <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>

                {justPlaced && (
                    <div style={{ padding: '16px 20px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 'var(--radius)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>✅</span>
                        <div>
                            <p style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.95rem' }}>Order placed successfully!</p>
                            <p style={{ fontSize: '0.82rem', color: '#166534' }}>You can track or cancel your order below.</p>
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 'var(--radius-sm)', marginBottom: 16, color: '#ef4444', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{errorMsg}</span>
                        <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.1rem', lineHeight: 1 }}>×</button>
                    </div>
                )}

                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: 6 }}>My Orders</h1>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                    You can cancel an order only while it is in <strong>Placed</strong> or <strong>Processing</strong> status. Once the seller starts packing, cancellation is locked.
                </p>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>No orders yet.</p>
                        <button onClick={() => navigate('/buyer/dashboard')} style={{ padding: '12px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Start Shopping</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {orders.map(order => {
                            const st        = STATUS_LABEL[order.status] || STATUS_LABEL.placed
                            const canCancel = CANCELLABLE.includes(order.status)
                            const isLocked  = !canCancel && order.status !== 'cancelled' && order.status !== 'delivered'

                            return (
                                <div key={order._id} style={{
                                    background: '#fff',
                                    border: `1.5px solid ${order.status === 'cancelled' ? '#fecaca' : 'var(--border)'}`,
                                    borderRadius: 'var(--radius)',
                                    padding: '20px 24px',
                                    opacity: order.status === 'cancelled' ? 0.72 : 1,
                                }}>

                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                                                Order ID: <span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{order._id.slice(-10).toUpperCase()}</span>
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span style={{ padding: '5px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                                    </div>

                                    {/* Items */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                                        {order.items.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                <div style={{ width: 44, height: 44, borderRadius: 6, background: '#f3f4f6', overflow: 'hidden', flexShrink: 0 }}>
                                                    {item.image
                                                        ? <img src={fileUrl(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🪨</div>}
                                                </div>
                                                <p style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500 }}>{item.name}</p>
                                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>×{item.quantity}</p>
                                                <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span style={{ marginRight: 12 }}>
                        Payment: <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</strong>
                      </span>
                                            <span>
                        Paid: <strong style={{ color: order.paymentStatus === 'paid' ? '#16a34a' : 'var(--text-muted)' }}>
                          {order.paymentStatus === 'paid' ? 'Yes' : 'Pending'}
                        </strong>
                      </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1rem' }}>₹{order.totalAmount}</span>

                                            {/* Cancellable — show red cancel button */}
                                            {canCancel && (
                                                <button
                                                    onClick={() => handleCancel(order._id)}
                                                    disabled={cancelling === order._id}
                                                    style={{
                                                        padding: '7px 16px', background: '#fef2f2',
                                                        border: '1.5px solid #fecaca', borderRadius: 'var(--radius-sm)',
                                                        fontSize: '0.82rem', fontWeight: 600,
                                                        cursor: cancelling === order._id ? 'not-allowed' : 'pointer',
                                                        color: '#ef4444', fontFamily: "'DM Sans', sans-serif",
                                                        opacity: cancelling === order._id ? 0.6 : 1,
                                                    }}
                                                >
                                                    {cancelling === order._id ? 'Cancelling...' : '✕ Cancel Order'}
                                                </button>
                                            )}

                                            {/* Locked — show lock badge */}
                                            {isLocked && (
                                                <span style={{
                                                    fontSize: '0.78rem', color: '#d97706', fontWeight: 600,
                                                    padding: '5px 12px', background: '#fffbeb',
                                                    border: '1.5px solid #fde68a', borderRadius: 20,
                                                }}>
                          🔒 Cannot cancel
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Lock reason */}
                                    {isLocked && (
                                        <p style={{ fontSize: '0.75rem', color: '#92400e', marginTop: 8, textAlign: 'right' }}>
                                            The seller has already started packing — cancellation is no longer possible.
                                        </p>
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