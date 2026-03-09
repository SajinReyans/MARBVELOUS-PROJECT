// Logo.jsx
// Displays the Marbvelous logo with the highlighted "M" in Stone Blue.
// Props:
//   size  — 'sm' | 'md' | 'lg'  (default: 'md')
//   light — boolean, renders white text for dark backgrounds (default: false)

const sizes = {
  sm: '1.5rem',
  md: '2.2rem',
  lg: '3.6rem',
}

export default function Logo({ size = 'md', light = false }) {
  const fontSize = sizes[size] ?? sizes.md
  const color    = light ? 'rgba(255,255,255,0.85)' : 'var(--text)'
  const mColor   = light ? 'white' : 'var(--blue)'

  return (
    <span
      style={{
        fontFamily:  "'Cormorant Garamond', serif",
        fontSize,
        fontWeight:  700,
        letterSpacing: '-0.5px',
        color,
        userSelect: 'none',
      }}
    >
      <span style={{ color: mColor }}>M</span>arbvelous
    </span>
  )
}
