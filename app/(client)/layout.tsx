import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider} from '@clerk/nextjs'


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
    <ClerkProvider>
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-50">
          <Header />
        </div>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ClerkProvider>

  );
}
