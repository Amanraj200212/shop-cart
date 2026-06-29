import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shop Cart online store",
  description: "All you need is here, just order and we will deliver it to your home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="font-poppins antialiased" >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
