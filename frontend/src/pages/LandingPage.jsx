// LandingPage.jsx
// First screen the user sees.
// Shows the Marbvelous logo with entrance animation,
// tagline, and two role cards (Customer / Seller).
// Navigates to /auth and stores selected role in sessionStorage.

import { useNavigate } from 'react-router-dom'
import RoleCard from '../components/RoleCard'

export default function LandingPage() {
  const navigate = useNavigate()

  function selectRole(role) {
    sessionStorage.setItem('marbvelous_role', role)
    navigate('/auth')
  }

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'var(--white)',
      position:       'relative',
      overflow:       'hidden',
    }}>

      {/* Decorative background blobs */}
      <div style={{
        position:   'absolute', top: -120, right: -120,
        width: 420, height: 420,
        background: 'radial-gradient(circle, #e8f2fc 0%, transparent 70%)',
        zIndex: 0,
      }} />
      <div style={{
        position:   'absolute', bottom: -100, left: -100,
        width: 350, height: 350,
        background: 'radial-gradient(circle, #f0f7ff 0%, transparent 70%)',
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{
        zIndex:        1,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
      }}>

        {/* Animated logo */}
        <div style={{ animation: 'logoReveal 1.2s cubic-bezier(.22,1,.36,1) 0.3s both' }}>
          <style>{`
            @keyframes logoReveal {
              from { opacity: 0; transform: scale(0.7) translateY(20px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
          <span style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      '3.6rem',
            fontWeight:    700,
            letterSpacing: '-0.5px',
            color:         'var(--text)',
          }}>
            <span style={{ color: 'var(--blue)' }}>M</span>arbvelous
          </span>
        </div>

        {/* Tagline */}
        <p style={{
          animation:     'fadeUp 0.8s ease 1.6s both',
          fontSize:      '1rem',
          color:         'var(--text-muted)',
          fontWeight:    400,
          marginTop:     10,
          letterSpacing: '0.04em',
        }}>
          Premium Tiles, Marbles & More — Delivered to Your Door
        </p>

        {/* Role selection */}
        <div style={{
          animation:     'fadeUp 0.8s ease 2.2s both',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          marginTop:     52,
          gap:           16,
        }}>
          <p style={{
            fontSize:      '0.78rem',
            color:         'var(--text-muted)',
            fontWeight:    600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            Who are you?
          </p>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <RoleCard
              icon="🛒"
              title="Customer"
              desc="Browse and buy tiles, marbles, faucets & more"
              accent="var(--blue-light)"
              onClick={() => selectRole('buyer')}
            />
            <RoleCard
              icon="🏪"
              title="Seller"
              desc="List your products and grow your business"
              accent="#f0fdf4"
              onClick={() => selectRole('seller')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
