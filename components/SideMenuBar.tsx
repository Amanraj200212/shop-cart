"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { X } from "lucide-react";
import { headerData } from "@/constants/data";
import Socialmedia from "./Socialmedia";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface SideMenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenuBar = ({ isOpen, onClose }: SideMenuBarProps) => {
  const pathName = usePathname();
  const sideBarRef = useOutsideClick<HTMLDivElement>(onClose)

  return (
    <div 
      className={`fixed inset-y-0 h-screen w-full left-0 z-50 bg-black/50 text-white/70 shadow-xl ${isOpen ? "translate-x-0" : "-translate-x-full"} hoverEffect`}
    >
      <div ref={sideBarRef} className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-shop_dark_green">

        {/* For logo */}
        <div className="flex items-center justify-between mb-5">
          <Logo  className="text-white" 
          spanDesign="group-hover:text-white" />
          <button className=" hover:text-shop_light_green" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* For menu items*/}
        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {headerData?.map((item) => {
            return (
              <Link 
                key={item?.title} 
                href={item?.href}
                onClick={() => onClose()}
                className={`hover:text-shop_light_green hoverEffect relative group ${pathName === item.href && "text-shop_light_green"}`}
              > 
                {item?.title}
              </Link>
            )
          })}
        </div>


        {/* for social media iconss kinda fotter*/}
        <Socialmedia /> 
      </div>
    </div>
  )
}

export default SideMenuBar