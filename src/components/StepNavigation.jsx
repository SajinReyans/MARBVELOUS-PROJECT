// StepNavigation.jsx
// Next / Back / Submit button row shown at the bottom of each form step.
// Props:
//   onBack      — callback for Back button (omit to hide Back)
//   onNext      — callback for Next / Submit button
//   nextLabel   — button label (default: 'Next')
//   isLastStep  — boolean, changes button color to green on final step
//   loading     — boolean, disables button and shows loading state

export default function StepNavigation({
  onBack,
  onNext,
  nextLabel  = 'Next',
  isLastStep = false,
  loading    = false,
}) {
  return (
    <div style={{
      display:       'flex',
      justifyContent:'space-between',
      alignItems:    'center',
      marginTop:     36,
      paddingTop:    24,
      borderTop:     '1px solid var(--border)',
    }}>
      {/* Back button — hidden on first step */}
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          style={{
            background:  'none',
            border:      'none',
            color:       'var(--text-muted)',
            fontSize:    '0.88rem',
            cursor:      'pointer',
            display:     'flex',
            alignItems:  'center',
            gap:         6,
            fontFamily:  "'DM Sans', sans-serif",
            transition:  'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ← Back
        </button>
      ) : <span />}

      {/* Next / Submit button */}
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        style={{
          padding:      '12px 28px',
          background:   loading ? 'var(--border)' : isLastStep ? 'var(--success)' : 'var(--blue)',
          color:        loading ? 'var(--text-muted)' : 'white',
          border:       'none',
          borderRadius: 'var(--radius-sm)',
          fontSize:     '0.9rem',
          fontWeight:   600,
          cursor:       loading ? 'not-allowed' : 'pointer',
          transition:   'var(--transition)',
          fontFamily:   "'DM Sans', sans-serif",
          display:      'flex',
          alignItems:   'center',
          gap:          8,
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {loading ? 'Please wait...' : nextLabel}
        {!loading && !isLastStep && <span>→</span>}
        {!loading &&  isLastStep && <span>✓</span>}
      </button>
    </div>
  )
}
