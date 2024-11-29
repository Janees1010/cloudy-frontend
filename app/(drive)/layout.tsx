import React from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <section className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-[20%] fixed h-full z-10 bg-gray-100">
        <SideBar />
      </aside>

      {/* Main Content */}
      <main className="w-[80%] ml-[19%] overflow-y-auto">
        <Navbar />
        <div className="p-4">{children}</div>
      </main>
    </section>
  );
};

export default Layout;
