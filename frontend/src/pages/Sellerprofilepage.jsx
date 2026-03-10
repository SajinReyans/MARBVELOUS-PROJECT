// ============================================================
// SELLER PROFILE PAGE — frontend/src/pages/SellerProfilePage.jsx
// Edit contact details, shop address, and shop location.
// Location can be shared via browser GPS or entered manually.
// Route: /seller/profile
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate }          from 'react-router-dom'
import Logo                     from '../components/Logo'
import { getCurrentUser, logout } from '../services/authService'
import { getMyStore, updateMyStore } from '../services/sellerService'

const inp = (props) => (
    <input {...props} style={{
        width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-sm)', fontSize: '0.88rem',
        fontFamily: "'DM Sans', sans-serif", color: 'var(--text)',
        outline: 'none', boxSizing: 'border-box', ...props.style,
    }}
           onFocus={e => e.target.style.borderColor = '#7c3aed'}
           onBlur={e  => e.target.style.borderColor = 'var(--border)'}
    />
)

const fieldLabel = (text, optional = false) => (
    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>
        {text}{optional && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> (optional)</span>}
    </label>
)

const sectionHead = (text) => (
    <p style={{
        fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: '#7c3aed',
        margin: '32px 0 16px', paddingBottom: 8,
        borderBottom: '1.5px solid #ede9fe',
    }}>{text}</p>
)

