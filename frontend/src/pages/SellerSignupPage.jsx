// pages/SellerSignupPage.jsx
// 5-step seller signup form — connected to backend API.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormSidebar    from '../components/FormSidebar'
import FormInput      from '../components/FormInput'
import OtpInput       from '../components/OtpInput'
import UploadBox      from '../components/UploadBox'
import StepNavigation from '../components/StepNavigation'
import { sellerSignup } from '../services/authService'

const STEPS = [
    { title: 'Account',  sub: 'Basic credentials' },
    { title: 'Business', sub: 'Business details'  },
    { title: 'Identity', sub: 'KYC documents'     },
    { title: 'Bank',     sub: 'Payment details'   },
    { title: 'Store',    sub: 'Your store setup'  },
]

const BUSINESS_TYPES = ['Individual', 'Proprietorship', 'Partnership', 'LLP', 'Private Limited Company']
const ACCOUNT_TYPES  = ['Savings', 'Current']
const PRODUCT_CATS   = ['Tiles', 'Marbles', 'Faucets', 'Sinks', 'Plumbing Tools']

const sectionTitle = (text) => (
    <p style={{
        fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--blue)',
        marginBottom: 20, paddingBottom: 8,
        borderBottom: '1.5px solid var(--blue-light)',
    }}>
        {text}
    </p>
)

const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }

