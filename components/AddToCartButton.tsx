"use client"

import { Product } from '@/sanity.types'
import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
interface Props{
  product: Product;
  className?: string;
}

const AddToCartButton = ({product, className} : Props) => {
  const isOutOfStock = product?.stock === 0;
  const [clickAddToCart, isClickedAddToCart] = useState(false);
  


  const handledAddToCart = () => {
    isClickedAddToCart(true);
  }

  return (
    <div className='w-full h-12 flex items-center'>
      {/* {
        clickAddToCart ? <div>hkhdkfhsa</div> : <button className='bg-yellow-500' onClick={handledAddToCart}>
        click me
      </button>
      }
       */}

      <Button 
        className={cn("w-full bg-shop_dark_green/80 text-shop_light_bg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide hover:text-white hover:border-shop_dark_green hover:bg-shop_dark_green hoverEffect", className)}
        onClick={handledAddToCart}
      >
        <ShoppingBag />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  )
}

export default AddToCartButton