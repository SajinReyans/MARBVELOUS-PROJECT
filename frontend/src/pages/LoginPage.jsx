// pages/LoginPage.jsx
// Login screen connected to the backend API.
// Calls buyerLogin or sellerLogin based on the selected role.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo             from '../components/Logo'
import OtpInput         from '../components/OtpInput'
import { buyerLogin, sellerLogin } from '../services/authService'

export default function LoginPage() {
  const navigate  = useNavigate()
  const role      = sessionStorage.getItem('marbvelous_role') || 'buyer'
  const roleLabel = role === 'buyer' ? 'Customer' : 'Seller'

  const [form, setForm]     = useState({ identifier: '', password: '', otp: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleLogin() {
    setError('')

    if (!form.identifier || !form.password) {
      setError('Please enter your email/mobile and password')
      return
    }

    setLoading(true)
    const result = role === 'buyer'
        ? await buyerLogin(form.identifier, form.password)
        : await sellerLogin(form.identifier, form.password)
    setLoading(false)

    if (result.success) {
      navigate('/success')
    } else {
      setError(result.message)
    }
  }

  const inputStyle = {
    padding: '11px 14px', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '0.88rem',
    fontFamily: "'DM Sans', sans-serif", color: 'var(--text)',
    background: 'var(--white)', outline: 'none', width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const focusStyle = e => {
    e.target.style.borderColor = 'var(--blue)'
    e.target.style.boxShadow   = '0 0 0 3px rgba(74,144,217,0.12)'
  }
  const blurStyle = e => {
    e.target.style.borderColor = 'var(--border)'
    e.target.style.boxShadow   = 'none'
  }

  return (
      <div className="page-enter" style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--white)', position: 'relative',
      }}>
        <button onClick={() => navigate('/auth')} style={{
          position: 'absolute', top: 24, left: 24,
          background: 'none', border: 'none',
          color: 'var(--text-muted)', fontSize: '0.85rem',
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>
          ← Back
        </button>

        <div style={{
          width: '100%', maxWidth: 440, padding: '48px 40px',
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border)', boxShadow: 'var(--shadow)',
          display: 'flex', flexDirection: 'column', gap: 20, margin: '0 16px',
        }}>
          <Logo size="sm" />

          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 600 }}>
              Login
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
              Logging in as {roleLabel}
            </p>
          </div>

          {/* Error message */}
          {error && (
              <div style={{
                padding: '10px 14px', background: '#fef2f2',
                border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)',
                color: 'var(--error)', fontSize: '0.85rem',
              }}>
                {error}
              </div>
          )}

          {/* Email / Mobile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email or Mobile Number</label>
            <input
                type="text" placeholder="Enter email or mobile number"
                value={form.identifier} onChange={set('identifier')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Password</label>
            <input
                type="password" placeholder="Enter your password"
                value={form.password} onChange={set('password')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--blue)', alignSelf: 'flex-end', cursor: 'pointer' }}>
            Forgot password?
          </span>
          </div>

          {/* OTP */}
          <OtpInput label="OTP Verification" optional value={form.otp} onChange={set('otp')} />

          {/* Submit */}
          <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? 'var(--border)' : 'var(--blue)',
                color: loading ? 'var(--text-muted)' : 'white',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif", marginTop: 4,
                transition: 'var(--transition)',
              }}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />or
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <span
                style={{ color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => navigate(role === 'buyer' ? '/signup/buyer' : '/signup/seller')}
            >
            Sign Up
          </span>
          </p>
        </div>
      </div>
  )
}