import { ROUTES } from "@/config/constants";
import { useAuth } from "@/store/authContext";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Tag,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import Logo from "./public/Header/Logo";
// define nav items
const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Sản phẩm",
    href: ROUTES.ADMIN_PRODUCTS,
    icon: Package,
    end: false,
  },
  {
    label: "Đơn hàng",
    href: ROUTES.ADMIN_ORDERS,
    icon: ShoppingCart,
    end: false,
  },
  {
    label: "Danh mục",
    href: ROUTES.ADMIN_CATEGORIES,
    icon: Tag,
    end: false,
  },
  {
    label: "Người dùng",
    href: ROUTES.ADMIN_USERS,
    icon: User,
    end: false,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
    navigate(ROUTES.LOGIN);
  };
  return (
   <aside
      className={cn(
        "fixed top-0 left-0 h-full w-72 bg-white border-r z-50 flex flex-col transition-transform duration-300 shadow-xl lg:shadow-none",
        "lg:relative lg:translate-x-0 lg:w-64",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-5 border-b">
        <Logo/>
        <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={() => { if(window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                isActive
                  ? "bg-brand-red text-white shadow-md shadow-red-200"
                  : "text-gray-500 hover:bg-red-50 hover:text-brand-red",
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-t bg-gray-50/50">
        <div className="flex items-center gap-3 p-2 mb-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-black text-sm ring-4 ring-red-50">
            {user?.firstName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.lastName} {user?.firstName}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-3 text-red-600 text-sm font-bold hover:bg-red-100 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
