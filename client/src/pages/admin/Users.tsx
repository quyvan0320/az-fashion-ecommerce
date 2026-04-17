import Input from "@/components/common/Input";
import Spinner from "@/components/common/Spinner";
import {
  useAdminUsers,
  useDeleteUser,
  useUpdateUserRole,
  useUserStats,
} from "@/services/queries/useAdmin";
import { useAuth } from "@/store/authContext";
import { formatDate } from "@/utils/formatters";
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  Users as UsersIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const Users = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const { user: currentUser } = useAuth();

  const { data: res, isLoading } = useAdminUsers({
    page,
    limit: 10,
    search: search || undefined,
    role: roleFilter || undefined,
  });

  const { data: statsRes } = useUserStats();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: deleteUser } = useDeleteUser();

  const users = res?.data || [];
  const pagination = res?.pagination;
  const stats = statsRes?.data;

  const handleToggleRole = (id: string, currentRole: "ADMIN" | "CUSTOMER") => {
    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    const msg =
      newRole === "ADMIN"
        ? "Bạn có muốn cấp quyền Admin cho người dùng này?"
        : "Bạn có muốn thu hồi quyền Admin?";
    if (window.confirm(msg)) {
      updateRole({ id, role: newRole });
    }
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("Xóa người dùng này? Hành động này không thể hoàn tác")
    ) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Helmet>
        <title>Az Fashion - Quản lý người dùng</title>
      </Helmet>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-brand-dark flex items-center gap-2">
          <UsersIcon className="text-brand-red" />
          Người dùng
          {pagination && (
            <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {pagination?.total}
            </span>
          )}
        </h1>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Tổng người dùng",
              value: stats.total,
              color: "text-gray-900",
            },
            {
              label: "Quản trị viên",
              value: stats.admins,
              color: "text-purple-600",
            },
            {
              label: "Khách hàng",
              value: stats.customers,
              color: "text-blue-600",
            },
            {
              label: "Mới trong tháng",
              value: stats.recentUsers?.length || 0,
              color: "text-green-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {stat.label}
              </p>
              <p className={`text-2xl font-black mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Input
            leftIcon={Search}
            value={search}
            placeholder="Tìm theo tên"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-black/5 transition-all"
        >
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên</option>
          <option value="CUSTOMER">Khách hàng</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Thành viên
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Vai trò
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Hoạt động
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Ngày tham gia
                  </th>
                  <th className="text-right px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-20 text-gray-500 font-medium"
                    >
                      Không tìm thấy người dùng nào phù hợp
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isSelf = user.id === currentUser?.id;
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-sm font-black shadow-sm uppercase">
                              {user.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 flex items-center gap-1">
                                {user.lastName} {user.firstName}
                                {isSelf && (
                                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md uppercase">
                                    Bạn
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-400">
                                {user.email}
                              </p>
                              <p className="text-xs text-gray-400">
                                {user.phone || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-tight ${
                              user.role === "ADMIN"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-gray-600">
                              {user._count?.orders || 0} đơn hàng
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {user._count?.reviews || 0} đánh giá
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!isSelf && (
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  handleToggleRole(user.id, user.role)
                                }
                                disabled={isUpdatingRole}
                                className={`p-2 rounded-xl transition-all shadow-sm border border-gray-100 ${
                                  user.role === "ADMIN"
                                    ? "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white"
                                    : "bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white"
                                }`}
                                title={
                                  user.role === "ADMIN"
                                    ? "Thu hồi Admin"
                                    : "Cấp Admin"
                                }
                              >
                                {user.role === "ADMIN" ? (
                                  <ShieldOff size={16} />
                                ) : (
                                  <Shield size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Section */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 bg-gray-50/30">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Trang {pagination.page} / {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                className="p-2 border border-gray-200 rounded-xl bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="p-2 border border-gray-200 rounded-xl bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