export default function SellerSignupPage() {
    const navigate        = useNavigate()
    const [step, setStep] = useState(0)
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        fullName: '', mobile: '', email: '', password: '', confirmPassword: '', otp: '',
        businessName: '', businessType: '',
        shopAddress: '', bizCity: '', bizState: '', bizPincode: '', bizCountry: 'India',
        pan: '', aadhaar: '', gst: '',
        gstCert: null, addressProof: null, bizRegCert: null,
        accountHolder: '', bankName: '', accountNumber: '', ifsc: '', accountType: '',
        storeName: '', categories: [],
    })

    function set(field)     { return e => setForm(p => ({ ...p, [field]: e.target.value })) }
    function setFile(field) { return file => setForm(p => ({ ...p, [field]: file })) }

    function toggleCategory(cat) {
        setForm(p => ({
            ...p,
            categories: p.categories.includes(cat)
                ? p.categories.filter(c => c !== cat)
                : [...p.categories, cat],
        }))
    }

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
        const result = await sellerSignup(form)
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
                        Become a Seller
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                        Set up your Marbvelous seller account
                    </p>
                </div>

                {/* Error banner */}
                {error && (
                    <div style={{
                        padding: '10px 14px', background: '#fef2f2',
                        border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)',
                        color: 'var(--error)', fontSize: '0.85rem', marginBottom: 16,
                    }}>
                        {error}
                    </div>
                )}

                {/* ── STEP 0: Account ── */}
                {step === 0 && (
                    <>
                        {sectionTitle('Account Details')}
                        <div style={grid}>
                            <FormInput label="Full Name"        fullWidth placeholder="Your full name"        value={form.fullName}        onChange={set('fullName')} />
                            <FormInput label="Mobile Number"    type="tel"      placeholder="+91 XXXXX XXXXX" value={form.mobile}          onChange={set('mobile')} />
                            <FormInput label="Email Address"    type="email"    placeholder="you@example.com" value={form.email}           onChange={set('email')} />
                            <FormInput label="Password"         type="password" placeholder="Min 6 characters" value={form.password}       onChange={set('password')} />
                            <FormInput label="Confirm Password" type="password" placeholder="Repeat password"  value={form.confirmPassword} onChange={set('confirmPassword')} />
                            <OtpInput
                                value={form.otp}
                                onChange={set('otp')}
                                email={form.email}
                                name={form.fullName}
                                role="seller"
                            />
                        </div>
                        <StepNavigation onNext={next} nextLabel="Next" />
                    </>
                )}

                {/* ── STEP 1: Business ── */}
                {step === 1 && (
                    <>
                        {sectionTitle('Business Details')}
                        <div style={grid}>
                            <FormInput label="Business Name" fullWidth placeholder="Official business name" value={form.businessName} onChange={set('businessName')} />
                            <FormInput label="Business Type" fullWidth type="select" value={form.businessType} onChange={set('businessType')} options={BUSINESS_TYPES} />
                        </div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--blue)', padding: '8px 0', borderBottom: '1.5px solid var(--blue-light)', margin: '24px 0 16px' }}>
                            Business Address
                        </p>
                        <div style={grid}>
                            <FormInput label="Pickup / Shop Address" fullWidth placeholder="Shop or warehouse address" value={form.shopAddress} onChange={set('shopAddress')} />
                            <FormInput label="City"    placeholder="City"    value={form.bizCity}    onChange={set('bizCity')} />
                            <FormInput label="State"   placeholder="State"   value={form.bizState}   onChange={set('bizState')} />
                            <FormInput label="Pincode" placeholder="Pincode" value={form.bizPincode} onChange={set('bizPincode')} />
                            <FormInput label="Country" placeholder="Country" value={form.bizCountry} onChange={set('bizCountry')} />
                        </div>
                        <StepNavigation onBack={back} onNext={next} nextLabel="Next" />
                    </>
                )}

                {/* ── STEP 2: Identity ── */}
                {step === 2 && (
                    <>
                        {sectionTitle('Identity & KYC Documents')}
                        <div style={grid}>
                            <FormInput label="PAN Card Number"  placeholder="ABCDE1234F"          value={form.pan}     onChange={set('pan')} />
                            <FormInput label="Aadhaar Number"   placeholder="XXXX XXXX XXXX"      value={form.aadhaar} onChange={set('aadhaar')} />
                            <FormInput label="GST Number" optional placeholder="22AAAAA0000A1Z5"  value={form.gst}     onChange={set('gst')} />
                            <div />
                            <UploadBox label="GST Certificate"                    optional icon="📄" hint="Upload GST Certificate"      onChange={setFile('gstCert')} />
                            <UploadBox label="Address Proof"                               icon="📋" hint="Upload Address Proof"         onChange={setFile('addressProof')} />
                            <UploadBox label="Business Registration Certificate" optional  icon="🏢" hint="Upload Business Certificate" onChange={setFile('bizRegCert')} />
                        </div>
                        <StepNavigation onBack={back} onNext={next} nextLabel="Next" />
                    </>
                )}

                {/* ── STEP 3: Bank ── */}
                {step === 3 && (
                    <>
                        {sectionTitle('Bank Details')}
                        <div style={grid}>
                            <FormInput label="Account Holder Name" fullWidth placeholder="Name as per bank records" value={form.accountHolder} onChange={set('accountHolder')} />
                            <FormInput label="Bank Name"     placeholder="e.g. State Bank of India" value={form.bankName}      onChange={set('bankName')} />
                            <FormInput label="Account Number" placeholder="Bank account number"     value={form.accountNumber} onChange={set('accountNumber')} />
                            <FormInput label="IFSC Code"     placeholder="e.g. SBIN0001234"         value={form.ifsc}          onChange={set('ifsc')} />
                            <FormInput label="Account Type"  type="select" value={form.accountType} onChange={set('accountType')} options={ACCOUNT_TYPES} />
                        </div>
                        <StepNavigation onBack={back} onNext={next} nextLabel="Next" />
                    </>
                )}

                {/* ── STEP 4: Store ── */}
                {step === 4 && (
                    <>
                        {sectionTitle('Store Details')}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                            <FormInput label="Store Name" placeholder="Your store display name" value={form.storeName} onChange={set('storeName')} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Product Categories</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                                    {PRODUCT_CATS.map(cat => (
                                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={form.categories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                style={{ width: 16, height: 16, accentColor: 'var(--blue)', cursor: 'pointer' }}
                                            />
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <StepNavigation onBack={back} onNext={submit} nextLabel="Create Account" isLastStep loading={loading} />
                    </>
                )}
            </div>
        </div>
    )
}