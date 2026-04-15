import { useAuth } from "@/store/authContext";
import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Quản lý sản phẩm",
  "/admin/orders": "Quản lý đơn hàng",
  "/admin/categories": "Quản lý danh mục",
  "/admin/users": "Quản lý người dùng",
};

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const pageTitle = PAGE_TITLES[pathname] || "Hệ thống Quản trị";

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-red-50 text-brand-red transition-colors"
          onClick={onMenuClick}
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>
        <h2 className="text-base lg:text-lg font-black text-gray-800 uppercase tracking-tight">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications */}
        <button className="p-2.5 rounded-xl hover:bg-gray-100 relative text-gray-500 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border-2 border-white"></span>
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-brand-red text-white flex items-center justify-center text-sm font-black shadow-lg shadow-red-200">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
