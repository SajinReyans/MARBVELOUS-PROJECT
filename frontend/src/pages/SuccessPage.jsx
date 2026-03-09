// SuccessPage.jsx
// Shown after successful account creation or login.
// Displays a confirmation message and a button to go to the homepage.

import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function SuccessPage() {
  const navigate = useNavigate()
  const role     = sessionStorage.getItem('marbvelous_role') || 'buyer'

  const message = role === 'buyer'
    ? 'Your customer account is ready. Start exploring premium tiles and marbles.'
      : "Your seller account is under review. You'll hear from us within 24 hours."
  return (
    <div
      className="page-enter"
      style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--white)',
      }}
    >
      <div style={{
        textAlign:     'center',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           16,
        maxWidth:      400,
        padding:       '0 24px',
      }}>
        {/* Animated tick */}
        <div style={{
          width:          80,
          height:         80,
          background:     '#ecfdf5',
          borderRadius:   '50%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '2.2rem',
          animation:      'popIn 0.5s cubic-bezier(.22,1,.36,1)',
        }}>
          ✓
        </div>

        <Logo size="sm" />

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize:   '2rem',
          fontWeight: 600,
        }}>
          You're all set!
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          {message}
        </p>

        <button
          onClick={() => navigate('/')}
          style={{
            marginTop:    8,
            padding:      '14px 40px',
            background:   'var(--blue)',
            color:        'white',
            border:       'none',
            borderRadius: 'var(--radius-sm)',
            fontSize:     '0.95rem',
            fontWeight:   600,
            cursor:       'pointer',
            fontFamily:   "'DM Sans', sans-serif",
            transition:   'var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-dark)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}
        >
          Go to Homepage →
        </button>
      </div>
    </div>
  )
}
