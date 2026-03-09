// AuthChoicePage.jsx
// Shown after role selection. Lets the user choose to Login or Sign Up.
// Reads role from sessionStorage and shows the correct badge.

import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function AuthChoicePage() {
  const navigate = useNavigate()
  const role     = sessionStorage.getItem('marbvelous_role') || 'buyer'
  const isbuyer  = role === 'buyer'
  const roleLabel = isbuyer ? 'Customer' : 'Seller'

  function goLogin()  { navigate('/login') }
  function goSignup() { navigate(isbuyer ? '/signup/buyer' : '/signup/seller') }

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'var(--white)',
      position:       'relative',
    }}
    className="page-enter"
    >
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        style={{
          position:   'absolute', top: 24, left: 24,
          background: 'none', border: 'none',
          color:      'var(--text-muted)', fontSize: '0.85rem',
          cursor:     'pointer', fontFamily: "'DM Sans', sans-serif",
        }}
      >
        ← Back
      </button>

      {/* Card */}
      <div style={{
        width:         '100%',
        maxWidth:      440,
        padding:       '48px 40px',
        background:    'var(--white)',
        borderRadius:  'var(--radius-lg)',
        border:        '1.5px solid var(--border)',
        boxShadow:     'var(--shadow)',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           28,
        margin:        '0 16px',
      }}>
        <Logo size="sm" />

        {/* Role badge */}
        <span style={{
          padding:       '6px 16px',
          background:    'var(--blue-light)',
          color:         'var(--blue)',
          borderRadius:  99,
          fontSize:      '0.78rem',
          fontWeight:    600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {roleLabel}
        </span>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 600 }}>
            Welcome
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 6 }}>
            Login to your account or create a new one
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <button
            onClick={goLogin}
            style={{
              width: '100%', padding: '14px',
              background: 'var(--blue)', color: 'white',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}
          >
            Login to Account
          </button>

          <button
            onClick={goSignup}
            style={{
              width: '100%', padding: '14px',
              background: 'transparent', color: 'var(--blue)',
              border: '1.5px solid var(--blue)', borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  )
}
