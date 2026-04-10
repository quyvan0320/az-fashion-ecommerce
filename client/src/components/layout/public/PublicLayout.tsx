import { ROUTES } from "@/config/constants";
import { useCart } from "@/services/queries/useCart";
import { useAuth } from "@/store/authContext";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCategories } from "@/services/queries/useCategories";
import { useCartStore } from "@/store/useCartStore";
import Logo from "./Header/Logo";
import DesktopNav from "./Header/DesktopNav";
import UserActions from "./Header/UserActions";
import MobileMenu from "./Header/MobileMenu";

const PublicLayout = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { data: cartRes } = useCart();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
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

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // Clean up
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  useEffect(() => {
    const handleShadow = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleShadow);
    return () => window.removeEventListener("scroll", handleShadow);
  }, []);

  return (
    <div className=" bg-brand-light flex flex-col">
      {/* header */}
      <header
        className={`border-b sticky top-0 bg-brand-light z-40 transition-all duration-300 ${
          isScrolled ? "shadow-md py-2" : "shadow-none py-4"
        } ${show ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <Logo />

          <DesktopNav
            shirtCategories={shirtCategories}
            pantCategories={pantCategories}
            accessoryCategories={accessoryCategories}
          />

          <UserActions
            isAuthenticated={isAuthenticated}
            user={user}
            isAdmin={isAdmin}
            handleLogout={handleLogout}
            cartCount={cartCount}
            openCart={openCart}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        </div>

        <MobileMenu
          isOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          categories={categories}
          isAuthenticated={isAuthenticated}
          user={user}
          isAdmin={isAdmin}
          handleLogout={handleLogout}
        />
      </header>

      {/* main */}
      <main className="min-h-[70vh]">
        <Outlet />
      </main>

      {/* footer */}
      <footer className="border-t py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm font-semibold text-brand-dark">
          © 2026 AZ Fashion. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
