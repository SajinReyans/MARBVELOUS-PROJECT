// pages/BuyerDashboard.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { getCurrentUser, logout } from '../services/authService'
import { searchProducts, searchShops, getAllShops, getAllProducts, addToCart, getDistanceKm, fileUrl } from '../services/buyerService'

const CATEGORIES = ['All', 'Tiles', 'Marbles', 'Faucets', 'Sinks', 'Plumbing Tools', 'Other']
const SORTS = [
    { value: 'newest',       label: 'Newest' },
    { value: 'price_asc',   label: 'Price: Low to High' },
    { value: 'price_desc',  label: 'Price: High to Low' },
    { value: 'discount_desc', label: 'Best Discount' },
]

function ProductCard({ p, onAddToCart, onView }) {
    const [adding, setAdding] = useState(false)
    async function handleAdd(e) {
        e.stopPropagation()
        setAdding(true)
        try { await onAddToCart(p._id) } finally { setAdding(false) }
    }
    return (
        <div onClick={() => onView(p._id)} style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
            overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.15s',
        }}
             onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
             onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ height: 160, background: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
                {p.images?.[0]
                    ? <img src={fileUrl(p.images[0])} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🪨</div>}
                {p.discount > 0 && (
                    <span style={{ position: 'absolute', top: 8, left: 8, background: '#ef4444', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{p.discount}% OFF</span>
                )}
                {p.freeDelivery && (
                    <span style={{ position: 'absolute', top: 8, right: 8, background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>FREE DELIVERY</span>
                )}
            </div>
            <div style={{ padding: '14px 14px 10px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{p.store?.storeName || p.seller?.fullName}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1rem' }}>₹{p.discountedPrice}</span>
                    {p.discount > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.price}</span>}
                </div>
                <button onClick={handleAdd} disabled={adding || p.stock === 0} style={{
                    width: '100%', padding: '8px', background: p.stock === 0 ? '#f3f4f6' : '#7c3aed',
                    color: p.stock === 0 ? 'var(--text-muted)' : '#fff', border: 'none',
                    borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600,
                    cursor: p.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}>{p.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : '+ Add to Cart'}</button>
            </div>
        </div>
    )
}

function ShopCard({ shop, distance, onClick }) {
    return (
        <div onClick={onClick} style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
            padding: '16px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center',
            transition: 'box-shadow 0.15s',
        }}
             onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
             onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f3f4f6', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {shop.logo ? <img src={fileUrl(shop.logo)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏪'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: 2 }}>{shop.storeName || shop.seller?.fullName}</p>
                {shop.tagline && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shop.tagline}</p>}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {shop.address?.city && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📍 {shop.address.city}</span>}
                    {distance != null && <span style={{ fontSize: '0.72rem', background: '#f5f3ff', color: '#7c3aed', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{distance} km away</span>}
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{shop.productCount || 0} products</span>
                </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0 }}>›</span>
        </div>
    )
}

