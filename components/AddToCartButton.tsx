"use client"

import { Button } from './ui/button';
import type { ProductCardProduct } from './product-types';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
interface Props{
  product: ProductCardProduct;
  className?: string;
}

const AddToCartButton = ({product, className} : Props) => {
  const isOutOfStock = product?.stock === 0;
  const [clickAddToCart, isClickedAddToCart] = useState(false);

  const handledAddToCart = () => {
    isClickedAddToCart(true);
    console.log("Add to cart clicked for product:", product?.name);
  }

  return (
    <div className='w-full h-12 flex items-center'>
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