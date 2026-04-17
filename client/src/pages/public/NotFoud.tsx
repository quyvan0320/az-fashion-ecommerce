import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Construction } from "lucide-react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Helmet>
        <title>Az Fashion - Not Found</title>
      </Helmet>
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[150px] font-black text-gray-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Construction size={80} className="text-brand-red animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Không tìm thấy trang
          </h2>
          <p className="text-gray-500 font-medium">
            Trang bạn đang tìm kiếm có thể đã bị xóa, chuyển đi, thay đổi link
            hoặc chưa bao giờ tồn tại.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-black hover:text-black transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <Home size={18} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
