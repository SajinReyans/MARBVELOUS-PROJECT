import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage      from './pages/LandingPage'
import AuthChoicePage   from './pages/AuthChoicePage'
import LoginPage        from './pages/LoginPage'
import BuyerSignupPage  from './pages/BuyerSignupPage'
import SellerSignupPage from './pages/SellerSignupPage'
import SuccessPage      from './pages/SuccessPage'

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
        {/* Catch-all → redirect to home */}
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
