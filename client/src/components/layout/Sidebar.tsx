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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
        "fixed top-0 left-0 h-full w-64 bg-white border-r z-30 flex flex-col transition-transform duration-300",
        "lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* logo and close btn */}
      <div className="flex items-center justify-between p-5 border-b">
        <h1 className="text-xl font-bold">AZ Fashion</h1>
        <button onClick={onClose} className="lg:hidden">
          <X size={20} />
        </button>
      </div>

      {/* nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100",
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* user info and logout */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-medium text-sm">
            {user?.firstName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.lastName} {user?.firstName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-red-500 text-sm hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
