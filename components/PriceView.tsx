import { cn } from '@/lib/utils';
import React from 'react'
import PriceFormatter from './PriceFormatter';

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className: string;
}

const PriceView = ({price, discount, className}: Props) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <PriceFormatter amount={price} className='text-shop_dark_green' />
      {price && discount && <PriceFormatter amount={price + (discount * price)/100 } className='text-shop_light_text font-normal line-through'/>}
    </div>
  )
}

export default PriceView