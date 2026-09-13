"use client"

import { useState } from 'react';
import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import useStore from '@/store';
import toast from 'react-hot-toast';
import PriceFormatter from './PriceFormatter';
import QuantityButton from './QuantityButton';
import LooseQuantitySelector from './LooseQuantitySelector';
import {
  calculateLoosePrice,
  formatWeight,
  getInitialWeightGrams,
  isLooseProduct,
  ProductWithSellingType,
  WeightUnit,
} from '@/lib/loose-products';

interface Props{
  product: ProductWithSellingType;
  className?: string;
}

const AddToCartButton = ({product, className} : Props) => {
  const {addItem, getItemCount} = useStore();
  const isLoose = isLooseProduct(product);
  const [unit, setUnit] = useState<WeightUnit>("gram");
  const [weightGrams, setWeightGrams] = useState(() =>
    getInitialWeightGrams(product, "gram")
  );
  const itemCount = getItemCount(product._id, isLoose ? weightGrams : undefined);
  const isOutOfStock = product.stock === 0;
  const loosePrice = calculateLoosePrice(product.pricePerKg, weightGrams);

  const handledAddToCart = () => {
    if (isLoose) {
      if (product.stock === 0) {
        toast.error("Product is out of stock");
        return;
      }

      addItem(product, weightGrams);
      toast.success(
        `${product?.name?.substring(0, 12)}... ${formatWeight(weightGrams)} added successfully`
      );
      return;
    }

    if((product.stock as number) > itemCount){
      addItem(product);
      toast.success(`${product?.name?.substring(0, 12)}... added successfully`)
    } else {
      toast.error('cannot add more than available stock')
    }
  };

  if (isLoose) {
    return (
      <div className='w-full space-y-3'>
        <div className='flex items-center justify-between gap-3'>
          <span className='text-sm text-darkColor/80'>Price per kg</span>
          <PriceFormatter amount={product.pricePerKg} />
        </div>
        <LooseQuantitySelector
          product={product}
          unit={unit}
          weightGrams={weightGrams}
          onUnitChange={setUnit}
          onWeightChange={setWeightGrams}
        />
        <div className='flex items-center justify-between border-t pt-2'>
          <span className='text-sm font-semibold'>Price</span>
          <PriceFormatter amount={loosePrice} />
        </div>
        <Button 
          disabled={isOutOfStock}
          onClick={handledAddToCart}
          className={cn("w-full bg-shop_dark_green/80 text-shop_light_bg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide hover:text-white hover:border-shop_dark_green hover:bg-shop_dark_green hoverEffect", className)}
        >
          <ShoppingBag />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    );
  }

  return (
    <div className='w-full h-12 flex items-center'>
      {itemCount ? (
        <div className='w-full text-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-darkColor/80'>Quantity</span>
            <QuantityButton product={product}/>
          </div>
          <div className='flex items-center justify-between border-t pt-1'>
            <span className='text-xs font-semibold'>Subtotal</span>
            <PriceFormatter
              amount={product.price ? product.price * itemCount : 0} 
            />
          </div>
        </div>
      ) : (
        <Button 
          disabled={isOutOfStock}
          onClick={handledAddToCart}
          className={cn("w-full bg-shop_dark_green/80 text-shop_light_bg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide hover:text-white hover:border-shop_dark_green hover:bg-shop_dark_green hoverEffect", className)}
        >
          <ShoppingBag />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  )
}

export default AddToCartButton
