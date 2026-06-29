import { X } from "lucide-react";
import Link from "next/link"
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface SocialmediaProps{
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

export const socialLinks= [
  {
    title: "Youtube",
    href: "https://www.youtube.com/@mongo18",
    icon: <X className="w-5 h-5" />,
  },
  {
    title: "GitHub",
    href: "https://github.com/mongo18",
    icon: <X className="w-5 h-5" />,
  },
  {
    title: "Linkedin",
    href: "https://www.linkedin.com/in/mongo18",
    icon: <X className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/mongo18",
    icon: <X className="w-5 h-5" />,
  },
]


const Socialmedia = ({className,iconClassName, tooltipClassName} : SocialmediaProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-5 mt-10">
        {socialLinks?.map((item) => {
          return (
            <Tooltip key={item.title}>
              <TooltipTrigger>
                <Link href={item.href} key={item.title}>
                  {item?.icon}
                </Link>
              </TooltipTrigger>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

export default Socialmedia
