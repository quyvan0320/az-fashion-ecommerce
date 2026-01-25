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
