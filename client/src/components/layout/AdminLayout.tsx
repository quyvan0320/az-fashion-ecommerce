import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  // toggle sidebar on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* overlay when mobile open sidebar */}
      {sidebarOpen && (
        <div
          className="fix inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* sidebar */}
      {<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      {/* main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* page content outlet render admin pages */}
        <main className="flex overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
