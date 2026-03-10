// pages/BuyerProductPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { isLoggedIn } from '../services/authService'
import { getProduct, addToCart, fileUrl } from '../services/buyerService'

export default function BuyerProductPage() {
    const { id }    = useParams()
    const navigate  = useNavigate()
    const [product, setProduct]   = useState(null)
    const [selImg,  setSelImg]    = useState(0)
    const [qty,     setQty]       = useState(1)
    const [msg,     setMsg]       = useState('')
    const [loading, setLoading]   = useState(true)

    useEffect(() => {
        getProduct(id).then(res => { if (res.success) setProduct(res.product); setLoading(false) })
    }, [id])

    async function handleAddToCart() {
        if (!isLoggedIn()) { navigate('/login'); return }
        await addToCart(id, qty)
        setMsg('Added to cart!')
        setTimeout(() => setMsg(''), 2000)
    }

    function handleBuyNow() {
        if (!isLoggedIn()) { navigate('/login'); return }
        addToCart(id, qty).then(() => navigate('/buyer/cart'))
    }

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: 'var(--text-muted)' }}>Loading...</div>
    if (!product) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>Product not found.</div>

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>
            <nav style={{ background: '#fff', borderBottom: '1.5px solid var(--border)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                <Logo size="sm" />
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {msg && <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>{msg}</span>}
                    <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                    <button onClick={() => navigate('/buyer/cart')} style={{ padding: '8px 16px', background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: '#7c3aed', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>🛒 Cart</button>
                </div>
            </nav>

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

                    {/* Images */}
                    <div>
                        <div style={{ height: 360, background: '#f3f4f6', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 12 }}>
                            {product.images?.[selImg]
                                ? <img src={fileUrl(product.images[selImg])} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🪨</div>}
                        </div>
                        {product.images?.length > 1 && (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {product.images.map((img, i) => (
                                    <div key={i} onClick={() => setSelImg(i)} style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${selImg === i ? '#7c3aed' : 'var(--border)'}` }}>
                                        <img src={fileUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {product.video && (
                            <div style={{ marginTop: 12 }}>
                                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Product Video</p>
                                <video src={fileUrl(product.video)} controls style={{ width: '100%', borderRadius: 8, border: '1.5px solid var(--border)' }} />
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <p style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{product.category}</p>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 600, marginBottom: 12 }}>{product.name}</h1>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#7c3aed' }}>₹{product.discountedPrice}</span>
                            {product.discount > 0 && <>
                                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.price}</span>
                                <span style={{ background: '#fef2f2', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>{product.discount}% OFF</span>
                            </>}
                        </div>

                        {/* Delivery */}
                        <div style={{ marginBottom: 16 }}>
                            {product.freeDelivery
                                ? <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.82rem', fontWeight: 600, padding: '5px 12px', borderRadius: 20 }}>✓ Free Delivery</span>
                                : <span style={{ background: '#fef9c3', color: '#92400e', fontSize: '0.82rem', fontWeight: 600, padding: '5px 12px', borderRadius: 20 }}>Delivery: ₹{product.deliveryCost}</span>}
                        </div>

                        {/* Stock */}
                        <p style={{ fontSize: '0.85rem', color: product.stock > 0 ? '#16a34a' : '#ef4444', fontWeight: 600, marginBottom: 20 }}>
                            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                        </p>

                        {/* Description */}
                        {product.description && <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 24 }}>{product.description}</p>}

                        {/* Quantity */}
                        {product.stock > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Qty:</p>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width: 36, height: 36, border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '1.1rem', fontFamily: "'DM Sans', sans-serif" }}>−</button>
                                    <span style={{ width: 40, textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>{qty}</span>
                                    <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{ width: 36, height: 36, border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '1.1rem', fontFamily: "'DM Sans', sans-serif" }}>+</button>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                            <button onClick={handleAddToCart} disabled={product.stock === 0} style={{
                                flex: 1, padding: '13px', background: product.stock === 0 ? '#f3f4f6' : '#f5f3ff',
                                color: product.stock === 0 ? 'var(--text-muted)' : '#7c3aed',
                                border: `1.5px solid ${product.stock === 0 ? 'var(--border)' : '#ddd6fe'}`,
                                borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', fontWeight: 700,
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                            }}>🛒 Add to Cart</button>
                            <button onClick={handleBuyNow} disabled={product.stock === 0} style={{
                                flex: 1, padding: '13px', background: product.stock === 0 ? '#f3f4f6' : '#7c3aed',
                                color: product.stock === 0 ? 'var(--text-muted)' : '#fff',
                                border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', fontWeight: 700,
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                            }}>⚡ Buy Now</button>
                        </div>

                        {/* Seller Info */}
                        <div style={{ background: '#f9fafb', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8 }}>Sold by</p>
                            <p style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 4 }}>{product.seller?.fullName}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}