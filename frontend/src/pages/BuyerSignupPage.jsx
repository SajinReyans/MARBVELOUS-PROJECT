// pages/BuyerSignupPage.jsx
// 4-step buyer signup form — connected to backend API.
// On success navigates to /success which handles role-based redirect.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormSidebar    from '../components/FormSidebar'
import FormInput      from '../components/FormInput'
import OtpInput       from '../components/OtpInput'
import StepNavigation from '../components/StepNavigation'
import { buyerSignup } from '../services/authService'

const STEPS = [
    { title: 'Account',  sub: 'Basic credentials'  },
    { title: 'Profile',  sub: 'Personal details'   },
    { title: 'Address',  sub: 'Delivery address'   },
    { title: 'Payment',  sub: 'Saved payment info' },
]

const sectionTitle = (text, isOptional = false) => (
    <p style={{
        fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--blue)',
        marginBottom: 20, paddingBottom: 8,
        borderBottom: '1.5px solid var(--blue-light)',
    }}>
        {text}
        {isOptional && <span style={{ fontWeight: 400, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}> (Optional)</span>}
    </p>
)

const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }

export default function BuyerSignupPage() {
    const navigate        = useNavigate()
    const [step, setStep] = useState(0)
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        fullName: '', mobile: '', email: '', password: '', confirmPassword: '', otp: '',
        gender: '', dob: '',
        fullAddress: '', houseNo: '', street: '', city: '', state: '',
        pincode: '', country: 'India', landmark: '',
        debitCard: '', creditCard: '', cardHolder: '', expiry: '', cvv: '', upi: '',
    })

    function set(field) { return e => setForm(p => ({ ...p, [field]: e.target.value })) }

    function next() {
        setError('')
        if (step === 0) {
            if (!form.fullName || !form.mobile || !form.email || !form.password) {
                setError('Please fill in all required fields'); return
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match'); return
            }
            if (form.password.length < 6) {
                setError('Password must be at least 6 characters'); return
            }
        }
        setStep(s => Math.min(s + 1, STEPS.length - 1))
    }

    function back() { setError(''); setStep(s => Math.max(s - 1, 0)) }

    async function submit() {
        setError('')
        setLoading(true)
        const result = await buyerSignup(form)
        setLoading(false)
        if (result.success) {
            navigate('/success')
        } else {
            setError(result.message)
        }
    }

    return (
        <div className="page-enter" style={{ display: 'flex', minHeight: '100vh' }}>
            <FormSidebar steps={STEPS} currentStep={step} />

            <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px', display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => navigate('/auth')} style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    fontSize: '0.85rem', cursor: 'pointer', alignSelf: 'flex-start',
                    fontFamily: "'DM Sans', sans-serif", marginBottom: 24,
                }}>
                    ← Back
                </button>

                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', fontWeight: 600 }}>
                        Create your account
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                        Join Marbvelous as a Customer
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: '10px 14px', background: '#fef2f2',
                        border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)',
                        color: 'var(--error)', fontSize: '0.85rem', marginBottom: 16,
                    }}>
                        {error}
                    </div>
                )}

                {step === 0 && (
                    <>
                        {sectionTitle('Account Details')}
                        <div style={grid}>
                            <FormInput label="Full Name"        fullWidth placeholder="Enter your full name"    value={form.fullName}        onChange={set('fullName')} />
                            <FormInput label="Mobile Number"    type="tel"      placeholder="+91 XXXXX XXXXX"  value={form.mobile}          onChange={set('mobile')} />
                            <FormInput label="Email Address"    type="email"    placeholder="you@example.com"  value={form.email}           onChange={set('email')} />
                            <FormInput label="Password"         type="password" placeholder="Min 6 characters" value={form.password}        onChange={set('password')} />
                            <FormInput label="Confirm Password" type="password" placeholder="Repeat password"  value={form.confirmPassword} onChange={set('confirmPassword')} />
                            <OtpInput
                                value={form.otp}
                                onChange={set('otp')}
                                email={form.email}
                                name={form.fullName}
                                role="buyer"
                            />
                        </div>
                        <StepNavigation onNext={next} nextLabel="Next" />
                    </>
                )}

                {step === 1 && (
                    <>
                        {sectionTitle('Profile Details', true)}
                        <div style={grid}>
                            <FormInput label="Gender" optional type="select" value={form.gender} onChange={set('gender')}
                                       options={['Male', 'Female', 'Other', 'Prefer not to say']} />
                            <FormInput label="Date of Birth" optional type="date" value={form.dob} onChange={set('dob')} />
                        </div>
                        <StepNavigation onBack={back} onNext={next} nextLabel="Next" />
                    </>
                )}

                {step === 2 && (
                    <>
                        {sectionTitle('Address Details')}
                        <div style={grid}>
                            <FormInput label="Full Address"     fullWidth placeholder="Full address line"  value={form.fullAddress} onChange={set('fullAddress')} />
                            <FormInput label="House / Flat No." placeholder="e.g. 4B, Flat 12"            value={form.houseNo}     onChange={set('houseNo')} />
                            <FormInput label="Street / Area"    placeholder="Street or area name"          value={form.street}      onChange={set('street')} />
                            <FormInput label="City"             placeholder="City"                         value={form.city}        onChange={set('city')} />
                            <FormInput label="State"            placeholder="State"                        value={form.state}       onChange={set('state')} />
                            <FormInput label="Pincode"          placeholder="6-digit pincode"              value={form.pincode}     onChange={set('pincode')} />
                            <FormInput label="Country"          placeholder="Country"                      value={form.country}     onChange={set('country')} />
                            <FormInput label="Landmark" optional fullWidth placeholder="Nearby landmark"   value={form.landmark}    onChange={set('landmark')} />
                        </div>
                        <StepNavigation onBack={back} onNext={next} nextLabel="Next" />
                    </>
                )}

                {step === 3 && (
                    <>
                        {sectionTitle('Payment Details', true)}
                        <div style={grid}>
                            <FormInput label="Debit Card Number"  optional fullWidth placeholder="XXXX XXXX XXXX XXXX" value={form.debitCard}   onChange={set('debitCard')} />
                            <FormInput label="Credit Card Number" optional fullWidth placeholder="XXXX XXXX XXXX XXXX" value={form.creditCard}  onChange={set('creditCard')} />
                            <FormInput label="Card Holder Name"   placeholder="Name on card"   value={form.cardHolder} onChange={set('cardHolder')} />
                            <FormInput label="Expiry Date"        placeholder="MM / YY"        value={form.expiry}     onChange={set('expiry')} />
                            <FormInput label="CVV" type="password" placeholder="CVV"           value={form.cvv}        onChange={set('cvv')} />
                            <FormInput label="UPI ID" optional     placeholder="yourname@upi"  value={form.upi}        onChange={set('upi')} />
                        </div>
                        <StepNavigation onBack={back} onNext={submit} nextLabel="Create Account" isLastStep loading={loading} />
                    </>
                )}
            </div>
        </div>
    )
}