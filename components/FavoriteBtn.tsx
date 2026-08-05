import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ProductCardProduct } from './product-types';
import { Product } from '@/sanity.types';

const FavoriteBtn = ({showProduct = false, product} : { 
  showProduct?: boolean; 
  product?: ProductCardProduct | Product | null | undefined
}) => {
  return (
    <>
     {!showProduct ? (
      <Link href="/cart" className=" group relative">
        <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect"/>
        <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white text-xs font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center">0</span>
      </Link>
     ) : (
      <button className='border group relative hover:text-shop_light_green hoverEffect border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm'>
        <Heart className='text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-0.5 w-5 h-5' />
      </button>
     )}
    </>
  )
}

export default FavoriteBtn