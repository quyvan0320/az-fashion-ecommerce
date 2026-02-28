export const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELED: "bg-red-100 text-red-700",
};

export const ORDER_STATUSES = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELED", label: "Đã hủy" },
];

const StatusBadge = ({ status }: { status: string }) => {
  const label = ORDER_STATUSES.find((s) => s.value === status)?.label || status;
  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[status] || "bg-gray-100"}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
