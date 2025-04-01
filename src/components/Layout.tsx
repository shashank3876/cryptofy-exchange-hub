
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <Navbar onMenuButtonClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};

export default Layout;
