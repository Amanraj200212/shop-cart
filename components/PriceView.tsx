import { cn } from '@/lib/utils';
import React from 'react'
import PriceFormatter from './PriceFormatter';

interface Props {
  price: number | undefined;
  className: string;
}

const PriceView = ({price, className}: Props) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <PriceFormatter amount={price} className='text-shop_dark_green' />
    </div>
  )
}

export default PriceView