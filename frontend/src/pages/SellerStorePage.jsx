// ============================================================
// SELLER STORE PAGE — frontend/src/pages/SellerStorePage.jsx
// Edit store name, logo, tagline, description,
// contact details, address and categories.
// Route: /seller/store
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { useNavigate }                  from 'react-router-dom'
import Logo                             from '../components/Logo'
import { getCurrentUser, logout }       from '../services/authService'
import { getMyStore, updateMyStore, getFileUrl } from '../services/sellerService'

const CATEGORIES = ['Tiles', 'Marbles', 'Faucets', 'Sinks', 'Plumbing Tools', 'Other']

const label = (text, optional = false) => (
    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>
        {text}{optional && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> (optional)</span>}
    </label>
)

const input = (props) => (
    <input {...props} style={{
        width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
        color: 'var(--text)', outline: 'none', boxSizing: 'border-box', ...props.style,
    }}
           onFocus={e => e.target.style.borderColor = '#7c3aed'}
           onBlur={e  => e.target.style.borderColor = 'var(--border)'}
    />
)

const textarea = (props) => (
    <textarea {...props} style={{
        width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
        color: 'var(--text)', outline: 'none', boxSizing: 'border-box', resize: 'vertical',
        minHeight: 100, ...props.style,
    }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e  => e.target.style.borderColor = 'var(--border)'}
    />
)

const sectionHead = (text) => (
    <p style={{
        fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: '#7c3aed',
        margin: '32px 0 16px', paddingBottom: 8,
        borderBottom: '1.5px solid #ede9fe',
    }}>{text}</p>
)

