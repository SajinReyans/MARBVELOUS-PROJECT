// ============================================================
// SELLER DASHBOARD — frontend/src/pages/SellerDashboard.jsx
// This is the SELLER dashboard — the main hub page.
// Only accessible after logging in as a SELLER.
// Route: /seller/dashboard
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import Logo                    from '../components/Logo'
import { getCurrentUser, logout } from '../services/authService'
import { getMyStore, getMyProducts, getFileUrl } from '../services/sellerService'

export default function SellerDashboard() {
    const navigate = useNavigate()
    const user     = getCurrentUser()

    const [store,    setStore]    = useState(null)
    const [products, setProducts] = useState([])
    const [loading,  setLoading]  = useState(true)

    useEffect(() => {
        async function load() {
            const [storeRes, prodRes] = await Promise.all([getMyStore(), getMyProducts()])
            if (storeRes.success)  setStore(storeRes.store)
            if (prodRes.success)   setProducts(prodRes.products)
            setLoading(false)
        }
        load()
    }, [])

    function handleLogout() { logout(); navigate('/') }

    function copyStoreLink() {
        if (store?.slug) {
            navigator.clipboard.writeText(`${window.location.origin}/store/${store.slug}`)
            alert('Store link copied!')
        } else {
            alert('Set your store name first to get a shareable link.')
        }
    }

    const totalRevenue = products.reduce((sum, p) => sum + ((p.discountedPrice || p.price) * 0), 0)

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── Navbar ── */}
            <nav style={{
                background: '#ffffff', borderBottom: '1.5px solid var(--border)',
                padding: '0 40px', height: 64, display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Logo size="sm" />
                    <span style={{
                        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.1em', color: '#ffffff', background: '#7c3aed',
                        padding: '4px 10px', borderRadius: 20,
                    }}>Seller Dashboard</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Hello, <strong style={{ color: 'var(--text)' }}>{user?.fullName}</strong>
          </span>
                    <button onClick={handleLogout} style={{
                        padding: '8px 18px', background: 'none', border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                        color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
                    }}>Logout</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>

                {/* ── Welcome Banner ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                    borderRadius: 'var(--radius)', padding: '32px 40px', marginBottom: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ffffff',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        {/* Store Logo */}
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 32, overflow: 'hidden', flexShrink: 0,
                        }}>
                            {store?.logo
                                ? <img src={getFileUrl(store.logo)} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : '🏪'}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.8, marginBottom: 4 }}>
                                Seller Dashboard
                            </p>
                            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, marginBottom: 4 }}>
                                {store?.storeName || user?.fullName + "'s Store"}
                            </h1>
                            {store?.tagline && <p style={{ fontSize: '0.88rem', opacity: 0.85 }}>{store.tagline}</p>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                        <button onClick={copyStoreLink} style={{
                            padding: '9px 16px', background: 'rgba(255,255,255,0.15)',
                            border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)',
                            color: '#ffffff', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>🔗 Share Store</button>
                        <button onClick={() => navigate('/seller/store')} style={{
                            padding: '9px 16px', background: '#ffffff',
                            border: 'none', borderRadius: 'var(--radius-sm)',
                            color: '#7c3aed', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>✏️ Edit Store</button>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
                    {[
                        { icon: '📦', label: 'Products',  value: products.length, color: '#7c3aed' },
                        { icon: '🛍️', label: 'Orders',    value: '0',             color: '#2563eb' },
                        { icon: '💰', label: 'Revenue',   value: '₹0',            color: '#10b981' },
                        { icon: '⭐', label: 'Rating',    value: '—',             color: '#f59e0b' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: '#ffffff', border: '1.5px solid var(--border)',
                            borderRadius: 'var(--radius)', padding: '20px 16px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Quick Actions ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
                    {[
                        { icon: '➕', title: 'Add New Product',  desc: 'List a new product in your store',      path: '/seller/products', color: '#f5f3ff', border: '#ddd6fe' },
                        { icon: '📦', title: 'Manage Products',  desc: 'Edit, update or delete your listings',  path: '/seller/products', color: '#eff6ff', border: '#bfdbfe' },
                        { icon: '🏪', title: 'Edit Store',       desc: 'Update your store name, logo and info', path: '/seller/store',    color: '#fdf4ff', border: '#e9d5ff' },
                        { icon: '👤', title: 'Edit Profile',     desc: 'Update contact details and address',    path: '/seller/profile',  color: '#f0fdf4', border: '#bbf7d0' },
                    ].map(action => (
                        <div key={action.title}
                             onClick={() => navigate(action.path)}
                             style={{
                                 background: action.color, border: `1.5px solid ${action.border}`,
                                 borderRadius: 'var(--radius)', padding: '20px 24px',
                                 display: 'flex', alignItems: 'center', gap: 16,
                                 cursor: 'pointer', transition: 'transform 0.15s',
                             }}
                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: 30, flexShrink: 0 }}>{action.icon}</div>
                            <div>
                                <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.92rem', marginBottom: 4 }}>{action.title}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{action.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Recent Products ── */}
                <div style={{ background: '#ffffff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--text)' }}>My Products</h2>
                        <button onClick={() => navigate('/seller/products')} style={{
                            padding: '8px 16px', background: '#7c3aed', color: '#ffffff',
                            border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
                            fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>+ Add Product</button>
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Loading...</p>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px 0' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🪨</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>No products yet. Add your first product!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                            {products.slice(0, 6).map(p => (
                                <div key={p._id} style={{
                                    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                                }}>
                                    <div style={{ height: 120, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {p.images?.[0]
                                            ? <img src={getFileUrl(p.images[0])} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <span style={{ fontSize: 36 }}>🪨</span>}
                                    </div>
                                    <div style={{ padding: '12px' }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)', marginBottom: 4 }}>{p.name}</p>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '0.9rem' }}>₹{p.discountedPrice}</span>
                                            {p.discount > 0 && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.price}</span>}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Stock: {p.stock}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}