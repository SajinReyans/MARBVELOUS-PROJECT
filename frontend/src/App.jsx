// App.jsx
// React Router setup for all pages.
// Includes protected routes for dashboards.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage       from './pages/LandingPage'
import AuthChoicePage    from './pages/AuthChoicePage'
import LoginPage         from './pages/LoginPage'
import BuyerSignupPage   from './pages/BuyerSignupPage'
import SellerSignupPage  from './pages/SellerSignupPage'
import SuccessPage       from './pages/SuccessPage'
import BuyerDashboard    from './pages/BuyerDashboard'
import SellerDashboard   from './pages/SellerDashboard'
import { isLoggedIn, getCurrentUser } from './services/authService'

// ── Protected Route ───────────────────────────────────
// Redirects to /login if user is not logged in
// Redirects to correct dashboard if role doesn't match
function ProtectedRoute({ children, requiredRole }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  const user = getCurrentUser()
  if (requiredRole && user?.role !== requiredRole) {
    // Wrong role — send to their own dashboard
    return <Navigate to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} replace />
  }
  return children
}

export default function App() {
  return (
      <BrowserRouter>
        <Routes>

          {/* ── Public Routes ── */}
          <Route path="/"       element={<LandingPage />} />
          <Route path="/auth"   element={<AuthChoicePage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup/buyer"  element={<BuyerSignupPage />} />
          <Route path="/signup/seller" element={<SellerSignupPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* ── Protected Routes ── */}
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute requiredRole="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seller/dashboard" element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          } />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
  )
}