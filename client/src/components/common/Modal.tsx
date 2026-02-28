import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}: ModalProps) => {
  // Logic ẩn scrollbar body (giữ nguyên vì nó đúng rồi)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 w-screen h-screen  bg-black/50" />

      <div
        className={`relative bg-white rounded-2xl w-full ${maxWidth} mx-4 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {title || "Thông báo"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
