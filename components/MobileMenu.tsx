"use client"
import { AlignLeft } from "lucide-react"
import { useState } from "react";
import SideMenuBar from "./SideMenuBar";

const MobileMenu = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return <>
    <button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
      <AlignLeft className="hover:text-darkColor hoverEffect md:hidden hover:cursor-pointer" />
    </button>
    <div className="md:hidden">
      <SideMenuBar 
        isOpen= {isSideBarOpen}
        onClose={() => setIsSideBarOpen(false)}
      />
    </div>
  </>
}

export default MobileMenu