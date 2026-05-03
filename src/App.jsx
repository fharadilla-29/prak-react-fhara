import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";


import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AuthLayout from "./layouts/AuthLayout";
import ErrorLayout from "./layouts/ErrorLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";
import Loading from "./components/Loading";

const Dashboard = React.lazy(() => import("./pages/Main/Dashboard"));
const Customers = React.lazy(() => import("./pages/Main/Customers"));
const Orders = React.lazy(() => import("./pages/Main/Orders"));
const Menu = React.lazy(() => import("./pages/main/Menu"));
const NotFound = React.lazy(() => import("./pages/main/NotFound"));
const ErrorPage = React.lazy(() => import("./pages/main/ErrorPage"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout")); 




export default function App() {
  return (
    
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rute Utama (Membutuhkan MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/menu" element={<Menu />} />

          {/* Error Routes */}
          <Route
            path="/error-400"
            element={
              <ErrorPage
                code="400"
                title="Bad Request"
                description="Permintaan tidak dapat diproses oleh server."
                image="https://illustrations.popsy.co/gray/falling.svg"
              />
            }
          />
          <Route
            path="/error-401"
            element={
              <ErrorPage
                code="401"
                title="Unauthorized"
                description="Anda harus login terlebih dahulu."
                image="https://illustrations.popsy.co/gray/shaking-hands.svg"
              />
            }
          />
          <Route
            path="/error-403"
            element={
              <ErrorPage
                code="403"
                title="Forbidden"
                description="Anda tidak memiliki akses ke halaman ini."
                image="https://illustrations.popsy.co/gray/stop.svg"
              />
            }
          />

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <ErrorPage
                code="404"
                title="Page Not Found"
                description="Halaman yang anda cari raib entah kemana."
              />
            }
          />
        </Route>

        {/* Rute Autentikasi (Membutuhkan AuthLayout) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}





   