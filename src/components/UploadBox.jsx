// UploadBox.jsx
// Dashed upload area for document/file uploads.
// Props:
//   label    — field label
//   optional — boolean, shows "(optional)"
//   icon     — emoji icon (default: '📄')
//   hint     — helper text shown inside the box
//   accept   — file types string e.g. ".pdf,.jpg"
//   onChange — callback with the selected File object

import { useRef, useState } from 'react'

export default function UploadBox({
  label,
  optional = false,
  icon     = '📄',
  hint     = 'Click to upload',
  accept   = '.pdf,.jpg,.jpeg,.png',
  onChange,
}) {
  const inputRef          = useRef(null)
  const [fileName, setFileName] = useState(null)
  const [hovered, setHovered]   = useState(false)

  function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    if (onChange) onChange(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
          {label}{' '}
          {optional && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>}
        </label>
      )}

      <div
        onClick={() => inputRef.current.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border:        `1.5px dashed ${hovered ? 'var(--blue)' : 'var(--border)'}`,
          borderRadius:  'var(--radius-sm)',
          padding:       '18px 16px',
          textAlign:     'center',
          cursor:        'pointer',
          background:    hovered ? 'var(--blue-light)' : 'var(--bg)',
          transition:    'var(--transition)',
        }}
      >
        <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{icon}</div>
        {fileName ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--blue)', fontWeight: 600 }}>✓ {fileName}</p>
        ) : (
          <p style={{ fontSize: '0.82rem', color: hovered ? 'var(--blue)' : 'var(--text-muted)' }}>{hint}</p>
        )}
        <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: 4 }}>PDF, JPG or PNG</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
