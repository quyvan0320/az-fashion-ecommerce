import { Link } from "react-router-dom";
import {
  User,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { ROUTES } from "@/config/constants";
import Button from "@/components/common/Button";

interface UserDropdownProps {
  user: any;
  isAdmin: boolean;
  handleLogout: () => void;
}

const UserDropdown = ({ user, isAdmin, handleLogout }: UserDropdownProps) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 hover:bg-brand-grey rounded-lg transition-all border border-transparent hover:border-gray-200">
        <div className="w-8 h-8 bg-brand-dark text-white rounded-full flex items-center justify-center text-sm font-bold">
          {user?.firstName?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="hidden xl:block font-semibold text-sm text-brand-dark">
          {user?.firstName}
        </span>
        <ChevronDown
          size={14}
          className="transition-transform duration-300 group-hover:rotate-180"
        />
      </button>

      <div
        className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 
          opacity-0 invisible translate-y-3 
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
          transition-all duration-300 ease-out overflow-hidden"
      >
        <div className="py-2">
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User size={18} className="text-gray-400" />
            Tài khoản của tôi
          </Link>

          <Link
            to={`${ROUTES.PROFILE}?tab=orders`}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag size={18} className="text-gray-400" />
            Lịch sử đơn hàng
          </Link>

          {isAdmin && (
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              className="flex items-center gap-3 px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-colors border-t border-gray-50"
            >
              <LayoutDashboard size={18} />
              Trang quản trị (Admin)
            </Link>
          )}

          <div className="p-2 border-t border-gray-50">
            <Button
              onClick={handleLogout}
              variant="danger"
              size="sm"
              fullWidth
              className="justify-start gap-3 h-10 rounded-lg font-medium"
            >
              <LogOut size={18} />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
