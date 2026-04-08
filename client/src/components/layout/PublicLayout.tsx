import { ROUTES } from "@/config/constants";
import { useCart } from "@/services/queries/useCart";
import { useAuth } from "@/store/authContext";
import {
  ArrowUp,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useState } from "react";
import { useCategories } from "@/services/queries/useCategories";
import { useCartStore } from "@/store/useCartStore";

const PublicLayout = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { data: cartRes } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const openCart = useCartStore(state => state.openCart)
  const { data: categoriesRes } = useCategories();
  const cartCount = cartRes?.data?.summary?.totalQuantity || 0;
  const categories = categoriesRes?.data || [];

  const shirtCategories = categories.filter((cate) =>
    cate.slug.toLowerCase().includes("ao"),
  );

  const pantCategories = categories.filter((cate) =>
    cate.slug.toLowerCase().includes("quan"),
  );

  const accessoryCategories = categories.filter(
    (cate) =>
      !cate.slug.toLowerCase().includes("ao") &&
      !cate.slug.toLowerCase().includes("quan"),
  );

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className=" bg-brand-light flex flex-col">
      {/* header */}
      <header className="border-b sticky top-0 bg-brand-light z-40">
        <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* logo */}
          <Link
            to={"/"}
            className="font-serif text-3xl font-bold italic tracking-widest text-brand-black"
          >
            AZ Fashion
          </Link>

          {/* nav */}
          <nav className="hidden md:flex items-center gap-6 font-semibold ">
            <Link to={"/"} className="cursor-pointer">
              Sản phẩm mới
            </Link>
            {/* shirt */}
            <div className="group relative flex items-center gap-2 cursor-pointer py-4">
              <span className="flex items-center gap-1  transition-colors">
                Áo nam{" "}
                <ChevronUp
                  size={12}
                  className="transition-transform duration-300 group-hover:rotate-180"
                />
              </span>
              <div
                className="absolute top-full left-0  group-hover:block min-w-[180px] bg-brand-light shadow-xl border border-brand-grey  py-2 z-50 
                  opacity-0 invisible translate-y-3 
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 ease-out"
              >
                {shirtCategories.map((sc) => (
                  <Link
                    className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-grey  transition-all"
                    key={sc.id}
                    to={`${ROUTES.PRODUCTS}/categorySlug=${sc.slug}`}
                  >
                    {sc.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* pant */}
            <div className="group relative flex items-center gap-2 cursor-pointer py-4">
              <span className="flex items-center gap-1  transition-colors">
                Quần nam
                <ChevronUp
                  size={12}
                  className="transition-transform duration-300 group-hover:rotate-180"
                />
              </span>
              <div
                className="absolute top-full left-0  group-hover:block min-w-[180px] bg-brand-light shadow-xl border border-brand-grey  py-2 z-50 
                  opacity-0 invisible translate-y-3 
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 ease-out"
              >
                {pantCategories.map((pc) => (
                  <Link
                    className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-grey  transition-all"
                    key={pc.id}
                    to={`${ROUTES.PRODUCTS}/categorySlug=${pc.slug}`}
                  >
                    {pc.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* accesscory */}
            <div className="group relative flex items-center gap-2 cursor-pointer py-4">
              <span className="flex items-center gap-1  transition-colors">
                Phụ kiện
                <ChevronUp
                  size={12}
                  className="transition-transform duration-300 group-hover:rotate-180"
                />
              </span>
              <div
                className="absolute top-full left-0  group-hover:block min-w-[180px] bg-brand-light shadow-xl border border-brand-grey  py-2 z-50 
                  opacity-0 invisible translate-y-3 
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 ease-out"
              >
                {accessoryCategories.map((ac) => (
                  <Link
                    className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-grey  transition-all"
                    key={ac.id}
                    to={`${ROUTES.PRODUCTS}/categorySlug=${ac.slug}`}
                  >
                    {ac.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to={"/"} className="cursor-pointer">
              Hệ thống cửa hàng
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.LOGIN}
              className="relative p-2 hover:bg-brand-grey rounded-lg"
            >
              <Search size={20} />
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-brand-grey rounded-lg"
            >
              <ShoppingBag size={20} />{" "}
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-xs  w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <Button
                  noHover
                  className="bg-brand-red "
                  variant="outline"
                  size="sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <User size={18} />
                    <span className="hidden md:block">{user?.firstName}</span>
                  </div>
                </Button>

                <div
                  className="absolute right-0 top-full mt-1 w-40 bg-brand-light border rounded shadow-lg  
    opacity-0 invisible translate-y-3 
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 ease-out"
                >
                  <Link to={ROUTES.PROFILE}>
                    <div className="flex items-center gap-2 px-4 py-2.5 text-sm  hover:bg-brand-grey transition-colors">
                      <User size={15} /> Tài khoản
                    </div>
                  </Link>
                  <Link
                    to={`${ROUTES.PROFILE}?tab=orders`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-brand-grey transition-colors"
                  >
                    <ShoppingBag size={15} /> Đơn hàng
                  </Link>
                  {isAdmin && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-brand-grey transition-colors text-purple-600"
                    >
                      <LayoutDashboard size={15} /> Admin
                    </Link>
                  )}

                  <Button
                    onClick={handleLogout}
                    leftIcon={LogOut}
                    size="md"
                    variant="danger"
                    fullWidth
                    className="rounded-none"
                  >
                    Đăng xuất
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="relative p-2 hover:bg-brand-grey rounded-lg"
                >
                  <User size={20} />
                </Link>
              </>
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

      {/* main */}
      <main className="min-h-[70vh]">
        <Outlet />
      </main>

      {/* footer */}
      <footer className="border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          © 2025 AZ Fashion. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
