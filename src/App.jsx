import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Produk from "./pages/Produk";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/auth/Login";
import Loading from "./components/Loading";
import Components from "./pages/Components";
import FiturXYZ from "./pages/main/FiturXYZ";
import Note from "./pages/main/Note";
import MemberLayout from './pages/member/MemberLayout';
import Catalog from './pages/member/Catalog';
import CreateOrder from './pages/member/CreateOrder';
import OrderHistory from './pages/member/OrderHistory';
import Register from './pages/auth/Register';

// Lazy load ProductDetail component
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));

// Guest route: redirect to dashboard if already logged in
function GuestRoute({ children }) {
    const { user, profile, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loading />
            </div>
        )
    }

    if (user && profile) {
        if (profile.role === 'Admin') {
            return <Navigate to="/dashboard" replace />
        }
        return <Navigate to="/member/catalog" replace />
    }

    return children
}

export default function App() {
  return (
    <Routes>
      {/* Landing Page - Tanpa Layout Admin/Member */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes - tanpa Sidebar */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        } />
      </Route>

      {/* Admin Routes - dengan Sidebar & Header */}
      <Route element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/fitur-xyz" element={<FiturXYZ />} />
        <Route path="/notes" element={<Note />} />
        <Route path="/products/:id" element={
          <Suspense fallback={<Loading />}>
            <ProductDetail />
          </Suspense>
        } />
        <Route path="/produk" element={<Produk />} />
        <Route path="/components" element={<Components />} />
        
        {/* Error Routes */}
        <Route path="/error-400" element={<ErrorPage code="400" title="Bad Request" description="Permintaan tidak dapat diproses oleh server." image="https://illustrations.popsy.co/gray/falling.svg" />} />
        <Route path="/error-401" element={<ErrorPage code="401" title="Unauthorized" description="Anda harus login terlebih dahulu." image="https://illustrations.popsy.co/gray/shaking-hands.svg" />} />
        <Route path="/error-403" element={<ErrorPage code="403" title="Forbidden" description="Anda tidak memiliki akses ke halaman ini." image="https://illustrations.popsy.co/gray/stop.svg" />} />
        
        {/* 404 Not Found */}
        <Route path="*" element={<ErrorPage code="404" title="Page Not Found" description="Halaman yang anda cari raib entah kemana." />} />
      </Route>

      {/* Member Routes - dengan Member Sidebar */}
      <Route element={
        <ProtectedRoute allowedRoles={['Member']}>
          <MemberLayout />
        </ProtectedRoute>
      }>
        <Route path="/member/catalog" element={<Catalog />} />
        <Route path="/member/order" element={<CreateOrder />} />
        <Route path="/member/history" element={<OrderHistory />} />
      </Route>
    </Routes>
  );
}