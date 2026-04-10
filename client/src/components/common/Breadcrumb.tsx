import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ displayName }: { displayName: string }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <Link to="/" className="hover:text-black">
        Trang chủ
      </Link>
      <ChevronRight size={14} />
      <span className="text-black font-medium italic">{displayName}</span>
    </nav>
  );
};

export default Breadcrumb;
