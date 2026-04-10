import { Link } from "react-router-dom";
import NavDropdown from "./NavDropdown";
import { ROUTES } from "@/config/constants";

const DesktopNav = ({
  shirtCategories,
  pantCategories,
  accessoryCategories,
}: any) => {
  return (
    <nav className="hidden lg:flex items-center gap-6 font-semibold">
      <Link to={ROUTES.PRODUCTS} className="hover:text-brand-red transition-colors">
        Sản phẩm mới
      </Link>

      {/* Reusable Dropdown Component */}
      <NavDropdown title="Áo nam" items={shirtCategories} />
      <NavDropdown title="Quần nam" items={pantCategories} />
      <NavDropdown title="Phụ kiện" items={accessoryCategories} />

      <Link
        to="/"
        className="hover:text-brand-red transition-colors text-nowrap"
      >
        Hệ thống cửa hàng
      </Link>
    </nav>
  );
};

export default DesktopNav;
