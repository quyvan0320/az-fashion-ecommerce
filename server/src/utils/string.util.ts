import Stripe from "stripe";

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics;
    .replace(/[đĐ/]/g, "d") // replace đ and Đ
    .replace(/[^a-z0-9\s-]+/g, "") // replace non-alphanumeric characters with hyphens
    .trim()
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // replace multiple hyphens with single hyphen
};

// generate unique SKU
export const generateSKU = (name: string, categoryId: string): string => {
  const cleanName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/\s+/g, "")
    .toUpperCase();
  const prefix = cleanName.substring(0, 3).toUpperCase();
  const catePrefix = categoryId.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${catePrefix}-${timestamp}`;
};

// gernerate order code
export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${year}${month}${day}-${random}`;
};

// generate sku variant
export const generateVariantSKU = (
  productSKU: string,
  size?: string,
  color?: string,
): string => {
  // Hàm phụ để dọn dẹp chuỗi: bỏ dấu, bỏ ký tự đặc biệt, thay khoảng trắng
  const clean = (str: string) =>
    str
      .trim()
      .normalize("NFD") // Tách dấu ra khỏi chữ (Ví dụ: Đ -> D + ˆ)
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu vừa tách
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D") // Xử lý riêng chữ Đ
      .replace(/[^a-zA-Z0-9]/g, "") // Chỉ giữ lại chữ và số (xóa ký tự đặc biệt)
      .toUpperCase();

  const parts = [productSKU.trim().toUpperCase()];

  if (size) parts.push(clean(size));
  if (color) parts.push(clean(color));

  return parts.join("-");
};

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});
