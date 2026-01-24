// generate slug from name product
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// generate unique SKU
const generateSKU = (name: string, categoryId: string): string => {
  const prefix = name.substring(0, 3).toUpperCase();
  const catePrefix = categoryId.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${catePrefix}-${timestamp}`;
};
