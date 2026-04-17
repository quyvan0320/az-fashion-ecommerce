import { useState } from "react";
import {
  AlertTriangle,
  Package,
  ShoppingBag,
  TrendingUp,
  User,
  Calendar,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useAdminDashboard,
  useRevenueAnalytics,
  useTopProducts,
} from "@/services/queries/useAdmin";
import { formatCurrency, formatDate } from "@/utils/formatters";
import StatCard from "@/components/admin/Dashboard/StatCard";
import Spinner from "@/components/common/Spinner";
import StatusBadge from "@/components/admin/Dashboard/StatusBadge";
import { Helmet } from "react-helmet-async";

const Dashboard = () => {
  const [dataRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: dashboardRes, isLoading } = useAdminDashboard();
  const { data: revenueRes, isLoading: revenueLoading } =
    useRevenueAnalytics(dataRange);
  const { data: topProductsRes } = useTopProducts({ limit: 5 });

  const dashboard = dashboardRes?.data;
  const overview = dashboard?.overview;
  const revenue = revenueRes?.data || [];
  const topProducts = topProductsRes?.data || [];

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6 w-full pb-8">
      <Helmet>
        <title>Az Fashion - Dashboard</title>
      </Helmet>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Doanh thu hôm nay"
          value={formatCurrency(overview?.todayRevenue || 0)}
          icon={<TrendingUp size={20} className="text-brand-red" />}
          description={`Tháng: ${formatCurrency(overview?.monthRevenue || 0)}`}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={overview?.totalOrders || 0}
          icon={<ShoppingBag size={20} className="text-brand-red" />}
          description={`Chờ xử lý: ${dashboard?.orders.pending || 0}`}
        />
        <StatCard
          title="Sản phẩm"
          value={overview?.totalProducts || 0}
          icon={<Package size={20} className="text-brand-red" />}
          description={`Sắp hết hàng: ${dashboard?.alerts.lowStockProduct || 0}`}
        />
        <StatCard
          title="Người dùng"
          value={overview?.totalUsers || 0}
          icon={<User size={20} className="text-brand-red" />}
          description={`Danh mục: ${overview?.totalCategories || 0}`}
        />
      </div>

      <div className="bg-brand-light rounded-xl p-6 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="md:border-r border-brand-grey last:border-0">
            <p className="text-sm text-brand-dark mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(overview?.totalRevenue || 0)}
            </p>
          </div>
          <div className="md:border-r border-brand-grey last:border-0">
            <p className="text-sm text-brand-dark mb-1">Tháng này</p>
            <p className="text-2xl font-bold text-brand-red">
              {formatCurrency(overview?.monthRevenue || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-dark mb-1">Năm này</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(overview?.yearRevenue || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Revenue Chart - Brand Color Theme */}
      <div className="bg-brand-light rounded-xl shadow-sm p-4 sm:p-6 border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Calendar size={20} className="text-brand-red" />
            Doanh thu theo ngày
          </h3>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <input
              type="date"
              value={dataRange.startDate}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, startDate: e.target.value }))
              }
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-brand-red outline-none"
            />
            <span className="text-gray-400">→</span>
            <input
              type="date"
              value={dataRange.endDate}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, endDate: e.target.value }))
              }
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>
        </div>

        <div className="h-[350px] w-full overflow-hidden">
          {revenueLoading ? (
            <div className="h-full flex items-center justify-center">
              <Spinner />
            </div>
          ) : revenue.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
              Không có dữ liệu
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenue}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="brandGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatDate}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toLocaleString()}K`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  formatter={(v: any) => [formatCurrency(v), "Doanh thu"]}
                  labelFormatter={(label) => `Ngày: ${formatDate(label)}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DC2626"
                  strokeWidth={3}
                  fill="url(#brandGradient)"
                  dot={{
                    r: 4,
                    fill: "#DC2626",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 4. Bottom Row: Orders & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-brand-light shadow-sm rounded-xl p-6 border overflow-x-auto">
          <h3 className="font-bold text-lg mb-4">Đơn hàng mới nhất</h3>
          <div className="min-w-[400px] space-y-4">
            {!dashboard?.recentOrders?.length ? (
              <p className="text-sm text-gray-400 text-center py-6">
                Chưa có đơn hàng
              </p>
            ) : (
              dashboard.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-brand-dark truncate">
                      {order.customer}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-bold text-brand-red">
                      {formatCurrency(order.total)}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-brand-light shadow-sm rounded-xl p-6 border">
          <h3 className="font-bold text-lg mb-4">Top bán chạy</h3>
          <div className="space-y-4">
            {topProducts.map((item, index) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 group"
              >
                <span
                  className={`text-sm font-black w-6 ${index === 0 ? "text-brand-red" : "text-gray-300"}`}
                >
                  0{index + 1}
                </span>
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="h-12 w-12 rounded-xl object-cover bg-gray-50 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate group-hover:text-brand-red transition-colors">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-brand-dark font-medium">
                    Đã bán:{" "}
                    <span className="text-gray-900 font-bold">
                      {item.totalSold}
                    </span>{" "}
                    | {item.orderCount} đơn
                  </p>
                </div>
                <p className="text-sm font-black text-gray-900">
                  {formatCurrency(item.product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Alert Low Stock */}
      {(dashboard?.alerts?.lowStockProduct || 0) > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
          <div className="bg-brand-red p-2 rounded-lg shadow-lg">
            <AlertTriangle size={20} className="text-branbg-brand-light" />
          </div>
          <p className="text-sm text-red-800">
            Cảnh báo: Hiện có{" "}
            <strong>{dashboard?.alerts?.lowStockProduct}</strong> sản phẩm sắp
            hết hàng trong kho.
            <a
              href="/admin/products"
              className="ml-2 underline font-black hover:text-red-600 transition-colors"
            >
              Kiểm tra ngay
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
