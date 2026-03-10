// App.jsx
// React Router setup for all pages.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage        from './pages/LandingPage'
import AuthChoicePage     from './pages/AuthChoicePage'
import LoginPage          from './pages/LoginPage'
import BuyerSignupPage    from './pages/BuyerSignupPage'
import SellerSignupPage   from './pages/SellerSignupPage'
import SuccessPage        from './pages/SuccessPage'
import BuyerDashboard     from './pages/BuyerDashboard'
import SellerDashboard    from './pages/SellerDashboard'
import SellerStorePage    from './pages/SellerStorePage'
import SellerProductsPage from './pages/SellerProductsPage'
import SellerProfilePage  from './pages/SellerProfilePage'
import { isLoggedIn, getCurrentUser } from './services/authService'

function ProtectedRoute({ children, requiredRole }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  const user = getCurrentUser()
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} replace />
  }
  return children
}

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<LandingPage />} />
          <Route path="/auth"          element={<AuthChoicePage />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/signup/buyer"  element={<BuyerSignupPage />} />
          <Route path="/signup/seller" element={<SellerSignupPage />} />
          <Route path="/success"       element={<SuccessPage />} />
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute requiredRole="buyer"><BuyerDashboard /></ProtectedRoute>
          } />
          <Route path="/seller/dashboard" element={
            <ProtectedRoute requiredRole="seller"><SellerDashboard /></ProtectedRoute>
          } />
          <Route path="/seller/store" element={
            <ProtectedRoute requiredRole="seller"><SellerStorePage /></ProtectedRoute>
          } />
          <Route path="/seller/products" element={
            <ProtectedRoute requiredRole="seller"><SellerProductsPage /></ProtectedRoute>
          } />
          <Route path="/seller/profile" element={
            <ProtectedRoute requiredRole="seller"><SellerProfilePage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  )
}