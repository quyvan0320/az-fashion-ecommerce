import ProductForm from "@/components/admin/Products/ProductForm";
import VariantContentDetail from "@/components/admin/Products/VariantContentDetail";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
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
  Filter,
  Layers,
  Package,
  Pencil,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const Products = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null | undefined>(undefined);
  const [variantsProduct, setVariantsProduct] = useState<Product | null>(null);

  const { data: res, isLoading } = useProducts({
    page,
    limit: 10,
    search: search || undefined,
    isAdmin: true,
  });
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: toggleActive } = useToggleActive();

  const products = res?.data?.products || [];
  const pagination = res?.data;

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) deleteProduct(id);
  };

  return (
    <>
      <div className="space-y-6 pb-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Package className="text-brand-red" />
              Sản phẩm 
              <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {pagination?.total || 0}
              </span>
            </h1>
          </div>
          <Button
            onClick={() => setSelectedProduct(null)}
            className="bg-brand-red hover:bg-red-700 text-white w-full sm:w-auto shadow-lg shadow-red-100"
            leftIcon={Plus}
          >
            Thêm sản phẩm
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-xl border shadow-sm">
          <div className="relative flex-1">
            <Input
              leftIcon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, SKU, danh mục..."
              className="border-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <Button variant="outline" leftIcon={Filter} className="hidden md:flex">
            Lọc
          </Button>
        </div>

        {/* Table / Card View Area */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="py-20"><Spinner /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-600">Sản phẩm</th>
                      <th className="px-6 py-4 font-bold text-gray-600">Danh mục</th>
                      <th className="px-6 py-4 font-bold text-gray-600">Giá bán</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-center">Kho</th>
                      <th className="px-6 py-4 font-bold text-gray-600">Biến thể</th>
                      <th className="px-6 py-4 font-bold text-gray-600">Hiển thị</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-red-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-100 shadow-sm"
                            />
                            <div className="max-w-[200px]">
                              <p className="font-bold text-gray-900 truncate">{product.name}</p>
                              <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">
                            {product.category?.name || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className={`font-bold ${product.salePrice > 0 ? "text-xs text-gray-400 line-through" : "text-gray-900"}`}>
                              {formatCurrency(product.price)}
                            </span>
                            {product.salePrice > 0 && (
                              <span className="text-sm font-black text-brand-red">
                                {formatCurrency(product.salePrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-xs",
                            product.stock < 5 ? "bg-red-100 text-red-600" : "bg-green-50 text-green-600"
                          )}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => setVariantsProduct(product)}
                            className="flex items-center gap-2 text-gray-500 hover:text-brand-red font-bold transition-colors"
                          >
                            <Layers size={16} />
                            <span>{product._count?.variants || 0}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => toggleActive(product.id)}
                            className="transition-transform active:scale-90"
                          >
                            {product.isActive ? (
                              <ToggleRight size={32} className="text-brand-red" strokeWidth={1.5} />
                            ) : (
                              <ToggleLeft size={32} className="text-gray-300" strokeWidth={1.5} />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 text-gray-600"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 text-brand-red"
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

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {products.map((product) => (
                  <div key={product.id} className="p-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-gray-50 border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-black text-gray-900 truncate pr-2">{product.name}</p>
                          <button onClick={() => toggleActive(product.id)}>
                            {product.isActive ? <ToggleRight className="text-brand-red" /> : <ToggleLeft className="text-gray-300" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{product.sku}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-black text-brand-red">{formatCurrency(product.salePrice || product.price)}</span>
                           <span className="text-xs text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">Kho: {product.stock}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-dashed">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs font-bold" 
                        leftIcon={Layers}
                        onClick={() => setVariantsProduct(product)}
                      >
                        {product._count?.variants || 0} Biến thể
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-9 w-9 p-0"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="h-9 w-9 p-0 bg-red-50 text-red-600 border-none"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination - Responsive */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <p className="text-sm font-medium text-gray-500 order-2 sm:order-1">
              Trang <span className="text-gray-900 font-bold">{pagination.page}</span> / {pagination.totalPages}
            </p>
            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={() => { setPage((p) => p - 1); window.scrollTo(0,0); }}
                disabled={!pagination.hasPrev}
                className="flex-1 sm:flex-none px-4 py-2 border rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-white shadow-sm transition-all"
              >
                Trước
              </button>
              <button
                onClick={() => { setPage((p) => p + 1); window.scrollTo(0,0); }}
                disabled={!pagination.hasNext}
                className="flex-1 sm:flex-none px-4 py-2 bg-white border rounded-xl text-sm font-bold disabled:opacity-40 hover:border-brand-red hover:text-brand-red shadow-sm transition-all"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals giữ nguyên logic nhưng có thể thêm style cho đồng bộ */}
      {selectedProduct !== undefined && (
        <Modal
          isOpen={true}
          title={selectedProduct === null ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
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
