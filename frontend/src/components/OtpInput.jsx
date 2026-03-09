// components/OtpInput.jsx
// OTP input field with Send OTP button connected to the backend API.
// Props:
//   label    — label text
//   optional — boolean, shows "(if required)"
//   value    — controlled OTP value
//   onChange — change handler for the OTP input
//   email    — email to send OTP to
//   name     — user's name for the email
//   role     — 'buyer' or 'seller'

import { useState } from 'react'
import { sendOTP, verifyOTP } from '../services/otpService'

export default function OtpInput({
                                     label    = 'OTP Verification',
                                     optional = false,
                                     value,
                                     onChange,
                                     email,
                                     name     = 'User',
                                     role     = 'buyer',
                                 }) {
    const [sent, setSent]           = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [sending, setSending]     = useState(false)
    const [error, setError]         = useState('')
    const [success, setSuccess]     = useState('')

    async function handleSend() {
        setError('')
        setSuccess('')

        // Validate email before sending
        if (!email) {
            setError('Please enter your email address first')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        setSending(true)
        const result = await sendOTP(email, name, role)
        setSending(false)

        if (result.success) {
            setSent(true)
            setSuccess(`OTP sent to ${email}`)
            setCountdown(30)

            // Countdown timer
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        setSent(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } else {
            setError(result.message)
        }
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
                    placeholder="Enter OTP sent to your email"
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
                        transition:   'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={sent || sending}
                    style={{
                        padding:      '11px 16px',
                        background:   sent || sending ? 'var(--bg)' : 'var(--blue-light)',
                        color:        sent || sending ? 'var(--text-muted)' : 'var(--blue)',
                        border:       `1.5px solid ${sent || sending ? 'var(--border)' : 'var(--blue)'}`,
                        borderRadius: 'var(--radius-sm)',
                        fontSize:     '0.82rem',
                        fontWeight:   600,
                        cursor:       sent || sending ? 'not-allowed' : 'pointer',
                        whiteSpace:   'nowrap',
                        fontFamily:   "'DM Sans', sans-serif",
                        transition:   'var(--transition)',
                    }}
                >
                    {sending ? 'Sending...' : sent ? `Resend in ${countdown}s` : 'Send OTP'}
                </button>
            </div>

            {/* Success message */}
            {success && (
                <p style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: 2 }}>
                    ✓ {success}
                </p>
            )}

            {/* Error message */}
            {error && (
                <p style={{ fontSize: '0.78rem', color: 'var(--error)', marginTop: 2 }}>
                    {error}
                </p>
            )}
        </div>
    )
}