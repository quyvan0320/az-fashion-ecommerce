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
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/public/Home";
import Spinner from "./components/common/Spinner";

// == protected route
const ProtectedRoute = ({
  children,
  requiredAdmin = false,
}: {
  children: React.ReactNode;
  requiredAdmin?: boolean;
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return (
      <Spinner/>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return <>{children}</>;
};

// == guest route no login
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) {
    return (
      <Navigate to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME} replace />
    );
  }
  return <>{children}</>;
};

// == app route
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes only guest */}
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

      {/* admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="categories" element={<Categories />} />
      </Route>

      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

// == main app

const App = () => {
  return <AppRoutes />;
};

export default App;
