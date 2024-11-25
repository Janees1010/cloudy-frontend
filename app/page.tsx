// pages/index.tsx or pages/home/page.tsx
"use client";

import SideBar from "./components/SideBar";
import HomePage from "./(drive)/home/page";

export default function Home() {
  return (
  
      <section className="flex">
        <aside className="w-[21%]">
          <SideBar />
        </aside>
        <main>
          <HomePage />  
        </main>
      </section>
 
  );
}
