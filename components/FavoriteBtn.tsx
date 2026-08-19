'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Product } from '@/sanity.types';
import toast from 'react-hot-toast';
import useStore from '@/store';

const FavoriteBtn = ({showProduct = false, product} : { 
  showProduct?: boolean; 
  product?: Product | null | undefined
}) => {
  const {favoriteProduct, addToFavorite} = useStore ();
    const isFavorite = favoriteProduct?.some(
      (item) => item?._id === product?._id
    );

    const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if(product?._id){
        addToFavorite(product).then(() => {
          toast.success(isFavorite ? 'Removed from Favorite!' : 'Added to Favorite!')
        })
      }
    };

  return (
    <>
     {!showProduct ? (
      <Link href='/wishlist' className='flex items-center justify-between'>
        <span className='flex items-center gap-2'>
          <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect"/> 
          Wishlist
        </span>
        <span className='rounded-full bg-shop_light_green/20 px-2 py-0.5 text-xs font-semibold text-shop_dark_green'>
          {favoriteProduct?.length ? favoriteProduct?.length: 0}
        </span>
      </Link>
     ) : (
      <button 
        onClick={handleFavorite}
        className='border group relative hover:text-shop_light_green hoverEffect border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm'
      >
        <Heart 
          className={`text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-0.5 w-5 h-5 ${isFavorite ? ' fill-shop_dark_green' : ''}`} 
        />
      </button>
     )}
    </>
  )
}

export default FavoriteBtn