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

  // get title by pathname present
  const pageTitle = PAGE_TITLES[pathname] || "Admin";
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-1 rounded hover:bg-gray-100"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={18} />
        </button>

        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium ">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
