// LoginPage.jsx
// Login screen shared by both Customer and Seller.
// Reads role from sessionStorage and labels accordingly.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo      from '../components/Logo'
import FormInput from '../components/FormInput'
import OtpInput  from '../components/OtpInput'

export default function LoginPage() {
  const navigate  = useNavigate()
  const role      = sessionStorage.getItem('marbvelous_role') || 'buyer'
  const roleLabel = role === 'buyer' ? 'Customer' : 'Seller'

  const [form, setForm] = useState({ identifier: '', password: '', otp: '' })

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  function handleLogin() {
    // TODO: connect to backend auth API
    navigate('/success')
  }

  const inputStyle = {
    padding: '11px 14px', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '0.88rem',
    fontFamily: "'DM Sans', sans-serif", color: 'var(--text)',
    background: 'var(--white)', outline: 'none', width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--white)', position: 'relative',
      }}
    >
      <button
        onClick={() => navigate('/auth')}
        style={{
          position: 'absolute', top: 24, left: 24,
          background: 'none', border: 'none',
          color: 'var(--text-muted)', fontSize: '0.85rem',
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}
      >
        ← Back
      </button>

      <div style={{
        width: '100%', maxWidth: 440,
        padding: '48px 40px',
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--shadow)',
        display: 'flex', flexDirection: 'column', gap: 20,
        margin: '0 16px',
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

        {/* Email / Mobile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email or Mobile Number</label>
          <input
            type="text"
            placeholder="Enter email or mobile number"
            value={form.identifier}
            onChange={set('identifier')}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)' }}
            onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={set('password')}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(74,144,217,0.12)' }}
            onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
          />
          <span
            style={{ fontSize: '0.8rem', color: 'var(--blue)', alignSelf: 'flex-end', cursor: 'pointer' }}
            onClick={() => {/* TODO: forgot password flow */}}
          >
            Forgot password?
          </span>
        </div>

        {/* OTP */}
        <OtpInput
          label="OTP Verification"
          optional
          value={form.otp}
          onChange={set('otp')}
        />

        {/* Submit */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '14px',
            background: 'var(--blue)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-sm)',
            fontSize: '0.95rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            marginTop: 4,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-dark)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}
        >
          Login →
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          or
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
