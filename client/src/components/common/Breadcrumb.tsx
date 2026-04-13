import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  displayName?: string;
  linkName?: string;
  displayNameChild?: string;
}

const Breadcrumb = ({
  displayName,
  linkName,
  displayNameChild,
}: BreadcrumbProps) => {
 return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 
      overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
      
      <Link to="/" className="hover:text-black transition-colors shrink-0">
        Trang chủ
      </Link>

      {displayName && (
        <>
          <ChevronRight size={14} className="text-gray-400 shrink-0" />
          {linkName ? (
            <Link to={linkName} className="hover:text-black transition-colors shrink-0">
              {displayName}
            </Link>
          ) : (
            <span className="text-black font-medium shrink-0">{displayName}</span>
          )}
        </>
      )}

      {displayNameChild && (
        <>
          <ChevronRight size={14} className="text-gray-400 shrink-0" />
          <span className="text-black font-medium italic truncate max-w-[150px] md:max-w-none">
            {displayNameChild}
          </span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;