// Layout.tsx
import React from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar - Positioned at the top */}
      <header className="w-full bg-white shadow-md">
        <Navbar />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[20%] bg-gray-200 p-4">
          <SideBar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
