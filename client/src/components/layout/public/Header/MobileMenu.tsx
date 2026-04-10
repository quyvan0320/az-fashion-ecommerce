import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  UserCircle,
} from "lucide-react";

export const MobileMenu = ({
  isOpen,
  setMenuOpen,
  categories,
  isAuthenticated,
  user,
  isAdmin,
  handleLogout,
}: any) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter danh mục giống như bên ngoài
  const shirtCategories = categories.filter((c: any) => c.slug.includes("ao"));
  const pantCategories = categories.filter((c: any) => c.slug.includes("quan"));
  const accessoryCategories = categories.filter(
    (c: any) => !c.slug.includes("ao") && !c.slug.includes("quan"),
  );

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLinkClick = () => {
    setMenuOpen(false); // Đóng menu khi người dùng chọn một link
  };

  return (
    <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t shadow-2xl z-50 animate-in slide-in-from-top duration-300 overflow-y-auto max-h-[80vh]">
      <div className="flex flex-col p-6 space-y-2 font-medium">
        <div className="pb-4 mb-2 border-b-2 border-gray-100">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center font-bold">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Xin chào,</p>
                  <p className="font-bold text-brand-dark">{user?.firstName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={ROUTES.PROFILE}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 p-3 text-sm bg-gray-50 rounded-lg"
                >
                  <User size={16} /> Hồ sơ
                </Link>
                {isAdmin && (
                  <Link
                    to={ROUTES.ADMIN_DASHBOARD}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 p-3 text-sm bg-purple-50 text-purple-700 rounded-lg"
                  >
                    <LayoutDashboard size={16} /> Admin
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-2 w-full py-3 bg-brand-dark text-white rounded-xl"
            >
              <UserCircle size={20} /> Đăng nhập / Đăng ký
            </Link>
          )}
        </div>
        <Link
          to={ROUTES.PRODUCTS}
          onClick={handleLinkClick}
          className="py-3 border-b border-gray-50 text-brand-dark"
        >
          Sản phẩm mới
        </Link>

        <div className="border-b border-gray-50">
          <button
            onClick={() => toggleSection("shirts")}
            className="flex items-center justify-between w-full py-3 text-brand-dark"
          >
            <span>Áo nam</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${openSection === "shirts" ? "rotate-180" : ""}`}
            />
          </button>

          {openSection === "shirts" && (
            <div className="pl-4 pb-3 space-y-3 bg-gray-50 rounded-lg mt-1 p-3">
              {shirtCategories.map((sc: any) => (
                <Link
                  key={sc.id}
                  to={`${ROUTES.PRODUCTS}?categorySlug=${sc.slug}`}
                  onClick={handleLinkClick}
                  className="block text-sm text-gray-600"
                >
                  {sc.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-gray-50">
          <button
            onClick={() => toggleSection("pants")}
            className="flex items-center justify-between w-full py-3 text-brand-dark"
          >
            <span>Quần nam</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${openSection === "pants" ? "rotate-180" : ""}`}
            />
          </button>

          {openSection === "pants" && (
            <div className="pl-4 pb-3 space-y-3 bg-gray-50 rounded-lg mt-1 p-3">
              {pantCategories.map((pc: any) => (
                <Link
                  key={pc.id}
                  to={`${ROUTES.PRODUCTS}?categorySlug=${pc.slug}`}
                  onClick={handleLinkClick}
                  className="block text-sm text-gray-600"
                >
                  {pc.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-gray-50">
          <button
            onClick={() => toggleSection("acc")}
            className="flex items-center justify-between w-full py-3 text-brand-dark"
          >
            <span>Phụ kiện</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${openSection === "acc" ? "rotate-180" : ""}`}
            />
          </button>

          {openSection === "acc" && (
            <div className="pl-4 pb-3 space-y-3 bg-gray-50 rounded-lg mt-1 p-3">
              {accessoryCategories.map((ac: any) => (
                <Link
                  key={ac.id}
                  to={`${ROUTES.PRODUCTS}?categorySlug=${ac.slug}`}
                  onClick={handleLinkClick}
                  className="block text-sm text-gray-600"
                >
                  {ac.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="/" onClick={handleLinkClick} className="py-3 text-brand-dark">
          Hệ thống cửa hàng
        </Link>

        {isAuthenticated && (
          <button
            onClick={() => {
              handleLogout();
              handleLinkClick();
            }}
            className="flex items-center gap-2 py-4 text-red-500 mt-4 border-t border-gray-100"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
