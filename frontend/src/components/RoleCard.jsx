// RoleCard.jsx
// Clickable card for selecting user role on the Landing page.
// Props:
//   icon    — emoji or element shown in the icon box
//   title   — card heading
//   desc    — short description text
//   accent  — background color for the icon box
//   onClick — callback when card is clicked

import { useState } from 'react'

export default function RoleCard({ icon, title, desc, accent = '#e8f2fc', onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:        200,
        background:   'var(--white)',
        border:       `1.5px solid ${hovered ? 'var(--blue)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding:      '28px 20px',
        display:      'flex',
        flexDirection:'column',
        alignItems:   'center',
        gap:          12,
        cursor:       'pointer',
        transition:   'var(--transition)',
        boxShadow:    hovered ? 'var(--shadow-lg)' : 'var(--shadow)',
        transform:    hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Icon box */}
      <div style={{
        width:        52,
        height:       52,
        borderRadius: 14,
        background:   accent,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        fontSize:     '1.6rem',
      }}>
        {icon}
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
      <p  style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
        {desc}
      </p>
    </div>
  )
}
