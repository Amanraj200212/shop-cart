"use client"

import { headerData } from "@/constants/data"
import Link from "next/link"
import { usePathname } from "next/navigation"

const HeaderMenu = () => {
  const pathName= usePathname();

  return (
    <div className="hidden md:inline-flex w-1/3 items-center text-sm gap-7 capitalize font-semibold text-lightColor">
      {headerData?.map((item) => {
        return (
          <Link 
            key={item?.title} 
            href={item?.href}
            className={`hover:text-shop_light_green hoverEffect relative group ${pathName === item.href && "text-shop_light_green"}`}
          > 
            {item?.title}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-shop_light_green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${pathName === item.href && "scale-x-100"}`} />
          </Link>
        )
      })}
    </div>
  )
}

export default HeaderMenu