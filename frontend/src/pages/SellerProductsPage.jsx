// ============================================================
// SELLER PRODUCTS PAGE — frontend/src/pages/SellerProductsPage.jsx
// Add, edit and delete products.
// Supports multiple images, one video, discounts, delivery info.
// Route: /seller/products
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { useNavigate }                  from 'react-router-dom'
import Logo                             from '../components/Logo'
import { logout }                       from '../services/authService'
import { getMyProducts, addProduct, updateProduct, deleteProduct, getFileUrl } from '../services/sellerService'

const CATEGORIES = ['Tiles', 'Marbles', 'Faucets', 'Sinks', 'Plumbing Tools', 'Other']

const emptyForm = {
    name: '', description: '', category: '',
    price: '', discount: '', stock: '',
    freeDelivery: false, deliveryCost: '',
    images: [], video: null,
}

const inp = (props) => (
    <input {...props} style={{
        width: '100%', padding: '10px 13px', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
        color: 'var(--text)', outline: 'none', boxSizing: 'border-box', ...props.style,
    }}
           onFocus={e => e.target.style.borderColor = '#7c3aed'}
           onBlur={e  => e.target.style.borderColor = 'var(--border)'}
    />
)

export default function SellerProductsPage() {
    const navigate  = useNavigate()
    const imagesRef = useRef()
    const videoRef  = useRef()

    const [products,     setProducts]     = useState([])
    const [loading,      setLoading]      = useState(true)
    const [showForm,     setShowForm]     = useState(false)
    const [editingId,    setEditingId]    = useState(null)
    const [form,         setForm]         = useState(emptyForm)
    const [imagePreviews, setImagePreviews] = useState([])
    const [videoPreview, setVideoPreview] = useState('')
    const [saving,       setSaving]       = useState(false)
    const [error,        setError]        = useState('')
    const [success,      setSuccess]      = useState('')

    useEffect(() => { loadProducts() }, [])

    async function loadProducts() {
        setLoading(true)
        const res = await getMyProducts()
        if (res.success) setProducts(res.products)
        setLoading(false)
    }

    function set(field) {
        return e => setForm(p => ({ ...p, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
    }

    function handleImages(e) {
        const files = Array.from(e.target.files)
        setForm(p => ({ ...p, images: [...p.images, ...files] }))
        setImagePreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))])
    }

    function removeImage(index) {
        setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }))
        setImagePreviews(p => p.filter((_, i) => i !== index))
    }

    function handleVideo(e) {
        const file = e.target.files[0]
        if (!file) return
        setForm(p => ({ ...p, video: file }))
        setVideoPreview(URL.createObjectURL(file))
    }

    function openAdd() {
        setForm(emptyForm); setImagePreviews([]); setVideoPreview('')
        setEditingId(null); setError(''); setSuccess(''); setShowForm(true)
    }

    function openEdit(product) {
        setForm({
            name: product.name, description: product.description,
            category: product.category, price: product.price,
            discount: product.discount, stock: product.stock,
            freeDelivery: product.freeDelivery, deliveryCost: product.deliveryCost,
            images: [], video: null,
        })
        setImagePreviews(product.images.map(getFileUrl))
        setVideoPreview(product.video ? getFileUrl(product.video) : '')
        setEditingId(product._id); setError(''); setSuccess(''); setShowForm(true)
    }

    async function handleSave() {
        setError('')
        if (!form.name || !form.category || !form.price) {
            setError('Name, category and price are required'); return
        }
        setSaving(true)
        const fd = new FormData()
        fd.append('name',         form.name)
        fd.append('description',  form.description)
        fd.append('category',     form.category)
        fd.append('price',        form.price)
        fd.append('discount',     form.discount || 0)
        fd.append('stock',        form.stock    || 0)
        fd.append('freeDelivery', form.freeDelivery)
        fd.append('deliveryCost', form.deliveryCost || 0)
        form.images.forEach(img => fd.append('images', img))
        if (form.video) fd.append('video', form.video)

        const res = editingId
            ? await updateProduct(editingId, fd)
            : await addProduct(fd)

        setSaving(false)
        if (res.success) {
            setSuccess(editingId ? 'Product updated!' : 'Product added!')
            loadProducts()
            setTimeout(() => { setShowForm(false); setSuccess('') }, 1200)
        } else {
            setError(res.message)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this product?')) return
        const res = await deleteProduct(id)
        if (res.success) loadProducts()
    }

    function handleLogout() { logout(); navigate('/') }

    // Calculate discounted price preview
    const previewDiscounted = form.price && form.discount
        ? Math.round(Number(form.price) - (Number(form.price) * Number(form.discount) / 100))
        : null

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
                    }}>My Products</span>
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

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: 4 }}>My Products</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{products.length} product{products.length !== 1 ? 's' : ''} listed</p>
                    </div>
                    <button onClick={openAdd} style={{
                        padding: '11px 24px', background: '#7c3aed', color: '#ffffff',
                        border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem',
                        fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    }}>+ Add Product</button>
                </div>

                {/* ── Add/Edit Form ── */}
                {showForm && (
                    <div style={{
                        background: '#ffffff', border: '1.5px solid #ddd6fe',
                        borderRadius: 'var(--radius)', padding: '32px', marginBottom: 28,
                    }}>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', marginBottom: 24, color: '#7c3aed' }}>
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </h2>

                        {error   && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}
                        {success && <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', color: '#16a34a', fontSize: '0.85rem', marginBottom: 16 }}>✓ {success}</div>}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                            {/* Name */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Product Name *</label>
                                {inp({ placeholder: 'e.g. Italian Marble 60x60', value: form.name, onChange: set('name') })}
                            </div>

                            {/* Category */}
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Category *</label>
                                <select value={form.category} onChange={set('category')} style={{
                                    width: '100%', padding: '10px 13px', border: '1.5px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
                                    color: 'var(--text)', outline: 'none', background: '#ffffff',
                                }}>
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Stock */}
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Stock Quantity *</label>
                                {inp({ type: 'number', placeholder: '0', value: form.stock, onChange: set('stock'), min: 0 })}
                            </div>

                            {/* Price */}
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Original Price (₹) *</label>
                                {inp({ type: 'number', placeholder: '0', value: form.price, onChange: set('price'), min: 0 })}
                            </div>

                            {/* Discount */}
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Discount (%) <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                                {inp({ type: 'number', placeholder: '0', value: form.discount, onChange: set('discount'), min: 0, max: 100 })}
                            </div>

                            {/* Price Preview */}
                            {previewDiscounted !== null && (
                                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: '#f5f3ff', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price preview:</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7c3aed' }}>₹{previewDiscounted}</span>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{form.price}</span>
                                    <span style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>{form.discount}% off</span>
                                </div>
                            )}

                            {/* Delivery */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 10 }}>Delivery</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
                                        <input type="checkbox" checked={form.freeDelivery} onChange={set('freeDelivery')}
                                               style={{ width: 16, height: 16, accentColor: '#7c3aed' }} />
                                        Free Delivery
                                    </label>
                                    {!form.freeDelivery && (
                                        <div style={{ flex: 1 }}>
                                            {inp({ type: 'number', placeholder: 'Delivery cost (₹)', value: form.deliveryCost, onChange: set('deliveryCost'), min: 0 })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Description <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                                <textarea value={form.description} onChange={set('description')}
                                          placeholder="Describe the product — material, finish, dimensions, usage..."
                                          style={{
                                              width: '100%', padding: '10px 13px', border: '1.5px solid var(--border)',
                                              borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
                                              color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                                              resize: 'vertical', minHeight: 90,
                                          }}
                                          onFocus={e => e.target.style.borderColor = '#7c3aed'}
                                          onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                                />
                            </div>

                            {/* Images */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 10 }}>
                                    Product Images <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(up to 10)</span>
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                                    {imagePreviews.map((src, i) => (
                                        <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                                            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1.5px solid var(--border)' }} />
                                            <button onClick={() => removeImage(i)} style={{
                                                position: 'absolute', top: -6, right: -6,
                                                width: 20, height: 20, borderRadius: '50%',
                                                background: '#ef4444', color: '#fff', border: 'none',
                                                fontSize: 12, cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                                            }}>×</button>
                                        </div>
                                    ))}
                                    {imagePreviews.length < 10 && (
                                        <div onClick={() => imagesRef.current.click()} style={{
                                            width: 80, height: 80, border: '2px dashed var(--border)',
                                            borderRadius: 8, display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            fontSize: 24, color: 'var(--text-muted)', gap: 4,
                                        }}>
                                            <span>+</span>
                                            <span style={{ fontSize: 10 }}>Add</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={imagesRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple style={{ display: 'none' }} onChange={handleImages} />
                            </div>

                            {/* Video */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 10 }}>
                                    Product Video <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional — max 50MB)</span>
                                </label>
                                {videoPreview ? (
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <video src={videoPreview} controls style={{ height: 120, borderRadius: 8, border: '1.5px solid var(--border)' }} />
                                        <button onClick={() => { setForm(p => ({ ...p, video: null })); setVideoPreview('') }} style={{
                                            position: 'absolute', top: -6, right: -6,
                                            width: 20, height: 20, borderRadius: '50%',
                                            background: '#ef4444', color: '#fff', border: 'none',
                                            fontSize: 12, cursor: 'pointer', fontWeight: 700,
                                        }}>×</button>
                                    </div>
                                ) : (
                                    <button onClick={() => videoRef.current.click()} style={{
                                        padding: '10px 20px', background: '#f5f3ff', border: '1.5px dashed #ddd6fe',
                                        borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                                        color: '#7c3aed', fontFamily: "'DM Sans', sans-serif",
                                    }}>📹 Upload Video</button>
                                )}
                                <input ref={videoRef} type="file" accept=".mp4,.mov,.webm" style={{ display: 'none' }} onChange={handleVideo} />
                            </div>
                        </div>

                        {/* Form Buttons */}
                        <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
                            <button onClick={handleSave} disabled={saving} style={{
                                padding: '12px 28px', background: saving ? 'var(--border)' : '#7c3aed',
                                color: saving ? 'var(--text-muted)' : '#ffffff', border: 'none',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', fontWeight: 700,
                                cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                            }}>{saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}</button>
                            <button onClick={() => setShowForm(false)} style={{
                                padding: '12px 20px', background: 'none', border: '1.5px solid var(--border)',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', cursor: 'pointer',
                                color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
                            }}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* ── Product List ── */}
                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Loading products...</p>
                ) : products.length === 0 ? (
                    <div style={{ background: '#ffffff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '64px', textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🪨</div>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', marginBottom: 8 }}>No products yet</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>Add your first product to start selling.</p>
                        <button onClick={openAdd} style={{
                            padding: '11px 24px', background: '#7c3aed', color: '#ffffff',
                            border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem',
                            fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>+ Add First Product</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {products.map(p => (
                            <div key={p._id} style={{
                                background: '#ffffff', border: '1.5px solid var(--border)',
                                borderRadius: 'var(--radius)', padding: '20px 24px',
                                display: 'flex', alignItems: 'center', gap: 20,
                            }}>
                                {/* Image */}
                                <div style={{ width: 80, height: 80, borderRadius: 10, background: '#f3f4f6', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {p.images?.[0]
                                        ? <img src={getFileUrl(p.images[0])} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <span style={{ fontSize: 32 }}>🪨</span>}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 4 }}>{p.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>{p.category} · Stock: {p.stock}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1rem' }}>₹{p.discountedPrice}</span>
                                        {p.discount > 0 && <>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.price}</span>
                                            <span style={{ fontSize: '0.78rem', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{p.discount}% off</span>
                                        </>}
                                        {p.freeDelivery
                                            ? <span style={{ fontSize: '0.78rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>Free delivery</span>
                                            : <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>+₹{p.deliveryCost} delivery</span>}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button onClick={() => openEdit(p)} style={{
                                        padding: '8px 16px', background: '#f5f3ff', border: '1.5px solid #ddd6fe',
                                        borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', cursor: 'pointer',
                                        color: '#7c3aed', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                                    }}>Edit</button>
                                    <button onClick={() => handleDelete(p._id)} style={{
                                        padding: '8px 16px', background: '#fef2f2', border: '1.5px solid #fecaca',
                                        borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', cursor: 'pointer',
                                        color: '#ef4444', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                                    }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}