export default function BuyerDashboard() {
    const navigate = useNavigate()
    const user     = getCurrentUser()

    const [tab,          setTab]          = useState('products') // 'products' | 'shops'
    const [searchMode,   setSearchMode]   = useState('products') // 'products' | 'shops'
    const [query,        setQuery]        = useState('')
    const [category,     setCategory]     = useState('All')
    const [sort,         setSort]         = useState('newest')
    const [minPrice,     setMinPrice]     = useState('')
    const [maxPrice,     setMaxPrice]     = useState('')
    const [minDiscount,  setMinDiscount]  = useState('')
    const [cityFilter,   setCityFilter]   = useState('')
    const [showFilters,  setShowFilters]  = useState(false)

    const [products,     setProducts]     = useState([])
    const [shops,        setShops]        = useState([])
    const [nearbyShops,  setNearbyShops]  = useState([])
    const [recommended,  setRecommended]  = useState([])
    const [loading,      setLoading]      = useState(true)
    const [cartMsg,      setCartMsg]      = useState('')
    const [buyerLat,     setBuyerLat]     = useState(null)
    const [buyerLng,     setBuyerLng]     = useState(null)

    // Get buyer GPS on mount
    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(pos => {
            setBuyerLat(pos.coords.latitude)
            setBuyerLng(pos.coords.longitude)
        })
        loadAll()
    }, [])

    async function loadAll() {
        setLoading(true)
        const [prodRes, shopRes] = await Promise.all([getAllProducts(), getAllShops()])
        if (prodRes.success) { setProducts(prodRes.products); setRecommended(prodRes.products.slice(0, 6)) }
        if (shopRes.success) setShops(shopRes.shops)
        setLoading(false)
    }

    // Compute nearby shops when GPS available
    useEffect(() => {
        if (buyerLat == null || shops.length === 0) return
        const withDist = shops
            .filter(s => s.location?.lat && s.location?.lng)
            .map(s => ({ ...s, distance: getDistanceKm(buyerLat, buyerLng, s.location.lat, s.location.lng) }))
            .sort((a, b) => a.distance - b.distance)
        setNearbyShops(withDist)
    }, [buyerLat, buyerLng, shops])

    const handleSearch = useCallback(async () => {
        setLoading(true)
        if (searchMode === 'products') {
            const res = await searchProducts({ q: query, category: category !== 'All' ? category : '', minPrice, maxPrice, minDiscount, city: cityFilter, sort })
            if (res.success) setProducts(res.products)
        } else {
            const res = await searchShops({ q: query, city: cityFilter, category: category !== 'All' ? category : '' })
            if (res.success) setShops(res.shops)
        }
        setLoading(false)
    }, [query, searchMode, category, sort, minPrice, maxPrice, minDiscount, cityFilter])

    useEffect(() => {
        const t = setTimeout(() => { if (query) handleSearch() }, 400)
        return () => clearTimeout(t)
    }, [query])

    async function handleAddToCart(productId) {
        try {
            await addToCart(productId, 1)
            setCartMsg('Added to cart!')
            setTimeout(() => setCartMsg(''), 2000)
        } catch { setCartMsg('Failed to add') }
    }

    function handleLogout() { logout(); navigate('/') }

    const displayedProducts = products
    const displayedShops    = tab === 'nearby' ? nearbyShops : shops

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>

            {/* Navbar */}
            <nav style={{
                background: '#fff', borderBottom: '1.5px solid var(--border)',
                padding: '0 40px', height: 64, display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                <Logo size="sm" />
                <div style={{ flex: 1, maxWidth: 500, margin: '0 24px' }}>
                    <div style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#fff' }}>
                        <select value={searchMode} onChange={e => setSearchMode(e.target.value)} style={{
                            padding: '0 12px', border: 'none', borderRight: '1.5px solid var(--border)',
                            background: '#f9fafb', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif",
                            color: 'var(--text)', outline: 'none', cursor: 'pointer',
                        }}>
                            <option value="products">Products</option>
                            <option value="shops">Shops</option>
                        </select>
                        <input
                            value={query} onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            placeholder={searchMode === 'products' ? 'Search products, tiles, marble...' : 'Search shops by name or city...'}
                            style={{
                                flex: 1, padding: '10px 14px', border: 'none', fontSize: '0.88rem',
                                fontFamily: "'DM Sans', sans-serif", outline: 'none', color: 'var(--text)',
                            }}
                        />
                        <button onClick={handleSearch} style={{
                            padding: '0 18px', background: '#7c3aed', border: 'none', color: '#fff',
                            fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                        }}>Search</button>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {cartMsg && <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>{cartMsg}</span>}
                    <button onClick={() => navigate('/buyer/cart')} style={{
                        padding: '8px 16px', background: '#f5f3ff', border: '1.5px solid #ddd6fe',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                        color: '#7c3aed', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                    }}>🛒 Cart</button>
                    <button onClick={() => navigate('/buyer/orders')} style={{
                        padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                        color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
                    }}>My Orders</button>
                    <button onClick={handleLogout} style={{
                        padding: '8px 16px', background: 'none', border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                        color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
                    }}>Logout</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

                {/* Filters Bar */}
                <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 24 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Category pills */}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                            {CATEGORIES.map(c => (
                                <button key={c} onClick={() => setCategory(c)} style={{
                                    padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${category === c ? '#7c3aed' : 'var(--border)'}`,
                                    background: category === c ? '#f5f3ff' : '#fff', color: category === c ? '#7c3aed' : 'var(--text-muted)',
                                    fontSize: '0.8rem', fontWeight: category === c ? 700 : 400, cursor: 'pointer',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}>{c}</button>
                            ))}
                        </div>
                        <button onClick={() => setShowFilters(p => !p)} style={{
                            padding: '7px 14px', background: showFilters ? '#f5f3ff' : '#fff',
                            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-muted)',
                            fontFamily: "'DM Sans', sans-serif",
                        }}>⚙️ Filters</button>
                        <select value={sort} onChange={e => { setSort(e.target.value); handleSearch() }} style={{
                            padding: '7px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", background: '#fff', outline: 'none',
                        }}>
                            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>

                    {showFilters && (
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 5 }}>Min Price (₹)</p>
                                <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" type="number" style={{ width: 100, padding: '7px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 5 }}>Max Price (₹)</p>
                                <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Any" type="number" style={{ width: 100, padding: '7px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 5 }}>Min Discount (%)</p>
                                <input value={minDiscount} onChange={e => setMinDiscount(e.target.value)} placeholder="0" type="number" style={{ width: 110, padding: '7px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 5 }}>City</p>
                                <input value={cityFilter} onChange={e => setCityFilter(e.target.value)} placeholder="Filter by city" style={{ width: 130, padding: '7px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
                            </div>
                            <button onClick={handleSearch} style={{
                                padding: '8px 18px', background: '#7c3aed', color: '#fff', border: 'none',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600,
                                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                            }}>Apply</button>
                            <button onClick={() => { setMinPrice(''); setMaxPrice(''); setMinDiscount(''); setCityFilter(''); setCategory('All'); loadAll() }} style={{
                                padding: '8px 14px', background: '#fff', color: 'var(--text-muted)',
                                border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                            }}>Clear</button>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 4, width: 'fit-content' }}>
                    {[
                        { key: 'products', label: '📦 Products' },
                        { key: 'shops',    label: '🏪 All Shops' },
                        { key: 'nearby',   label: '📍 Near Me' },
                        { key: 'recommended', label: '⭐ Recommended' },
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{
                            padding: '8px 18px', borderRadius: 6, border: 'none',
                            background: tab === t.key ? '#7c3aed' : 'transparent',
                            color: tab === t.key ? '#fff' : 'var(--text-muted)',
                            fontSize: '0.85rem', fontWeight: tab === t.key ? 700 : 400,
                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>{t.label}</button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>Loading...</div>
                ) : (
                    <>
                        {/* Products Tab */}
                        {tab === 'products' && (
                            <div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>{displayedProducts.length} products found</p>
                                {displayedProducts.length === 0
                                    ? <div style={{ textAlign: 'center', padding: '64px 0' }}><div style={{ fontSize: 48, marginBottom: 12 }}>🪨</div><p style={{ color: 'var(--text-muted)' }}>No products found. Try different filters.</p></div>
                                    : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
                                        {displayedProducts.map(p => <ProductCard key={p._id} p={p} onAddToCart={handleAddToCart} onView={id => navigate(`/product/${id}`)} />)}
                                    </div>
                                }
                            </div>
                        )}

                        {/* Shops Tab */}
                        {(tab === 'shops' || tab === 'nearby') && (
                            <div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                                    {tab === 'nearby' ? `${nearbyShops.length} shops with location data` : `${shops.length} shops`}
                                    {tab === 'nearby' && buyerLat == null && <span style={{ color: '#f59e0b' }}> — allow location access to see nearby shops</span>}
                                </p>
                                {displayedShops.length === 0
                                    ? <div style={{ textAlign: 'center', padding: '64px 0' }}><div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div><p style={{ color: 'var(--text-muted)' }}>No shops found.</p></div>
                                    : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {displayedShops.map(s => (
                                            <ShopCard key={s._id} shop={s} distance={s.distance ?? null} onClick={() => navigate(`/shop/${s.slug}`)} />
                                        ))}
                                    </div>
                                }
                            </div>
                        )}

                        {/* Recommended Tab */}
                        {tab === 'recommended' && (
                            <div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>Recommended for you</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
                                    {recommended.map(p => <ProductCard key={p._id} p={p} onAddToCart={handleAddToCart} onView={id => navigate(`/product/${id}`)} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}