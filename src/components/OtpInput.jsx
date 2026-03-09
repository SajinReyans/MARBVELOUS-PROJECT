// OtpInput.jsx
// OTP input field with a "Send OTP" button.
// Props:
//   label       — label text (default: 'OTP Verification')
//   optional    — boolean, shows "(if required)" hint
//   value       — controlled OTP value
//   onChange    — change handler for the input
//   onSend      — callback when "Send OTP" is clicked
//   countdown   — number of seconds remaining (0 = show button, >0 = show timer)

import { useState } from 'react'

export default function OtpInput({
  label    = 'OTP Verification',
  optional = false,
  value,
  onChange,
  onSend,
}) {
  const [sent, setSent]           = useState(false)
  const [countdown, setCountdown] = useState(0)

  function handleSend() {
    if (onSend) onSend()
    setSent(true)
    setCountdown(30)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); setSent(false); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
        {label}{' '}
        {optional && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(if required)</span>}
      </label>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={value}
          onChange={onChange}
          maxLength={6}
          style={{
            flex:         1,
            padding:      '11px 14px',
            border:       '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontSize:     '0.88rem',
            fontFamily:   "'DM Sans', sans-serif",
            color:        'var(--text)',
            outline:      'none',
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sent}
          style={{
            padding:      '11px 16px',
            background:   sent ? 'var(--bg)' : 'var(--blue-light)',
            color:        sent ? 'var(--text-muted)' : 'var(--blue)',
            border:       `1.5px solid ${sent ? 'var(--border)' : 'var(--blue)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize:     '0.82rem',
            fontWeight:   600,
            cursor:       sent ? 'not-allowed' : 'pointer',
            whiteSpace:   'nowrap',
            fontFamily:   "'DM Sans', sans-serif",
            transition:   'var(--transition)',
          }}
        >
          {sent ? `Resend in ${countdown}s` : 'Send OTP'}
        </button>
      </div>
    </div>
  )
}
