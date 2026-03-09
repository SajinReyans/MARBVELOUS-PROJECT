// FormInput.jsx
// Reusable labelled input/select field used across all forms.
// Props:
//   label       — field label text
//   optional    — boolean, appends "(optional)" to label
//   type        — input type (text, email, password, tel, date) or 'select'
//   placeholder — placeholder text
//   value       — controlled value
//   onChange    — change handler
//   options     — array of strings, used when type === 'select'
//   fullWidth   — boolean, spans full grid width (default false)
//   children    — render anything custom inside the field wrapper

export default function FormInput({
  label,
  optional   = false,
  type       = 'text',
  placeholder,
  value,
  onChange,
  options    = [],
  fullWidth  = false,
  children,
  ...rest
}) {
  const sharedStyle = {
    padding:      '11px 14px',
    border:       '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize:     '0.88rem',
    fontFamily:   "'DM Sans', sans-serif",
    color:        'var(--text)',
    background:   'var(--white)',
    outline:      'none',
    width:        '100%',
    transition:   'border-color 0.2s, box-shadow 0.2s',
  }

  const handleFocus = e => {
    e.target.style.borderColor = 'var(--blue)'
    e.target.style.boxShadow   = '0 0 0 3px rgba(74,144,217,0.12)'
  }
  const handleBlur = e => {
    e.target.style.borderColor = 'var(--border)'
    e.target.style.boxShadow   = 'none'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: fullWidth ? '1 / -1' : undefined }}>
      {label && (
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
          {label}{' '}
          {optional && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>}
        </label>
      )}

      {children ? children : type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          style={sharedStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        >
          <option value="">Select...</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={sharedStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      )}
    </div>
  )
}
