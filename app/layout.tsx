
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";

const popins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Cloudy",
  description: "Cloudy - The only cloud solution you need ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
      <html lang="en">
        <body className={`${popins.variable} font-poppins antialiased`}>
          <ClientLayout>
            {/* <Layout> */}
             {children}
            {/* </Layout> */}
          </ClientLayout>
        </body>
      </html>
  );
}
