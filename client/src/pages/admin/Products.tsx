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
import { formatCurrency } from "@/utils/formatters";
import {
  Layers,
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
  const [selectedProduct, setSelectedProduct] = useState<
    Product | null | undefined
  >(undefined);
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
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này")) deleteProduct(id);
  };
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Sản phẩm ({pagination?.total || 0})
          </h1>
          <Button
            onClick={() => setSelectedProduct(null)}
            variant="primary"
            leftIcon={Plus}
          >
            Thêm sản phẩm
          </Button>
        </div>

        <div className="relative flex-1">
          <Input
            leftIcon={Search}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Tìm sản phẩm..."
          />
        </div>

        <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
          {isLoading ? (
            <Spinner />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Sản phẩm
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Danh mục
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Giá
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Kho
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Biến thể
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Hiển thị
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-400">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {product.category?.name || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <p
                          className={`font-medium ${product.salePrice > 0 ? "line-through" : ""}`}
                        >
                          {formatCurrency(product.price)}
                        </p>
                        {product.salePrice > 0 && (
                          <p className="text-xs text-red-500">
                            {formatCurrency(product.salePrice)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            product.stock < 5 ? "text-red-500 font-medium" : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={Layers}
                          onClick={() => setVariantsProduct(product)}
                        >
                          {product._count?.variants || 0} Biến thể
                        </Button>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(product.id)}
                        >
                          {product.isActive ? (
                            <div className="flex items-center gap-1">
                              <ToggleRight
                                size={18}
                                className="text-green-500"
                              />
                              <span className="text-green-500">Hiện</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <ToggleLeft size={18} className="text-gray-400" />
                              <span className="text-gray-400">Ẩn</span>
                            </div>
                          )}
                        </Button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
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

      {selectedProduct !== undefined && (
        <Modal
          isOpen={true}
          title={
            selectedProduct === null ? "Thêm sản phẩm mới" : "Câp nhật sản phẩm"
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
          title={
            variantsProduct === null ? "Thêm biến thể mới" : "Câp nhật biến thể"
          }
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
