// ============================================================
// BUYER DASHBOARD — frontend/src/pages/BuyerDashboard.jsx
// This is the CUSTOMER dashboard.
// Only accessible after logging in as a BUYER.
// Route: /buyer/dashboard
// ============================================================

import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { getCurrentUser, logout } from '../services/authService'

export default function BuyerDashboard() {
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
                        background:    'var(--blue)',
                        padding:       '4px 10px',
                        borderRadius:  20,
                    }}>
            Customer Dashboard
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
                        onMouseEnter={e => e.target.style.borderColor = 'var(--blue)'}
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
                    background:     'linear-gradient(135deg, #4A90D9 0%, #2d6fad 100%)',
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
                            Customer Dashboard
                        </p>
                        <h1 style={{
                            fontFamily:   "'Cormorant Garamond', serif",
                            fontSize:     '2rem',
                            fontWeight:   600,
                            marginBottom: 8,
                        }}>
                            Welcome back, {user?.fullName?.split(' ')[0]}! 👋
                        </h1>
                        <p style={{ fontSize: '0.92rem', opacity: 0.85 }}>
                            Browse premium tiles, marbles, faucets, sinks and plumbing tools.
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
                        🛒
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                    {[
                        { icon: '📦', label: 'My Orders',     value: '0',  sub: 'No orders yet',   color: '#3b82f6' },
                        { icon: '❤️', label: 'Wishlist',       value: '0',  sub: 'Nothing saved',   color: '#ef4444' },
                        { icon: '📍', label: 'Saved Address',  value: '1',  sub: 'Address on file', color: '#10b981' },
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
                             onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
                             onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <div style={{ fontSize: 32, marginBottom: 10 }}>{card.icon}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: card.color, marginBottom: 4 }}>{card.value}</div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{card.label}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{card.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                    {[
                        { icon: '🪨', title: 'Browse Tiles & Marbles', desc: 'Explore our premium collection',  color: '#eff6ff' },
                        { icon: '🚿', title: 'Faucets & Sinks',        desc: 'Premium bathroom fittings',       color: '#f0fdf4' },
                        { icon: '🔧', title: 'Plumbing Tools',         desc: 'Professional grade tools',        color: '#fefce8' },
                        { icon: '📋', title: 'Track My Orders',        desc: 'View order status and history',   color: '#fdf4ff' },
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
                        Products Coming Soon
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: 400, margin: '0 auto' }}>
                        We are stocking up on premium tiles, marbles, faucets, sinks and plumbing tools. Check back soon!
                    </p>
                </div>

            </div>
        </div>
    )
}