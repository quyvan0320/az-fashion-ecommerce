import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./store/authContext";
import { ROUTES } from "./config/constants";
import React from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Categories from "./pages/admin/Categories";
import PublicLayout from "./components/layout/public/PublicLayout";
import Home from "./pages/public/home";
import Spinner from "./components/common/Spinner";
import Profile from "./pages/public/profile";
import Product from "./pages/public/product";
import ProductDetail from "./pages/public/product/ProductDetail";
import Cart from "./pages/public/cart";
import Checkout from "./pages/public/checkout";
import Search from "./pages/public/Search";
import NotFound from "./pages/public/NotFoud";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
};

// Require admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// == app route
const AppRoutes = () => (
  <Routes>
    {/* Auth */}
    <Route
      path={ROUTES.LOGIN}
      element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      }
    />
    <Route
      path={ROUTES.REGISTER}
      element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      }
    />

    {/* Public */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path={ROUTES.PRODUCTS} element={<Product />} />
      <Route path={`${ROUTES.PRODUCTS}/:slug`} element={<ProductDetail />} />
      <Route path={ROUTES.SEARCH} element={<Search />} />
      <Route
        path={ROUTES.CART}
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CHECKOUT}
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Admin */}
    <Route
      path={ROUTES.ADMIN_DASHBOARD}
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path={ROUTES.ADMIN_PRODUCTS} element={<Products />} />
      <Route path={ROUTES.ADMIN_CATEGORIES} element={<Categories />} />
      <Route path={ROUTES.ADMIN_ORDERS} element={<Orders />} />
      <Route path={ROUTES.ADMIN_USERS} element={<Users />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
// == main app

const App = () => {
  return <AppRoutes />;
};

export default App;
