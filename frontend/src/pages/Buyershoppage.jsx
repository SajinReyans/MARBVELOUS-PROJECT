// pages/BuyerShopPage.jsx
// Public shop profile — view store info, contact, location, products.
// Buyers cannot edit anything here.

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { logout, isLoggedIn } from '../services/authService'
import { getPublicStore, addToCart, fileUrl } from '../services/buyerService'

export default function BuyerShopPage() {
    const { slug }   = useParams()
    const navigate   = useNavigate()

    const [store,    setStore]    = useState(null)
    const [products, setProducts] = useState([])
    const [loading,  setLoading]  = useState(true)
    const [cartMsg,  setCartMsg]  = useState('')
    const [tab,      setTab]      = useState('products')

    useEffect(() => {
        getPublicStore(slug).then(res => {
            if (res.success) { setStore(res.store); setProducts(res.products) }
            setLoading(false)
        })
    }, [slug])

    async function handleAddToCart(productId) {
        if (!isLoggedIn()) { navigate('/login'); return }
        await addToCart(productId, 1)
        setCartMsg('Added to cart!')
        setTimeout(() => setCartMsg(''), 2000)
    }

    function openMaps() {
        if (store?.location?.lat) window.open(`https://www.google.com/maps?q=${store.location.lat},${store.location.lng}`, '_blank')
    }

    function copyLink() {
        navigator.clipboard.writeText(window.location.href)
        setCartMsg('Link copied!')
        setTimeout(() => setCartMsg(''), 2000)
    }

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: 'var(--text-muted)' }}>Loading store...</div>
    if (!store) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: 'var(--text-muted)' }}>Store not found.</div>

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>

            {/* Navbar */}
            <nav style={{
                background: '#fff', borderBottom: '1.5px solid var(--border)',
                padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                <Logo size="sm" />
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {cartMsg && <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>{cartMsg}</span>}
                    <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                    {isLoggedIn() && <>
                        <button onClick={() => navigate('/buyer/cart')} style={{ padding: '8px 16px', background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: '#7c3aed', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>🛒 Cart</button>
                        <button onClick={() => { logout(); navigate('/') }} style={{ padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>Logout</button>
                    </>}
                </div>
            </nav>

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>

                {/* Store Banner */}
                <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', borderRadius: 'var(--radius)', padding: '32px 36px', marginBottom: 24, color: '#fff', display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                        {store.logo ? <img src={fileUrl(store.logo)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏪'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 600, marginBottom: 4 }}>{store.storeName || 'Unnamed Store'}</h1>
                        {store.tagline && <p style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: 8 }}>{store.tagline}</p>}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {store.address?.city && <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>📍 {store.address.city}, {store.address.state}</span>}
                            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>📦 {products.length} products</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                        <button onClick={copyLink} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>🔗 Share</button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 4, width: 'fit-content' }}>
                    {[{ key: 'products', label: '📦 Products' }, { key: 'about', label: 'ℹ️ About' }, { key: 'contact', label: '📞 Contact' }].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{
                            padding: '8px 18px', borderRadius: 6, border: 'none',
                            background: tab === t.key ? '#7c3aed' : 'transparent',
                            color: tab === t.key ? '#fff' : 'var(--text-muted)',
                            fontSize: '0.85rem', fontWeight: tab === t.key ? 700 : 400,
                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>{t.label}</button>
                    ))}
                </div>

                {/* Products */}
                {tab === 'products' && (
                    products.length === 0
                        ? <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>No products listed yet.</div>
                        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                            {products.map(p => (
                                <div key={p._id} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer' }}
                                     onClick={() => navigate(`/product/${p._id}`)}>
                                    <div style={{ height: 150, background: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
                                        {p.images?.[0] ? <img src={fileUrl(p.images[0])} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🪨</div>}
                                        {p.discount > 0 && <span style={{ position: 'absolute', top: 8, left: 8, background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{p.discount}% OFF</span>}
                                    </div>
                                    <div style={{ padding: '12px' }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                            <span style={{ fontWeight: 700, color: '#7c3aed' }}>₹{p.discountedPrice}</span>
                                            {p.discount > 0 && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.price}</span>}
                                        </div>
                                        <button onClick={e => { e.stopPropagation(); handleAddToCart(p._id) }} disabled={p.stock === 0} style={{
                                            width: '100%', padding: '7px', background: p.stock === 0 ? '#f3f4f6' : '#7c3aed',
                                            color: p.stock === 0 ? 'var(--text-muted)' : '#fff', border: 'none',
                                            borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600,
                                            cursor: p.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                                        }}>{p.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                )}

                {/* About */}
                {tab === 'about' && (
                    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 32px' }}>
                        {store.description && <><p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>About</p><p style={{ fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 24 }}>{store.description}</p></>}
                        {store.categories?.length > 0 && (
                            <><p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Categories</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                                    {store.categories.map(c => <span key={c} style={{ padding: '5px 14px', background: '#f5f3ff', color: '#7c3aed', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600 }}>{c}</span>)}
                                </div></>
                        )}
                        {store.address?.street && (
                            <><p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Address</p>
                                <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                                    {[store.address.street, store.address.landmark, store.address.city, store.address.state, store.address.pincode, store.address.country].filter(Boolean).join(', ')}
                                </p></>
                        )}
                    </div>
                )}

                {/* Contact */}
                {tab === 'contact' && (
                    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {store.contactPhone && <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ fontSize: 20 }}>📞</span>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone</p>
                                    <a href={`tel:${store.contactPhone}`} style={{ fontSize: '0.95rem', color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>{store.contactPhone}</a>
                                </div>
                            </div>}
                            {store.whatsapp && <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ fontSize: 20 }}>💬</span>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>WhatsApp</p>
                                    <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.95rem', color: '#25d366', fontWeight: 600, textDecoration: 'none' }}>{store.whatsapp}</a>
                                </div>
                            </div>}
                            {store.contactEmail && <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ fontSize: 20 }}>✉️</span>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</p>
                                    <a href={`mailto:${store.contactEmail}`} style={{ fontSize: '0.95rem', color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>{store.contactEmail}</a>
                                </div>
                            </div>}
                            {store.website && <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ fontSize: 20 }}>🌐</span>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Website</p>
                                    <a href={store.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.95rem', color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>{store.website}</a>
                                </div>
                            </div>}
                            {store.location?.lat && (
                                <div style={{ marginTop: 8 }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Shop Location</p>
                                    <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1.5px solid var(--border)', marginBottom: 10 }}>
                                        <iframe title="Location" src={`https://maps.google.com/maps?q=${store.location.lat},${store.location.lng}&z=15&output=embed`} width="100%" height="240" style={{ border: 'none', display: 'block' }} allowFullScreen loading="lazy" />
                                    </div>
                                    <button onClick={openMaps} style={{ padding: '9px 18px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: '#2563eb', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>🗺️ Open in Google Maps</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}