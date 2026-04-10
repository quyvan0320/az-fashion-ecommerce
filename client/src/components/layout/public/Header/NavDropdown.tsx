import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/constants";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NavDropdownProps {
  title: string;
  items: Category[];
}

const NavDropdown = ({ title, items }: NavDropdownProps) => {
  return (
    <div className="group relative flex items-center gap-2 cursor-pointer py-4">
      {/* Label chính */}
      <span className="flex items-center gap-1 group-hover:text-brand-red transition-colors">
        {title}
        <ChevronDown
          size={14}
          className="transition-transform duration-300 group-hover:rotate-180"
        />
      </span>

      {/* Dropdown Box */}
      <div
        className="absolute top-full left-0 min-w-[220px] bg-brand-light shadow-2xl border border-gray-100 py-3 z-50 
          opacity-0 invisible translate-y-4
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
          transition-all duration-300 ease-out rounded-xl"
      >
        {/* Mũi tên nhọn phía trên box (tùy chọn) */}
        <div className="absolute -top-2 left-6 w-4 h-4 bg-brand-light rotate-45 border-l border-t border-gray-100"></div>

        <div className="relative bg-brand-light rounded-xl overflow-hidden">
          {items.length > 0 ? (
            items.map((item) => (
              <Link
                key={item.id}
                to={`${ROUTES.PRODUCTS}?categorySlug=${item.slug}`}
                className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-red hover:pl-8 transition-all duration-200 border-b border-gray-50 last:border-none"
              >
                {item.name}
              </Link>
            ))
          ) : (
            <div className="px-6 py-3 text-sm text-gray-400 italic">
              Đang cập nhật...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavDropdown;