export default function SellerProfilePage() {
    const navigate = useNavigate()
    const user     = getCurrentUser()

    const [saving,       setSaving]       = useState(false)
    const [success,      setSuccess]      = useState('')
    const [error,        setError]        = useState('')
    const [locLoading,   setLocLoading]   = useState(false)
    const [mapUrl,       setMapUrl]       = useState('')

    const [form, setForm] = useState({
        contactEmail: '',
        contactPhone: '',
        whatsapp:     '',
        website:      '',
        street:       '',
        city:         '',
        state:        '',
        pincode:      '',
        country:      'India',
        landmark:     '',
        lat:          '',
        lng:          '',
    })

    // Load existing store data
    useEffect(() => {
        getMyStore().then(res => {
            if (res.success && res.store) {
                const s = res.store
                setForm(f => ({
                    ...f,
                    contactEmail: s.contactEmail       || '',
                    contactPhone: s.contactPhone       || '',
                    whatsapp:     s.whatsapp           || '',
                    website:      s.website            || '',
                    street:       s.address?.street    || '',
                    city:         s.address?.city      || '',
                    state:        s.address?.state     || '',
                    pincode:      s.address?.pincode   || '',
                    country:      s.address?.country   || 'India',
                    landmark:     s.address?.landmark  || '',
                    lat:          s.location?.lat      || '',
                    lng:          s.location?.lng      || '',
                }))
                if (s.location?.lat && s.location?.lng) {
                    buildMapUrl(s.location.lat, s.location.lng)
                }
            }
        })
    }, [])

    function set(field) { return e => setForm(p => ({ ...p, [field]: e.target.value })) }

    function buildMapUrl(lat, lng) {
        setMapUrl(`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`)
    }

    // ── Get location from browser GPS ──
    function handleGetLocation() {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            return
        }
        setLocLoading(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6)
                const lng = pos.coords.longitude.toFixed(6)
                setForm(p => ({ ...p, lat, lng }))
                buildMapUrl(lat, lng)
                setLocLoading(false)
                setSuccess('Location detected successfully!')
                setTimeout(() => setSuccess(''), 3000)
            },
            (err) => {
                setLocLoading(false)
                setError('Could not get location. Please enter coordinates manually or allow location access.')
            }
        )
    }

    // ── Update map when lat/lng typed manually ──
    function handleLatLngChange(field) {
        return e => {
            const val = e.target.value
            setForm(p => {
                const updated = { ...p, [field]: val }
                if (updated.lat && updated.lng) buildMapUrl(updated.lat, updated.lng)
                return updated
            })
        }
    }

    function openInGoogleMaps() {
        if (form.lat && form.lng) {
            window.open(`https://www.google.com/maps?q=${form.lat},${form.lng}`, '_blank')
        }
    }

    function copyLocationLink() {
        if (form.lat && form.lng) {
            const link = `https://www.google.com/maps?q=${form.lat},${form.lng}`
            navigator.clipboard.writeText(link)
            setSuccess('Location link copied!')
            setTimeout(() => setSuccess(''), 2000)
        }
    }

    async function handleSave() {
        setError(''); setSuccess('')
        setSaving(true)

        const fd = new FormData()
        fd.append('contactEmail', form.contactEmail)
        fd.append('contactPhone', form.contactPhone)
        fd.append('whatsapp',     form.whatsapp)
        fd.append('website',      form.website)
        fd.append('street',       form.street)
        fd.append('city',         form.city)
        fd.append('state',        form.state)
        fd.append('pincode',      form.pincode)
        fd.append('country',      form.country)
        fd.append('landmark',     form.landmark)
        if (form.lat) fd.append('lat', form.lat)
        if (form.lng) fd.append('lng', form.lng)

        const res = await updateMyStore(fd)
        setSaving(false)
        if (res.success) setSuccess('Profile updated successfully!')
        else setError(res.message)
    }

    function handleLogout() { logout(); navigate('/') }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── Navbar ── */}
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
                    }}>Edit Profile</span>
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

                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: 4 }}>Edit Profile</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 32 }}>
                    Update your contact details, shop address and location.
                </p>

                {error   && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}
                {success && <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', color: '#16a34a', fontSize: '0.85rem', marginBottom: 16 }}>✓ {success}</div>}

                {/* ── Contact Details ── */}
                {sectionHead('Contact Details')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        {fieldLabel('Contact Email', true)}
                        {inp({ type: 'email', placeholder: 'store@email.com', value: form.contactEmail, onChange: set('contactEmail') })}
                    </div>
                    <div>
                        {fieldLabel('Phone Number', true)}
                        {inp({ type: 'tel', placeholder: '+91 XXXXX XXXXX', value: form.contactPhone, onChange: set('contactPhone') })}
                    </div>
                    <div>
                        {fieldLabel('WhatsApp Number', true)}
                        {inp({ placeholder: '+91 XXXXX XXXXX', value: form.whatsapp, onChange: set('whatsapp') })}
                    </div>
                    <div>
                        {fieldLabel('Website', true)}
                        {inp({ placeholder: 'https://yourwebsite.com', value: form.website, onChange: set('website') })}
                    </div>
                </div>

                {/* ── Shop Address ── */}
                {sectionHead('Shop Address')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        {fieldLabel('Street Address', true)}
                        {inp({ placeholder: 'Shop No., Street, Area', value: form.street, onChange: set('street') })}
                    </div>
                    <div>
                        {fieldLabel('City', true)}
                        {inp({ placeholder: 'City', value: form.city, onChange: set('city') })}
                    </div>
                    <div>
                        {fieldLabel('State', true)}
                        {inp({ placeholder: 'State', value: form.state, onChange: set('state') })}
                    </div>
                    <div>
                        {fieldLabel('Pincode', true)}
                        {inp({ placeholder: 'Pincode', value: form.pincode, onChange: set('pincode') })}
                    </div>
                    <div>
                        {fieldLabel('Country', true)}
                        {inp({ placeholder: 'Country', value: form.country, onChange: set('country') })}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        {fieldLabel('Landmark', true)}
                        {inp({ placeholder: 'Near landmark...', value: form.landmark, onChange: set('landmark') })}
                    </div>
                </div>

                {/* ── Shop Location ── */}
                {sectionHead('Shop Location')}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Share your exact shop location so customers can find you on Google Maps.
                </p>

                {/* GPS Button */}
                <button
                    onClick={handleGetLocation}
                    disabled={locLoading}
                    style={{
                        padding: '11px 20px', background: locLoading ? 'var(--border)' : '#f5f3ff',
                        border: '1.5px solid #ddd6fe', borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem', cursor: locLoading ? 'not-allowed' : 'pointer',
                        color: '#7c3aed', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
                    }}
                >
                    <span>📍</span>
                    {locLoading ? 'Detecting location...' : 'Use My Current Location (GPS)'}
                </button>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    Or enter coordinates manually:
                </p>

                {/* Manual lat/lng */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        {fieldLabel('Latitude', true)}
                        {inp({ placeholder: 'e.g. 12.971598', value: form.lat, onChange: handleLatLngChange('lat') })}
                    </div>
                    <div>
                        {fieldLabel('Longitude', true)}
                        {inp({ placeholder: 'e.g. 77.594566', value: form.lng, onChange: handleLatLngChange('lng') })}
                    </div>
                </div>

                {/* Map Preview */}
                {mapUrl && (
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
                            Location Preview
                        </p>
                        <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
                            <iframe
                                title="Shop Location"
                                src={mapUrl}
                                width="100%"
                                height="280"
                                style={{ border: 'none', display: 'block' }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>

                        {/* Location Action Buttons */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                            <button onClick={openInGoogleMaps} style={{
                                padding: '8px 16px', background: '#eff6ff', border: '1.5px solid #bfdbfe',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', cursor: 'pointer',
                                color: '#2563eb', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            }}>🗺️ Open in Google Maps</button>
                            <button onClick={copyLocationLink} style={{
                                padding: '8px 16px', background: '#f5f3ff', border: '1.5px solid #ddd6fe',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', cursor: 'pointer',
                                color: '#7c3aed', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            }}>🔗 Copy Location Link</button>
                        </div>
                    </div>
                )}

                {/* ── Save Button ── */}
                <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
                    <button onClick={handleSave} disabled={saving} style={{
                        padding: '13px 32px', background: saving ? 'var(--border)' : '#7c3aed',
                        color: saving ? 'var(--text-muted)' : '#ffffff', border: 'none',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                    }}>
                        {saving ? 'Saving...' : 'Save Profile'}
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