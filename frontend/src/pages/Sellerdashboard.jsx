// ============================================================
// SELLER DASHBOARD — frontend/src/pages/SellerDashboard.jsx
// This is the SELLER dashboard.
// Only accessible after logging in as a SELLER.
// Route: /seller/dashboard
// ============================================================

import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { getCurrentUser, logout } from '../services/authService'

export default function SellerDashboard() {
    const navigate = useNavigate()
    const user     = getCurrentUser()

    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── Navbar ── */}
            <nav style={{
                background:     '#ffffff',
                borderBottom:   '1.5px solid var(--border)',
                padding:        '0 40px',
                height:         64,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                position:       'sticky',
                top:            0,
                zIndex:         100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Logo size="sm" />
                    <span style={{
                        fontSize:      '0.75rem',
                        fontWeight:    700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color:         '#ffffff',
                        background:    '#7c3aed',
                        padding:       '4px 10px',
                        borderRadius:  20,
                    }}>
            Seller Dashboard
          </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Hello, <strong style={{ color: 'var(--text)' }}>{user?.fullName}</strong>
          </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding:      '8px 18px',
                            background:   'none',
                            border:       '1.5px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize:     '0.85rem',
                            cursor:       'pointer',
                            color:        'var(--text-muted)',
                            fontFamily:   "'DM Sans', sans-serif",
                            transition:   'var(--transition)',
                        }}
                        onMouseEnter={e => e.target.style.borderColor = '#7c3aed'}
                        onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* ── Main Content ── */}
            <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>

                {/* Welcome Banner */}
                <div style={{
                    background:     'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                    borderRadius:   'var(--radius)',
                    padding:        '36px 40px',
                    marginBottom:   32,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    color:          '#ffffff',
                }}>
                    <div>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.8, marginBottom: 8 }}>
                            Seller Dashboard
                        </p>
                        <h1 style={{
                            fontFamily:   "'Cormorant Garamond', serif",
                            fontSize:     '2rem',
                            fontWeight:   600,
                            marginBottom: 8,
                        }}>
                            Welcome, {user?.fullName?.split(' ')[0]}! 🏪
                        </h1>
                        <p style={{ fontSize: '0.92rem', opacity: 0.85 }}>
                            Manage your products, orders and store settings here.
                        </p>
                    </div>
                    <div style={{
                        width:          80,
                        height:         80,
                        borderRadius:   '50%',
                        background:     'rgba(255,255,255,0.15)',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        fontSize:       36,
                        flexShrink:     0,
                    }}>
                        🏪
                    </div>
                </div>

                {/* Account Status Banner */}
                <div style={{
                    background:   '#fff7ed',
                    border:       '1.5px solid #fed7aa',
                    borderRadius: 'var(--radius)',
                    padding:      '20px 28px',
                    marginBottom: 32,
                    display:      'flex',
                    alignItems:   'center',
                    gap:          16,
                }}>
                    <div style={{ fontSize: 24 }}>⏳</div>
                    <div>
                        <p style={{ fontWeight: 700, color: '#92400e', fontSize: '0.92rem', marginBottom: 4 }}>
                            Account Under Review
                        </p>
                        <p style={{ color: '#78350f', fontSize: '0.85rem' }}>
                            Our team is verifying your KYC documents. You will be able to list products once approved within 24-48 hours.
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                    {[
                        { icon: '📦', label: 'My Products', value: '0',  sub: 'No products yet', color: '#7c3aed' },
                        { icon: '🛍️', label: 'Orders',      value: '0',  sub: 'No orders yet',   color: '#2563eb' },
                        { icon: '💰', label: 'Revenue',      value: '₹0', sub: 'Total earned',    color: '#10b981' },
                    ].map(card => (
                        <div key={card.label} style={{
                            background:   '#ffffff',
                            border:       '1.5px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            padding:      '28px 24px',
                            textAlign:    'center',
                            cursor:       'pointer',
                            transition:   'var(--transition)',
                        }}
                             onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                             onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <div style={{ fontSize: 32, marginBottom: 10 }}>{card.icon}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: card.color, marginBottom: 4 }}>{card.value}</div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{card.label}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{card.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Seller Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                    {[
                        { icon: '➕', title: 'Add New Product',    desc: 'List tiles, marbles or fittings',     color: '#f5f3ff' },
                        { icon: '📋', title: 'Manage Listings',    desc: 'Edit or remove your products',        color: '#eff6ff' },
                        { icon: '🛍️', title: 'View Orders',        desc: 'See and manage incoming orders',      color: '#f0fdf4' },
                        { icon: '🏦', title: 'Payment & Bank',     desc: 'View earnings and bank details',      color: '#fefce8' },
                    ].map(action => (
                        <div key={action.title} style={{
                            background:   action.color,
                            border:       '1.5px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            padding:      '24px 28px',
                            display:      'flex',
                            alignItems:   'center',
                            gap:          16,
                            cursor:       'pointer',
                            transition:   'var(--transition)',
                        }}
                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: 32, flexShrink: 0 }}>{action.icon}</div>
                            <div>
                                <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.92rem', marginBottom: 4 }}>{action.title}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{action.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon */}
                <div style={{
                    background:   '#ffffff',
                    border:       '1.5px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding:      '48px 40px',
                    textAlign:    'center',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🪨</div>
                    <h2 style={{
                        fontFamily:   "'Cormorant Garamond', serif",
                        fontSize:     '1.6rem',
                        color:        'var(--text)',
                        marginBottom: 12,
                    }}>
                        Product Listing Coming Soon
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: 400, margin: '0 auto' }}>
                        Once your account is approved you will be able to add and manage your product listings.
                    </p>
                </div>

            </div>
        </div>
    )
}