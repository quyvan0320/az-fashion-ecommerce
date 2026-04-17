import ProductForm from "@/components/admin/Products/ProductForm";
import VariantContentDetail from "@/components/admin/Products/VariantContentDetail";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import {
  useDeleteProduct,
  useProducts,
  useToggleActive,
} from "@/services/queries/useProducts";
import { Product } from "@/types/product";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatters";
import {
  Layers,
  Package,
  Pencil,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<
    Product | null | undefined
  >(undefined);
  const [variantsProduct, setVariantsProduct] = useState<Product | null>(null);

  const { data: res, isLoading } = useProducts({
    page,
    limit: 10,
    search: searchParam || undefined,
    searchType: searchType,
    isAdmin: true,
  });

  const handleParams = (updates: Record<string, string>) => {
    if (updates.page) {
      setPage(Number(updates.page));
    }

    if (updates.search !== undefined) {
      setSearchParam(updates.search);
      setPage(1);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: toggleActive } = useToggleActive();

  const products = res?.data?.products || [];
  const pagination = res?.data;

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) deleteProduct(id);
  };

  const handleSearch = () => {
    setSearchParam(inputValue);
    setPage(1);
  };

  const handleReset = () => {
    setInputValue("");
    setSearchParam("");
    setPage(1);
  };
  useEffect(() => {
    if (inputValue) {
      handleSearch();
    }
  }, [searchType]);
  return (
    <>
      <div className="space-y-6 pb-10">
         <Helmet>
                  <title>Az Fashion - Quản lý sản phẩm</title>
                </Helmet>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-dark flex items-center gap-2">
              <Package className="text-brand-red" />
              Sản phẩm
              <span className="text-sm font-medium text-gray-400 bg-brand-grey px-2 py-0.5 rounded-full">
                {pagination?.total || 0}
              </span>
            </h1>
          </div>
          <Button
            onClick={() => setSelectedProduct(null)}
            noHover
            className="border-none rounded-2xl text-brand-light bg-brand-red"
            leftIcon={Plus}
          >
            Thêm sản phẩm
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 bg-brtext-brand-light rounded-2xl p-2  border shadow-sm items-center">
          <div className="flex flex-1 items-stretch w-full">
            <div className="relative group min-w-[140px] border-r border-gray-100 flex items-center">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full pl-4 pr-8 py-2 bg-transparent text-sm font-bold text-brand-dark appearance-none cursor-pointer outline-none"
              >
                <option value="name">Tên sản phẩm</option>
                <option value="sku">Mã SKU</option>
                <option value="category">Danh mục</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative flex-1">
              <Input
                leftIcon={Search}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  searchType === "sku"
                    ? "Nhập chính xác mã SKU..."
                    : searchType === "category"
                      ? "Nhập tên danh mục..."
                      : "Nhập tên sản phẩm cần tìm..."
                }
              />
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0">
            {searchParam && (
              <Button
                variant="primary"
                className="bg-brand-red text-brand-light border-none"
                onClick={handleReset}
                noHover
                size="md"
              >
                <Trash2 size={18} />
              </Button>
            )}
            <Button
              onClick={handleSearch}
              variant="primary"
              noHover
              className="bg-brand-red font-bold border-none text-brand-light"
              size="md"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Table / Card View Area */}
        <div className="bg-brtext-brand-light shadow-sm rounded-2xl border border-gray-100 overflow-hidden relative">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-xs font-bold text-gray-400 animate-pulse uppercase tracking-widest">
                Đang tải dữ liệu...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">
                Không tìm thấy sản phẩm nào
              </p>
              {searchParam && (
                <button
                  onClick={handleReset}
                  className="mt-2 text-brand-red text-xs font-bold underline"
                >
                  Xóa bộ lọc và quay lại
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400">
                        Danh mục
                      </th>
                      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400">
                        Giá bán
                      </th>
                      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">
                        Kho
                      </th>
                      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">
                        Biến thể
                      </th>
                      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400">
                        Hiển thị
                      </th>
                      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                product.images?.[0] || "/placeholder-img.png"
                              }
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-100 shadow-sm"
                            />
                            <div className="max-w-[200px]">
                              <p className="font-bold text-brand-dark truncate">
                                {product.name}
                              </p>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                SKU: {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-black uppercase">
                            {product.category?.name || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span
                              className={`font-bold ${product.salePrice > 0 ? "text-[11px] text-gray-400 line-through" : "text-sm text-gray-900"}`}
                            >
                              {formatCurrency(product.price)}
                            </span>
                            {product.salePrice > 0 && (
                              <span className="text-sm font-black text-brand-red leading-none">
                                {formatCurrency(product.salePrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 text-center font-black text-gray-red`}
                        >
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-xs",
                              product.stock < 5
                                ? "bg-red-100 text-red-600"
                                : "bg-green-50 text-green-600",
                            )}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setVariantsProduct(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 text-gray-500 hover:text-brand-red hover:bg-red-50 font-bold transition-all border border-gray-100"
                          >
                            <Layers size={14} />
                            <span className="text-xs">
                              {product._count?.variants || 0}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleActive(product.id)}
                            className="transition-transform active:scale-90"
                          >
                            {product.isActive ? (
                              <ToggleRight
                                size={32}
                                className="text-brand-red"
                                strokeWidth={1.5}
                              />
                            ) : (
                              <ToggleLeft
                                size={32}
                                className="text-gray-300"
                                strokeWidth={1.5}
                              />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="primary"
                              className="h-8 w-8 p-0 rounded-lg border border-brand-dark hover:bg-gray-100 text-brand-dark"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              className="h-8 w-8 p-0 rounded-lg border border-brand-dark text-brand-dark hover:bg-red-100 "
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <Pagination
          pagination={pagination}
          handleParams={handleParams}
          page={page}
        />
      </div>

      {selectedProduct !== undefined && (
        <Modal
          isOpen={true}
          title={
            selectedProduct === null ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"
          }
          onClose={() => setSelectedProduct(undefined)}
        >
          <ProductForm
            product={selectedProduct}
            onSuccess={() => setSelectedProduct(undefined)}
          />
        </Modal>
      )}

      {variantsProduct && (
        <Modal
          isOpen={true}
          title="Quản lý biến thể sản phẩm"
          onClose={() => setVariantsProduct(null)}
        >
          <VariantContentDetail
            product={variantsProduct}
            onSuccess={() => setVariantsProduct(null)}
          />
        </Modal>
      )}
    </>
  );
};

export default Products;
