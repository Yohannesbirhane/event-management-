import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useState, useEffect } from 'react'

// User components
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'

// Admin components
import AdminLayout from './admin/layouts/AdminLayout'
import AdminDashboard from './admin/pages/Dashboard'
import AdminUsers from './admin/pages/Users'
import AdminBookings from './admin/pages/Bookings'
import AdminServices from './admin/pages/Services'
import AdminGallery from './admin/pages/Gallery'
import AdminReports from './admin/pages/Reports'
import AdminProfile from './admin/pages/Profile'

// Protected Route Components
const ProtectedUserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  // Only allow users with role 'user'
  return isAuthenticated && user?.role === 'user' ? children : <Navigate to="/login" />
}

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/admin/login" />
}

// Main App Content
function AppContent() {
  const { isAuthenticated, user } = useAuth()
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* User Routes */}
      <Route path="/*" element={
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedUserRoute>
                  <Profile />
                </ProtectedUserRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MainLayout>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        isAuthenticated && user?.role === 'admin' ? (
          <AdminLayout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/bookings" element={<AdminBookings />} />
              <Route path="/services" element={<AdminServices />} />
              <Route path="/gallery" element={<AdminGallery />} />
              <Route path="/reports" element={<AdminReports />} />
              <Route path="/profile" element={<AdminProfile />} />
              <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
          </AdminLayout>
        ) : (
          <Navigate to="/admin/login" />
        )
      } />
      
      <Route path="/admin/login" element={<Login isAdminLogin={true} />} />
    </Routes>
  )
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App