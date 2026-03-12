import { useCategories } from "@/services/queries/useCategories"
import { useFeaturedProducts } from "@/services/queries/useProducts"

const Home = () => {
  const {data: featuredRes, isLoading: featuredLoading} = useFeaturedProducts()
  const {data: categoriesRes} = useCategories({limit: 8})

  const featuredProducts = featuredRes?.data || []
  const categories = categoriesRes?.data || []
  return (
    <div className="min-h-screen">
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">AZ Fashion</h1>
        </div>
      </section>
    </div>
  )
}

export default Home