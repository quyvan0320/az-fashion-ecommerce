import Button from "@/components/common/Button";
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
import { Search, Shield, ShieldOff, Trash2 } from "lucide-react";
import { useState } from "react";

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
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Người dùng</h1>
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Tổng người dùng", value: stats.total },
            { label: "Admin", value: stats.admins },
            { label: "Khách hàng", value: stats.customers },
            { label: "Mới nhất", value: stats.recentUsers?.length || 0 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 shadow-sm border"
            >
              <p className="text-sm text-gray-500"> {stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            leftIcon={Search}
            value={search}
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
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Tất cả role</option>{" "}
          <option value="ADMIN">Admin</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Người dùng
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Role
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Đơn / Review
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Ngày tạo
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    Không tìm thấy người dùng
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                            {user.firstName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.lastName} {user.firstName}
                              {isSelf && (
                                <span className="text-xs text-blue-500 ml-1">
                                  (Bạn)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        <p>{user._count?.orders || 0} đơn</p>
                        <p>{user._count?.reviews || 0} review</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {!isSelf && (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() =>
                                handleToggleRole(user.id, user.role)
                              }
                              variant="outline"
                              disabled={isUpdatingRole}
                              title={
                                user.role === "ADMIN"
                                  ? "Thu hồi Admin"
                                  : "Cấp Admin"
                              }
                            >
                              {user.role === "ADMIN" ? (
                                <ShieldOff
                                  size={16}
                                  className="text-orange-500 font-bold"
                                />
                              ) : (
                                <Shield
                                  size={16}
                                  className="text-purple-500 font-bold"
                                />
                              )}
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-500">
              Trang {pagination.page} / {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Trước
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
