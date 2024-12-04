"use client";

import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import useLoadUserData from "@/hooks/useFetchUserData";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { loadUserData } = useLoadUserData();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const FetchUserData = async () => {
    const user = await loadUserData();
    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
    }
    console.log(user, "cdh");
  };
  useEffect(() => {
    FetchUserData();
  }, [loadUserData]);

  if (loading) {
    return <Loader />;
  }
  return (
    <section className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-[20%] fixed h-full z-10 bg-gray-100">
        <SideBar />
      </aside>

      {/* Main Content */}
      <main className="w-[80%] ml-[19%] overflow-y-auto">
        <Navbar />
        <Toaster />
        <div className="p-4">{children}</div>
      </main>
    </section>
  );
};

export default Layout;
