
import React from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import useLoadUserData from "@/hooks/FetchUserData";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {


  return (
    <section className="flex">
      <aside className="w-[25%]">
        <SideBar />
      </aside>
      <main className="w-full">
        <Navbar />
        {children}
      </main>
    </section>
  );
};

export default Layout;
