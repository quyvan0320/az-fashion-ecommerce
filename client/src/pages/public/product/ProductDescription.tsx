import Button from "@/components/common/Button";
import { ChevronDown } from "lucide-react";
import  { useState } from "react";
import "react-quill/dist/quill.snow.css";

const ProductDescription = ({ description }: { description: any }) => {
  const [showFull, setShowFull] = useState(false);

  if (!description) {
    return (
      <p className="text-gray-400 italic text-center">
        Thông tin đang cập nhật...
      </p>
    );
  }
  return (
    <div className="relative">
      <div
        className={`ql-container ql-snow overflow-hidden transition-all duration-500 ${
          !showFull ? "max-h-[400px]" : "max-h-full"
        }`}
      >
        <div
          className="ql-editor !p-7 space-y-4 border-none text-brand-dark leading-relaxed text-base"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {!showFull && (
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent flex items-end justify-start pb-2">
          <Button onClick={() => setShowFull(true)} rightIcon={ChevronDown}>
            Xem thêm...
          </Button>
        </div>
      )}

      {showFull && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              setShowFull(false);
              document
                .getElementById("product-tabs")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-gray-400 text-sm font-medium hover:text-black underline"
          >
            Thu gọn nội dung
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