export default function SellerStorePage() {
    const navigate  = useNavigate()
    const user      = getCurrentUser()
    const logoRef   = useRef()

    const [saving,  setSaving]  = useState(false)
    const [success, setSuccess] = useState('')
    const [error,   setError]   = useState('')
    const [logoPreview, setLogoPreview] = useState('')

    const [form, setForm] = useState({
        storeName: '', tagline: '', description: '',
        contactEmail: '', contactPhone: '', whatsapp: '', website: '',
        street: '', city: '', state: '', pincode: '', country: 'India', landmark: '',
        categories: [],
        logo: null,
    })

    useEffect(() => {
        getMyStore().then(res => {
            if (res.success && res.store) {
                const s = res.store
                setForm(f => ({
                    ...f,
                    storeName:    s.storeName    || '',
                    tagline:      s.tagline      || '',
                    description:  s.description  || '',
                    contactEmail: s.contactEmail || '',
                    contactPhone: s.contactPhone || '',
                    whatsapp:     s.whatsapp     || '',
                    website:      s.website      || '',
                    street:       s.address?.street   || '',
                    city:         s.address?.city     || '',
                    state:        s.address?.state    || '',
                    pincode:      s.address?.pincode  || '',
                    country:      s.address?.country  || 'India',
                    landmark:     s.address?.landmark || '',
                    categories:   s.categories || [],
                }))
                if (s.logo) setLogoPreview(getFileUrl(s.logo))
            }
        })
    }, [])

    function set(field) { return e => setForm(p => ({ ...p, [field]: e.target.value })) }

    function toggleCategory(cat) {
        setForm(p => ({
            ...p,
            categories: p.categories.includes(cat)
                ? p.categories.filter(c => c !== cat)
                : [...p.categories, cat],
        }))
    }

    function handleLogoChange(e) {
        const file = e.target.files[0]
        if (!file) return
        setForm(p => ({ ...p, logo: file }))
        setLogoPreview(URL.createObjectURL(file))
    }

    async function handleSave() {
        setError(''); setSuccess('')
        if (!form.storeName.trim()) { setError('Store name is required'); return }

        setSaving(true)
        const fd = new FormData()
        Object.entries(form).forEach(([key, val]) => {
            if (key === 'logo' && val) { fd.append('logo', val); return }
            if (key === 'categories')  { fd.append('categories', JSON.stringify(val)); return }
            if (key !== 'logo')        fd.append(key, val)
        })

        const res = await updateMyStore(fd)
        setSaving(false)
        if (res.success) setSuccess('Store updated successfully!')
        else setError(res.message)
    }

    function handleLogout() { logout(); navigate('/') }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>

            {/* Navbar */}
            <nav style={{
                background: '#ffffff', borderBottom: '1.5px solid var(--border)',
                padding: '0 40px', height: 64, display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Logo size="sm" />
                    <span style={{
                        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.1em', color: '#ffffff', background: '#7c3aed',
                        padding: '4px 10px', borderRadius: 20,
                    }}>Edit Store</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => navigate('/seller/dashboard')} style={{
                        padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                        color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
                    }}>← Dashboard</button>
                    <button onClick={handleLogout} style={{
                        padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                        color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
                    }}>Logout</button>
                </div>
            </nav>

            <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: 4 }}>Edit Your Store</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 32 }}>
                    Customize how your store looks to customers.
                </p>

                {error   && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}
                {success && <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', color: '#16a34a', fontSize: '0.85rem', marginBottom: 16 }}>✓ {success}</div>}

                {/* ── Store Identity ── */}
                {sectionHead('Store Identity')}

                {/* Logo Upload */}
                <div style={{ marginBottom: 20 }}>
                    {label('Store Logo / Profile Picture')}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: '#f3f4f6', border: '2px dashed var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                        }} onClick={() => logoRef.current.click()}>
                            {logoPreview
                                ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: 28 }}>🏪</span>}
                        </div>
                        <div>
                            <button onClick={() => logoRef.current.click()} style={{
                                padding: '8px 16px', background: '#f5f3ff', border: '1.5px solid #ddd6fe',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                                color: '#7c3aed', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            }}>Upload Logo</button>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>JPG, PNG or WEBP — max 5MB</p>
                        </div>
                        <input ref={logoRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleLogoChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        {label('Store Name')}
                        {input({ placeholder: 'e.g. Raj Marble House', value: form.storeName, onChange: set('storeName') })}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        {label('Tagline', true)}
                        {input({ placeholder: 'e.g. Premium tiles at factory prices', value: form.tagline, onChange: set('tagline') })}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        {label('Store Description', true)}
                        {textarea({ placeholder: 'Tell customers about your store, what you sell, years of experience...', value: form.description, onChange: set('description') })}
                    </div>
                </div>

                {/* ── Categories ── */}
                {sectionHead('Product Categories')}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                    {CATEGORIES.map(cat => (
                        <label key={cat} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 14px', borderRadius: 20, cursor: 'pointer',
                            border: `1.5px solid ${form.categories.includes(cat) ? '#7c3aed' : 'var(--border)'}`,
                            background: form.categories.includes(cat) ? '#f5f3ff' : '#ffffff',
                            fontSize: '0.85rem', fontWeight: form.categories.includes(cat) ? 600 : 400,
                            color: form.categories.includes(cat) ? '#7c3aed' : 'var(--text-muted)',
                            transition: 'all 0.15s',
                        }}>
                            <input type="checkbox" checked={form.categories.includes(cat)} onChange={() => toggleCategory(cat)} style={{ display: 'none' }} />
                            {cat}
                        </label>
                    ))}
                </div>

                {/* ── Contact Details ── */}
                {sectionHead('Contact Details')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>{label('Contact Email', true)}{input({ type: 'email', placeholder: 'store@email.com', value: form.contactEmail, onChange: set('contactEmail') })}</div>
                    <div>{label('Phone Number', true)}{input({ type: 'tel', placeholder: '+91 XXXXX XXXXX', value: form.contactPhone, onChange: set('contactPhone') })}</div>
                    <div>{label('WhatsApp', true)}{input({ placeholder: '+91 XXXXX XXXXX', value: form.whatsapp, onChange: set('whatsapp') })}</div>
                    <div>{label('Website', true)}{input({ placeholder: 'https://yourwebsite.com', value: form.website, onChange: set('website') })}</div>
                </div>

                {/* ── Shop Address ── */}
                {sectionHead('Shop Address')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ gridColumn: '1 / -1' }}>{label('Street Address', true)}{input({ placeholder: 'Shop No., Street, Area', value: form.street, onChange: set('street') })}</div>
                    <div>{label('City', true)}{input({ placeholder: 'City', value: form.city, onChange: set('city') })}</div>
                    <div>{label('State', true)}{input({ placeholder: 'State', value: form.state, onChange: set('state') })}</div>
                    <div>{label('Pincode', true)}{input({ placeholder: 'Pincode', value: form.pincode, onChange: set('pincode') })}</div>
                    <div>{label('Country', true)}{input({ placeholder: 'Country', value: form.country, onChange: set('country') })}</div>
                    <div style={{ gridColumn: '1 / -1' }}>{label('Landmark', true)}{input({ placeholder: 'Near landmark...', value: form.landmark, onChange: set('landmark') })}</div>
                </div>

                {/* ── Save ── */}
                <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
                    <button onClick={handleSave} disabled={saving} style={{
                        padding: '13px 32px', background: saving ? 'var(--border)' : '#7c3aed',
                        color: saving ? 'var(--text-muted)' : '#ffffff', border: 'none',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                    }}>
                        {saving ? 'Saving...' : 'Save Store'}
                    </button>
                    <button onClick={() => navigate('/seller/dashboard')} style={{
                        padding: '13px 24px', background: 'none', border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', cursor: 'pointer',
                        color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
                    }}>Cancel</button>
                </div>
            </div>
        </div>
    )
}