import { useCategories } from "@/services/queries/useCategories";
import { useProducts } from "@/services/queries/useProducts";
import HeroSlide from "./HeroSlide";
import CategorySlide from "./CategorySlide";
import SaleProductSlide from "./SaleProductSlide";
import ProductTabs from "./ProductTabs";

const Home = () => {
  const { data: productsRes, isLoading: productLoading } = useProducts({
    limit: 17,
  });
  const { data: categoriesRes, isLoading: categoriesLoading } = useCategories();
  const products = productsRes?.data?.products || [];
  const categories = categoriesRes?.data || [];
  const categoriesWithImg = categories.filter(
    (ci) => ci.image !== null && ci.image !== "",
  );
  const saleProducts = products.filter((p: any) => p.salePrice > 0);
  console.log(saleProducts);
  return (
    <div className="min-h-screen">
      <HeroSlide />

      {/* categories */}
      <CategorySlide
        categories={categoriesWithImg}
        isLoading={categoriesLoading}
      />

      {/* sale products */}
      <SaleProductSlide products={saleProducts} isLoading={productLoading} />

      {/* tabs product */}
      <ProductTabs />

      <div className="border-t-2 pt-8 border-brand-grey">
        <div className="px-8 lg:max-w-7xl mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            <div className="flex items-center gap-4 grid-cols-1">
              <img
                src="home_policy_icon_1.png"
                className="w-10 h-10 object-cover"
              />
              <div className="flex-1 flex-col text-brand-dark">
                <p className="font-semibold text-md">Miễn phí vận chuyển</p>
                <p className="text-sm">Áp dụng cho mọi đơn hàng từ 500k</p>
              </div>
            </div>
            <div className="flex items-center gap-4 grid-cols-1">
              <img
                src="home_policy_icon_2.png"
                className="w-12 h-12 object-cover"
              />
              <div className="flex-1 flex-col text-brand-dark">
                <p className="font-semibold text-md">Đổi hàng dễ dàng</p>
                <p className="text-sm">7 ngày đổi hàng vì bất kì lí do gì</p>
              </div>
            </div>
            <div className="flex items-center gap-4 grid-cols-1">
              <img
                src="home_policy_icon_3.png"
                className="w-12 h-12 object-cover"
              />
              <div className="flex-1 flex-col text-brand-dark">
                <p className="font-semibold text-md">Hỗ trợ nhanh chóng</p>
                <p className="text-sm">HOTLINE 24/7 : 0999777788</p>
              </div>
            </div>
            <div className="flex items-center gap-4 grid-cols-1">
              <img
                src="home_policy_icon_4.png"
                className="w-12 h-12 object-cover"
              />
              <div className="flex-1 flex-col text-brand-dark">
                <p className="font-semibold text-md">Thanh toán đa dạng</p>
                <p className="text-sm">Thanh toán khi nhận hàng, Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
