import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import React from 'react'
import type { ProductCardProduct } from './product-types';

const AddToWishListButton = ({
    product,
    className,
  } : {
    product: ProductCardProduct;
    className?: string;
  }) => {
  return (
    <div className={cn("absolute top-2 right-2 z-10", className)} >
      <button className='p-2 rounded-full hover:bg-shop_dark_green hover:text-white hoverEffect bg-shop_lighter_bg'>
        <Heart />
      </button>
    </div>
  )
}

export default AddToWishListButton