// pages/SuccessPage.jsx
// Shown after successful signup.
// Automatically redirects to the correct dashboard based on role.

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { getCurrentUser, getRedirectPath } from '../services/authService'

export default function SuccessPage() {
    const navigate = useNavigate()
    const user     = getCurrentUser()

    // Auto-redirect after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user?.role) {
                navigate(getRedirectPath(user.role))
            } else {
                navigate('/')
            }
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    function handleGoNow() {
        if (user?.role) {
            navigate(getRedirectPath(user.role))
        } else {
            navigate('/')
        }
    }

    const isSeller = user?.role === 'seller'

    return (
        <div className="page-enter" style={{
            minHeight:      '100vh',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'var(--bg)',
            padding:        '24px',
        }}>
            <div style={{
                width:        '100%',
                maxWidth:     480,
                background:   '#ffffff',
                borderRadius: 'var(--radius)',
                border:       '1.5px solid var(--border)',
                padding:      '48px 40px',
                textAlign:    'center',
                boxShadow:    '0 4px 24px rgba(0,0,0,0.06)',
            }}>
                {/* Logo */}
                <div style={{ marginBottom: 32 }}>
                    <Logo size="sm" />
                </div>

                {/* Success Icon */}
                <div style={{
                    width:          64,
                    height:         64,
                    borderRadius:   '50%',
                    background:     'var(--blue-light)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    margin:         '0 auto 24px',
                    fontSize:       28,
                }}>
                    ✓
                </div>

                {/* Title */}
                <h2 style={{
                    fontFamily:   "'Cormorant Garamond', serif",
                    fontSize:     '2rem',
                    fontWeight:   600,
                    color:        'var(--text)',
                    marginBottom: 12,
                }}>
                    Account Created!
                </h2>

                {/* Message */}
                {isSeller ? (
                    <>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 8 }}>
                            Welcome to Marbvelous, <strong>{user?.fullName}</strong>!
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 32 }}>
                            Your seller account is under review. Our team will verify your documents within 24-48 hours and notify you by email once approved.
                        </p>
                    </>
                ) : (
                    <>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 8 }}>
                            Welcome to Marbvelous, <strong>{user?.fullName}</strong>!
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 32 }}>
                            You can now browse and buy premium tiles, marbles, faucets, sinks and plumbing tools.
                        </p>
                    </>
                )}

                {/* CTA Button */}
                <button
                    onClick={handleGoNow}
                    style={{
                        width:        '100%',
                        padding:      '13px 0',
                        background:   'var(--blue)',
                        color:        '#ffffff',
                        border:       'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize:     '0.95rem',
                        fontWeight:   600,
                        cursor:       'pointer',
                        fontFamily:   "'DM Sans', sans-serif",
                        transition:   'var(--transition)',
                        marginBottom: 12,
                    }}
                >
                    {isSeller ? 'Go to Seller Dashboard →' : 'Start Shopping →'}
                </button>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Redirecting automatically in 3 seconds...
                </p>
            </div>
        </div>
    )
}