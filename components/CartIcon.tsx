'use client'

import useStore from '@/store'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const CartIcon = () => {
  const {items} = useStore();
  return (
    <Link href='/cart' className='flex items-center justify-between'>
      <span className='flex items-center gap-2'>
        <ShoppingBag className="w-5 h-5 hover:text-shop_light_green hoverEffect"/> 
        Cart
      </span>
      <span className='rounded-full bg-shop_light_green/20 px-2 py-0.5 text-xs font-semibold text-shop_dark_green'>{items?.length ? items?.length : 0}</span>
    </Link>
  )
}

export default CartIcon