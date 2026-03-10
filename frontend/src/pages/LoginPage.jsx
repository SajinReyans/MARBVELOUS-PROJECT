// pages/LoginPage.jsx
// Login page for both buyers and sellers.
// After login, redirects to /buyer/dashboard or /seller/dashboard based on role.

import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import Logo            from '../components/Logo'
import { buyerLogin, sellerLogin, getRedirectPath } from '../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()

  const [role, setRole]           = useState('buyer')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  async function handleLogin() {
    setError('')

    if (!identifier || !password) {
      setError('Please enter your email/mobile and password')
      return
    }

    setLoading(true)
    const result = role === 'seller'
        ? await sellerLogin(identifier, password)
        : await buyerLogin(identifier, password)
    setLoading(false)

    if (result.success) {
      navigate(getRedirectPath(result.role))
    } else {
      setError(result.message)
    }
  }

  const inputStyle = {
    width:        '100%',
    padding:      '12px 14px',
    border:       '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize:     '0.88rem',
    fontFamily:   "'DM Sans', sans-serif",
    color:        'var(--text)',
    outline:      'none',
    boxSizing:    'border-box',
    transition:   'border-color 0.2s',
  }

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
          maxWidth:     440,
          background:   '#ffffff',
          borderRadius: 'var(--radius)',
          border:       '1.5px solid var(--border)',
          padding:      '40px 36px',
          boxShadow:    '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          {/* Logo */}
          <div style={{ marginBottom: 28 }}>
            <Logo size="sm" />
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize:   '1.8rem',
            fontWeight: 600,
            color:      'var(--text)',
            marginBottom: 6,
          }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 28 }}>
            Sign in to your Marbvelous account
          </p>

          {/* Role Toggle */}
          <div style={{
            display:      'flex',
            background:   'var(--bg)',
            borderRadius: 'var(--radius-sm)',
            padding:      4,
            marginBottom: 24,
            border:       '1.5px solid var(--border)',
          }}>
            {['buyer', 'seller'].map(r => (
                <button
                    key={r}
                    onClick={() => { setRole(r); setError('') }}
                    style={{
                      flex:         1,
                      padding:      '9px 0',
                      border:       'none',
                      borderRadius: 'calc(var(--radius-sm) - 2px)',
                      background:   role === r ? 'var(--blue)'  : 'transparent',
                      color:        role === r ? '#ffffff'       : 'var(--text-muted)',
                      fontWeight:   role === r ? 600             : 400,
                      fontSize:     '0.85rem',
                      cursor:       'pointer',
                      fontFamily:   "'DM Sans', sans-serif",
                      transition:   'var(--transition)',
                      textTransform: 'capitalize',
                    }}
                >
                  {r === 'buyer' ? 'Customer' : 'Seller'}
                </button>
            ))}
          </div>

          {/* Error */}
          {error && (
              <div style={{
                padding:      '10px 14px',
                background:   '#fef2f2',
                border:       '1px solid #fecaca',
                borderRadius: 'var(--radius-sm)',
                color:        'var(--error)',
                fontSize:     '0.85rem',
                marginBottom: 16,
              }}>
                {error}
              </div>
          )}

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>
                Email or Mobile
              </label>
              <input
                  type="text"
                  placeholder="you@example.com or 9XXXXXXXXX"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  style={inputStyle}
                  onFocus={e  => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e   => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={inputStyle}
                  onFocus={e  => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e   => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width:        '100%',
                padding:      '13px 0',
                marginTop:    24,
                background:   loading ? 'var(--border)' : 'var(--blue)',
                color:        loading ? 'var(--text-muted)' : '#ffffff',
                border:       'none',
                borderRadius: 'var(--radius-sm)',
                fontSize:     '0.95rem',
                fontWeight:   600,
                cursor:       loading ? 'not-allowed' : 'pointer',
                fontFamily:   "'DM Sans', sans-serif",
                transition:   'var(--transition)',
              }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <span
                onClick={() => navigate('/auth')}
                style={{ color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }}
            >
            Sign up
          </span>
          </p>

          <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem' }}>
          <span
              onClick={() => navigate('/')}
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            ← Back to home
          </span>
          </p>
        </div>
      </div>
  )
}