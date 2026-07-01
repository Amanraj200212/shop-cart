import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { InstagramIcon } from "./ui/instagram";
import { FacebookIcon } from "./ui/facebook";
import { LinkedinIcon } from "./ui/linkedin";
import { GithubIcon } from "./ui/github";
import { cn } from "@/lib/utils";

interface SocialmediaProps{
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

export const socialLinks= [
  {
    title: "Instagram",
    href: "https://www.instagram.com/4mangupta._",
    icon: <InstagramIcon className="w-5 h-5"/>,
  },
  {
    title: "GitHub",
    href: "https://github.com/mongo18",
    icon: <GithubIcon className="w-5 h-5" />,
  },
  {
    title: "Linkedin",
    href: "https://www.linkedin.com/in/mongo18",
    icon: <LinkedinIcon className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/mongo18",
    icon: <FacebookIcon className="w-5 h-5" />,
  },
]


const Socialmedia = ({className,iconClassName, tooltipClassName} : SocialmediaProps) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center text-white gap-5 mt-20", className)}>
        {socialLinks?.map((item) => {
          return (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <Link 
                  href={item.href} 
                  key={item.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("p-5 border rounded-full pl-3 pt-2.5 hover:text-shop_light_green hoverEffect hover:border-shop_light_green", iconClassName)}
                >
                  {item?.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent className={cn("bg-white p-3 text-darkColor font-semibold", tooltipClassName)} >{item.title}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
    
  )
}

export default Socialmedia
