import Link from 'next/link'
import { Heart } from 'lucide-react'

const FavoriteBtn = () => {
  return (
    <Link href="/cart" className=" group relative">
      <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect"/>
      <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white text-xs font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center">0</span>
    </Link>
  )
}

export default FavoriteBtn