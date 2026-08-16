'use client'

import { MY_ORDERS_QUERY_RESULT } from '@/sanity.types'
import { TableBody, TableCell, TableRow } from './ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import PriceFormatter from './PriceFormatter'
import {format} from 'date-fns'
import { Trash} from 'lucide-react'
import { useState } from 'react'
import OrderDetailDialogs from './OrderDetailDialogs'
import toast from 'react-hot-toast'

const OrdersComponent = ({orders}: {orders: MY_ORDERS_QUERY_RESULT}) => {
  const [selectedOrder, setSelectedOrder] = useState<MY_ORDERS_QUERY_RESULT[number] | null>(null);

  const handleDelete = () => {
    toast.error("Delete method applied for admin")
  }
  
  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders?.map((order) => (
            <Tooltip key={order?.orderNumber}>
              <TooltipTrigger asChild>
                <TableRow 
                  className='cursor-pointer hover:bg-gray-100 h-12'
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className='font-medium'>
                    {order.orderNumber?.slice(-10) ?? "N/A"}...
                  </TableCell>
                  <TableCell className='font-medium hidden md:table-cell'>
                    {order?.orderDate && format(new Date(order.orderDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {order.customerName ?? "N/A"}
                  </TableCell>
                  <TableCell className='font-medium hidden md:table-cell'>
                    {order.email}
                  </TableCell>
                  <TableCell>
                    <PriceFormatter amount={order.totalPrice} className='font-medium text-black'/>
                  </TableCell>
                  <TableCell >
                    {order?.status && (
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold 
                        ${order.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : ' bg-yellow-300 text-yellow-800'
                        }`}
                      >
                        
                        {order.status.toUpperCase()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className='font-medium hidden md:table-cell'>
                    {order?.invoice && (
                      <p
                      className='font-medium line-clamp-1'
                      >
                        {order.invoice ? order?.invoice?.number : "----"}
                      </p>
                    ) }
                  </TableCell>
                  <TableCell 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className='flex items-center justify-center group'
                    >
                    <Trash
                      size={20}
                      className='text-red-600 group-hover:text-red-600 hoverEffect'
                    />
                  </TableCell>
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>
                Click to see order details
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>
      <OrderDetailDialogs 
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose = {() => setSelectedOrder(null)}
      />
    </>
  )
}

export default OrdersComponent