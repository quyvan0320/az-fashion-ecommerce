import { ROUTES } from "@/config/constants";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";

export const UserActions = ({
  isAuthenticated,
  user,
  cartCount,
  isAdmin,
  handleLogout,
  openCart,
  setMenuOpen,
  menuOpen,
}: any) => {
  return (
    <div className="flex items-center gap-1 md:gap-3">
      {/* Search  */}
      <Link
        to={ROUTES.SEARCH}
        className="p-2 hover:bg-brand-grey rounded-full transition-colors"
      >
        <Search size={22} />
      </Link>

      {/* Cart  */}
      <button
        onClick={openCart}
        className="relative p-2 hover:bg-brand-grey rounded-full transition-colors"
      >
        <ShoppingBag size={22} />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </button>

      {/* * User Menu  */}
      <div className="hidden sm:block">
        {isAuthenticated ? (
          <UserDropdown
            user={user}
            isAdmin={isAdmin}
            handleLogout={handleLogout}
          />
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="p-2 hover:bg-brand-grey rounded-full block transition-colors"
          >
            <User size={22} />
          </Link>
        )}
      </div>

      {/* Hamburger Menu - Chỉ hiện trên Mobile & Tablet (< 1024px) */}
      <button
        className="lg:hidden p-2 hover:bg-brand-grey rounded-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default UserActions;
