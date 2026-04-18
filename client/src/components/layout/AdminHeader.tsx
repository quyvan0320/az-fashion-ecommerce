import { ROUTES } from "@/config/constants";
import { useAdminOrders } from "@/services/queries/useOders";
import { useAuth } from "@/store/authContext";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { Bell, Clock, Menu, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const { data: res } = useAdminOrders({});
  const orders = res?.data || [];
  const navigate = useNavigate();
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  console.log(pendingOrders);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="h-16 bg-brand-light/80 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-red-50 text-brand-red transition-colors"
          onClick={onMenuClick}
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>
        <h2 className="text-base lg:text-lg font-black text-brand-dark uppercase tracking-tight">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications Area */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all relative ${
              showNotifications
                ? "bg-red-50 text-brand-red"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <Bell size={20} />
            {pendingOrders.length > 0 && (
              <span className="absolute top-2 right-2.5 w-4 h-4 bg-brand-red text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {pendingOrders.length}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-black text-sm uppercase tracking-wider text-gray-900">
                  Đơn hàng mới
                </h3>
                <span className="text-[10px] bg-brand-red text-white px-2 py-0.5 rounded-full font-bold">
                  {pendingOrders.length} PENDING
                </span>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {pendingOrders.length === 0 ? (
                  <div className="p-10 text-center">
                    <ShoppingBag
                      size={32}
                      className="mx-auto text-gray-200 mb-2"
                    />
                    <p className="text-xs font-bold text-gray-400">
                      Không có đơn hàng chờ
                    </p>
                  </div>
                ) : (
                  pendingOrders.map((order: any) => (
                    <button
                      key={order.id}
                      onClick={() => {
                        navigate(ROUTES.ADMIN_ORDERS);
                        setShowNotifications(false);
                      }}
                      className="w-full p-4 text-left hover:bg-red-50 border-b border-gray-50 last:border-0 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-black text-xs text-gray-900 group-hover:text-brand-red">
                          #{order.orderNumber}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {formatDateTime(order.createdAt)}
                      </span>
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500 font-medium truncate">
                          Khách: {order.user.lastName} {order.user.firstName}
                        </p>
                      </div>

                      <p className="text-xs font-black text-brand-red mt-1">
                        {formatCurrency(order.total)}
                      </p>
                    </button>
                  ))
                )}
              </div>

              {pendingOrders.length > 0 && (
                <button
                  onClick={() => {
                    navigate(ROUTES.ADMIN_ORDERS);
                    setShowNotifications(false);
                  }}
                  className="w-full py-3 bg-gray-50 text-[11px] font-black text-center text-gray-500 hover:text-brand-red transition-colors border-t"
                >
                  XEM TẤT CẢ ĐƠN HÀNG
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-brand-red text-white flex items-center justify-center text-sm font-black shadow-lg shadow-red-200">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
