// FormSidebar.jsx
// Left sidebar shown on multi-step signup forms.
// Shows step list, progress bar, and current step indicator.
// Props:
//   steps       — array of { title, sub } objects
//   currentStep — 0-based index of the active step

import Logo from './Logo'

export default function FormSidebar({ steps = [], currentStep = 0 }) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <div style={{
      width:      300,
      minHeight:  '100vh',
      background: 'linear-gradient(160deg, var(--blue) 0%, var(--blue-dark) 100%)',
      padding:    '40px 32px',
      display:    'flex',
      flexDirection: 'column',
      gap:        36,
      flexShrink: 0,
    }}>
      <Logo size="md" light />

      {/* Step list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {steps.map((step, i) => {
          const isActive = i === currentStep
          const isDone   = i < currentStep

          return (
            <div
              key={i}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          12,
                padding:      '10px 14px',
                borderRadius: 10,
                background:   isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                opacity:      isDone   ? 0.65 : 1,
                transition:   'var(--transition)',
              }}
            >
              {/* Step number bubble */}
              <div style={{
                width:           28,
                height:          28,
                borderRadius:    '50%',
                background:      isActive ? 'white' : 'rgba(255,255,255,0.2)',
                color:           isActive ? 'var(--blue)' : 'white',
                fontSize:        '0.72rem',
                fontWeight:      700,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                flexShrink:      0,
                transition:      'var(--transition)',
              }}>
                {isDone ? '✓' : i + 1}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                  {step.title}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginTop: 1 }}>
                  {step.sub}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          height:       3,
          background:   'rgba(255,255,255,0.2)',
          borderRadius: 99,
          overflow:     'hidden',
        }}>
          <div style={{
            height:     '100%',
            width:      `${progress}%`,
            background: 'white',
            borderRadius: 99,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: 8 }}>
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  )
}
