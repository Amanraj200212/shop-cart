import { getMyOrders } from '@/sanity/queries';
import { auth } from '@clerk/nextjs/server';
import { Logs } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const OrderIcon = async() => {
  const {userId} = await auth();
  let orders = null;
  if(userId) {
    orders = await getMyOrders(userId)
  };
  return (
    <Link href='/orders' className='flex items-center justify-between'>
      <span className='flex items-center gap-2'>
        <Logs className="w-5 h-5 hover:text-shop_light_green hoverEffect"/>
        Orders
      </span>
      <span className='rounded-full bg-shop_light_green/20 px-2 py-0.5 text-xs font-semibold text-shop_dark_green'>{orders?.length ?? 0}</span>
    </Link>
  )
}

export default OrderIcon