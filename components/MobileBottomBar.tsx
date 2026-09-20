"use client";

import { Heart, Home, Logs, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useStore from "@/store";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Orders", href: "/orders", icon: Logs },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
];

const MobileBottomBar = () => {
  const pathname = usePathname();
  const cartCount = useStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const wishlistCount = useStore((state) => state.favoriteProduct.length);

  return (
    <nav className="fixed inset-x-3 bottom-2 z-50 rounded-full border border-gray-200 bg-white p-1 shadow-lg md:hidden">
      <div className="grid grid-cols-4">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          const count = href === "/cart" ? cartCount : href === "/wishlist" ? wishlistCount : 0;

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0 rounded-full px-1 py-1.5 text-[10px] font-medium ${
                active ? "bg-shop_dark_green text-white" : "text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
              <span>{label}</span>
              {count > 0 && (
                <span className="absolute right-[18%] top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomBar;