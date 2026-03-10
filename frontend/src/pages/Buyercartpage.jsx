// pages/BuyerCartPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { getCurrentUser } from '../services/authService'
import { getCart, updateCartItem, removeFromCart, placeOrder, fileUrl } from '../services/buyerService'

const inp = (props) => (
    <input {...props} style={{
        width: '100%', padding: '10px 13px', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-sm)', fontSize: '0.88rem',
        fontFamily: "'DM Sans', sans-serif", outline: 'none',
        boxSizing: 'border-box', ...props.style,
    }}
           onFocus={e => e.target.style.borderColor = '#7c3aed'}
           onBlur={e  => e.target.style.borderColor = 'var(--border)'}
    />
)

export default function BuyerCartPage() {
    const navigate = useNavigate()
    const user     = getCurrentUser()

    const [cart,      setCart]      = useState(null)
    const [loading,   setLoading]   = useState(true)
    const [placing,   setPlacing]   = useState(false)
    const [step,      setStep]      = useState('cart') // 'cart' | 'checkout'
    const [error,     setError]     = useState('')
    const [payment,   setPayment]   = useState('cod')

    const [addr, setAddr] = useState({
        fullName: user?.fullName || '', phone: '', street: '',
        city: '', state: '', pincode: '', country: 'India',
    })

    useEffect(() => { loadCart() }, [])

    async function loadCart() {
        setLoading(true)
        const res = await getCart()
        if (res.success) setCart(res.cart)
        setLoading(false)
    }

    async function handleQty(productId, qty) {
        await updateCartItem(productId, qty)
        loadCart()
    }

    async function handleRemove(productId) {
        await removeFromCart(productId)
        loadCart()
    }

    const items    = cart?.items || []
    const subtotal = items.reduce((s, i) => s + ((i.product?.discountedPrice || i.priceAtAdd) * i.quantity), 0)
    const delivery = items.reduce((s, i) => {
        if (i.product?.freeDelivery) return s
        return Math.max(s, i.product?.deliveryCost || 0)
    }, 0)
    const total    = subtotal + delivery

    async function handlePlaceOrder() {
        setError('')
        if (!addr.fullName || !addr.phone || !addr.street || !addr.city || !addr.pincode)
        { setError('Fill in all required delivery fields'); return }

        setPlacing(true)
        try {
            const res = await placeOrder({
                deliveryAddress: addr,
                paymentMethod:   payment,
                items: items.map(i => ({ productId: i.product._id, quantity: i.quantity })),
            })
            if (res.success) navigate('/buyer/orders?placed=1')
            else setError(res.message || 'Failed to place order')
        } catch (e) {
            setError('Something went wrong')
        }
        setPlacing(false)
    }

    function setA(f) { return e => setAddr(p => ({ ...p, [f]: e.target.value })) }

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: 'var(--text-muted)' }}>Loading cart...</div>

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>
            <nav style={{ background: '#fff', borderBottom: '1.5px solid var(--border)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                <Logo size="sm" />
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => navigate('/buyer/dashboard')} style={{ padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>← Shop</button>
                </div>
            </nav>

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: 24 }}>
                    {step === 'cart' ? '🛒 Your Cart' : '📦 Checkout'}
                </h1>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 24 }}>Your cart is empty.</p>
                        <button onClick={() => navigate('/buyer/dashboard')} style={{ padding: '12px 28px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Browse Products</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

                        {/* Left */}
                        <div>
                            {step === 'cart' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {items.map(item => {
                                        const p = item.product
                                        if (!p) return null
                                        return (
                                            <div key={item._id} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                                                <div style={{ width: 70, height: 70, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                                                    {p.images?.[0] ? <img src={fileUrl(p.images[0])} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🪨</div>}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{p.name}</p>
                                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>{p.freeDelivery ? 'Free delivery' : `+₹${p.deliveryCost} delivery`}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', width: 'fit-content' }}>
                                                        <button onClick={() => handleQty(p._id, item.quantity - 1)} style={{ width: 32, height: 32, border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                                                        <span style={{ width: 36, textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}>{item.quantity}</span>
                                                        <button onClick={() => handleQty(p._id, item.quantity + 1)} style={{ width: 32, height: 32, border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1rem', marginBottom: 8 }}>₹{(p.discountedPrice * item.quantity)}</p>
                                                    <button onClick={() => handleRemove(p._id)} style={{ fontSize: '0.78rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Remove</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {step === 'checkout' && (
                                <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 32px' }}>
                                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', marginBottom: 20 }}>Delivery Address</h2>
                                    {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#ef4444', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div><label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 5 }}>Full Name *</label>{inp({ value: addr.fullName, onChange: setA('fullName') })}</div>
                                        <div><label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 5 }}>Phone *</label>{inp({ value: addr.phone, onChange: setA('phone') })}</div>
                                        <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 5 }}>Street Address *</label>{inp({ value: addr.street, onChange: setA('street'), placeholder: 'Door no., Street, Area' })}</div>
                                        <div><label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 5 }}>City *</label>{inp({ value: addr.city, onChange: setA('city') })}</div>
                                        <div><label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 5 }}>State</label>{inp({ value: addr.state, onChange: setA('state') })}</div>
                                        <div><label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 5 }}>Pincode *</label>{inp({ value: addr.pincode, onChange: setA('pincode') })}</div>
                                        <div><label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 5 }}>Country</label>{inp({ value: addr.country, onChange: setA('country') })}</div>
                                    </div>

                                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', margin: '24px 0 16px' }}>Payment Method</h2>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {[{ value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when you receive' }, { value: 'online', label: '💳 Online Payment', desc: 'Pay now (simulated)' }].map(opt => (
                                            <label key={opt.value} style={{
                                                flex: 1, padding: '14px', border: `2px solid ${payment === opt.value ? '#7c3aed' : 'var(--border)'}`,
                                                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                                background: payment === opt.value ? '#f5f3ff' : '#fff',
                                            }}>
                                                <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={() => setPayment(opt.value)} style={{ display: 'none' }} />
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{opt.label}</p>
                                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opt.desc}</p>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right — Summary */}
                        <div>
                            <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', position: 'sticky', top: 80 }}>
                                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', marginBottom: 20 }}>Order Summary</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Subtotal ({items.length} items)</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                                        <span style={{ color: delivery === 0 ? '#16a34a' : 'var(--text)' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                                    </div>
                                    <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem' }}>
                                        <span>Total</span>
                                        <span style={{ color: '#7c3aed' }}>₹{total}</span>
                                    </div>
                                </div>

                                {step === 'cart' ? (
                                    <button onClick={() => setStep('checkout')} style={{
                                        width: '100%', padding: '13px', background: '#7c3aed', color: '#fff',
                                        border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem',
                                        fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                    }}>Proceed to Checkout →</button>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <button onClick={handlePlaceOrder} disabled={placing} style={{
                                            width: '100%', padding: '13px', background: placing ? 'var(--border)' : '#7c3aed',
                                            color: placing ? 'var(--text-muted)' : '#fff', border: 'none',
                                            borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 700,
                                            cursor: placing ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                                        }}>{placing ? 'Placing Order...' : '✓ Place Order'}</button>
                                        <button onClick={() => setStep('cart')} style={{ width: '100%', padding: '10px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>← Back to Cart</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}