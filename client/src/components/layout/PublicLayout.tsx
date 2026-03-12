import { ROUTES } from "@/config/constants";
import { useCart } from "@/services/queries/useCart";
import { useAuth } from "@/store/authContext";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useState } from "react";

const PublicLayout = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { data: cartRes } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartRes?.data?.summary?.totalQuantity || 0;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* navbar */}
      <header className="border-b sticky top-0 bg-white z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={"/"} className="text-lg font-bold tracking-tight">
            AZ Fashion
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm ">
            <Link to={"/"} className="text-gray-500 hover:text-black">
              Trang chủ
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="text-gray-500 hover:text-black"
            >
              Sản phẩm
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* login show cart */}
            {isAuthenticated && (
              <Link
                to={ROUTES.CART}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
              >
                <ShoppingBag size={20} />{" "}
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="outline" size="sm">
                  <div className="flex items-center justify-center gap-2">
                    <User size={18} />
                    <span className="hidden md:block">{user?.firstName}</span>
                  </div>
                </Button>

                <div
                  className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-xl shadow-lg py-1 
    invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100  group-hover:translate-y-0 
    transition-all duration-200 z-50"
                >
                  <Link to={ROUTES.PROFILE}>
                    <div className="flex items-center gap-2 px-4 py-2.5 overflow-hidden text-sm hover:bg-gray-50">
                      <User size={15} /> Tài khoản
                    </div>
                  </Link>
                  <Link
                    to={`${ROUTES.PROFILE}?tab=orders`}
                    className="flex items-center gap-2 px-4 py-2.5 overflow-hidden text-sm hover:bg-gray-50"
                  >
                    <ShoppingBag size={15} /> Đơn hàng
                  </Link>
                  {isAdmin && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 text-purple-600"
                    >
                      <LayoutDashboard size={15} /> Admin
                    </Link>
                  )}
                  <hr className="my-1" />
                  <Button
                    onClick={handleLogout}
                    leftIcon={LogOut}
                    size="md"
                    variant="danger"
                  >
                    Đăng xuất
                  </Button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg  "
                >
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800 "
                >
                  Đăng ký
                </Link>
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* open menu mobile */}
        {menuOpen && (
          <div className="md:hidden border-t px-6 py-4 space-y-2 text-sm bg-white">
            <Link
              to={"/"}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-gray-600"
            >
              Trang chủ
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-gray-600"
            >
              Sản phẩm
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-gray-600"
                >
                  Tài khoản
                </Link>
                {isAdmin && (
                  <Link
                    to={ROUTES.ADMIN_DASHBOARD}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-purple-600"
                  >
                    Admin
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  size="md"
                  className="w-full"
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                {" "}
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-gray-600"
                >
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-gray-600"
                >
                  Đăng ký
                </Link>{" "}
              </>
            )}
          </div>
        )}
      </header>

      <main><Outlet/></main>
        <footer className="border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          © 2025 AZ Fashion. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
