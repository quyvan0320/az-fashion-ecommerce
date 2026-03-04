import {
  useAdminDashboard,
  useRevenueAnalytics,
  useTopProducts,
} from "@/services/queries/useAdmin";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  AlertTriangle,
  Package,
  ShoppingBag,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/admin/Dashboard/StatCard";
import Spinner from "@/components/common/Spinner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatusBadge from "@/components/admin/Dashboard/StatusBadge";
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
  console.log(revenue);
  if (isLoading) {
    return <Spinner />;
  }
  return (
    // stats card
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Doanh thu hôm nay"
          value={formatCurrency(overview?.todayRevenue || 0)}
          icon={<TrendingUp size={18} className="text-green-600" />}
          description={`Tháng: ${formatCurrency(overview?.monthRevenue || 0)}`}
        />

        <StatCard
          title="Tổng đơn hàng"
          value={overview?.totalOrders || 0}
          icon={<ShoppingBag size={18} className="text-blue-600" />}
          description={`Chờ xử lý: ${dashboard?.orders.pending || 0}`}
        />

        <StatCard
          title="Sản phẩm"
          value={overview?.totalProducts || 0}
          icon={<Package size={18} className="text-purple-600" />}
          description={`Sắp hết hàng: ${dashboard?.alerts.lowStockProduct || 0}`}
        />

        <StatCard
          title="Người dùng"
          value={overview?.totalUsers || 0}
          icon={<User size={18} className="text-orange-600" />}
          description={`Danh mục: ${overview?.totalCategories || 0}`}
        />
      </div>

    {/* total revenue */}
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <div className="flex  justify-around">
          <div>
            <p className="text-sm text-gray-500 ">Tổng doanh thu</p>
            <p className="text-2xl font-bold">
              {formatCurrency(overview?.totalRevenue || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 ">Tháng này</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(overview?.monthRevenue || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 ">Năm này</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(overview?.yearRevenue || 0)}
            </p>
          </div>
        </div>
      </div>

    {/* chart revenue */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Doanh thu theo ngày</h3>
          <div className="flex items-center gap-2 text-sm">
            <input
              type="date"
              value={dataRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="border rounded px-2 py-1 text-sm"
            />
            <span className="text-gray-400">→</span>
            <input
              type="date"
              value={dataRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        {revenueLoading ? (
          <Spinner />
        ) : revenue.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            {" "}
            Không có dữ liệu doanh thu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350} key={`${dataRange.startDate}-${dataRange.endDate}`}>
            <AreaChart
              data={revenue}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatDate}
                dy={10}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
               
                domain={["auto", "auto"]}
                tickFormatter={(v) => `${(v / 1000).toLocaleString()}K`}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(v: any) => [formatCurrency(v)]}
                labelFormatter={(label) => `Ngày: ${formatDate(label)}`}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                // Thêm điểm chấm cho đẹp vì dữ liệu đang ít
                dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

          {/* bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* recent order */}
        <div className="bg-white shadow-sm rounded-xl p-6 border">
          <h3 className="font-semibold text-lg mb-4">Đơn hàng gần đây</h3>
          <div className="space-y-3">
            {!dashboard?.recentOrders?.length ? (
              <p className="text-sm text-gray-400 text-center py-6">
                Chưa có đơn hàng
              </p>
            ) : (
              dashboard.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                    <p className="text-sm text-gray-400">{order.email}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">
                      {formatCurrency(order.total)}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

            {/* top products */}
        <div className="bg-white shadow-sm rounded-xl p-6 border">
          <h3 className="font-semibold text-lg mb-4">Sản phẩm bán chạy</h3>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                Chưa có dữ liệu
              </p>
            ) : (
              topProducts.map((item, index) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-5">
                    {index + 1}
                  </span>
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Đã bán: {item.totalSold} | {item.orderCount} đơn
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

            {/* low stock alert */}
      {(dashboard?.alerts?.lowStockProduct || 0) > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-orange-500 shrink-0" />
          <p className="text-sm text-orange-700">
            Có{" "}
            <strong>
              {dashboard?.alerts?.lowStockProduct} sản phẩm sắp hết hàng.{" "}
            </strong>
              <a href="/admin/products" className="underline font-medium">Xem ngay</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
