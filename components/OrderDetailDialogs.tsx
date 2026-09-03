import React from 'react'
import {MY_ORDERS_QUERY_RESULT} from '@/sanity.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import PriceFormatter from './PriceFormatter';
import { Badge } from './ui/badge';
import PickupInformation from './PickupInformation';
import OrderStatusTimeline from './OrderStatusTimeline';
import { DeliveryMethod, getDeliveryMethodLabel, ORDER_STATUS_LABELS, OrderStatus } from '@/lib/delivery';
import { Bike, Store } from 'lucide-react';
import { statusBadgeClassName } from './admin/AdminOrdersDashboard';

interface OrderDetailsDailogsProps {
  order: MY_ORDERS_QUERY_RESULT[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialogs: React.FC<OrderDetailsDailogsProps> = ({
  order, 
  isOpen, 
  onClose
}) => {
  if(!order) return null;
  const deliveryMethod = (order.deliveryMethod || "pickup") as DeliveryMethod;

  const orderStatus = (order.orderStatus || "pending") as OrderStatus;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-scroll sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            Order Details - {order?.orderNumber}
          </DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Date:</strong> {" "} {order.orderDate && new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {" "}
              <span
                className={`font-semibold capitalize text-green-600`}
              >
                {order.status}    
              </span>
          </p>
          <div className='mt-2 flex flex-wrap items-center gap-2'>
            <strong>Delivery Method:</strong>
            <Badge
              variant='outline'
              className='gap-1 border-shop_light_green/40 text-shop_dark_green'
            >
              {deliveryMethod === "delivery" ? (
                <Bike className='size-3' />
              ) : (
                <Store className='size-3' />
              )}
              {getDeliveryMethodLabel(deliveryMethod)}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <strong>Order Status:</strong>
            <Badge variant="outline" className={statusBadgeClassName(orderStatus)}>
              {ORDER_STATUS_LABELS[orderStatus] || orderStatus}
            </Badge>
          </div>
          <p>
            <strong>Invoice Number:</strong> {" "} 
            {order?.invoice?.number}
          </p>
          {order?.invoice?.number && (
            <Button 
              variant='outline'
              className='border bg-transparent text-darkColor/80 mt-4 hover:bg-darkColor/10 hover:text-darkColor hover:border-darkColor hoverEffectx  '
            >
              {order?.invoice?.hosted_invoice_url && (
                <Link
                  href={order?.invoice?.hosted_invoice_url}
                  target='_blank'
                >
                  Download Invoice
                </Link>
              )}
            </Button>
          )}
        </div>
        <OrderStatusTimeline
          deliveryMethod={deliveryMethod}
          orderStatus={order.orderStatus}
        />
        {deliveryMethod === "delivery" && order.address ? (
          <div className='rounded-lg border bg-gray-50 p-4 text-sm'>
            <h3 className='mb-2 font-semibold text-shop_dark_green'>Shipping Address</h3>
            <p className='font-medium'>{order.address.fullName}</p>
            <p>{order.address.phone}</p>
            <p>{order.address.email}</p>
            <p>
              {[order.address.address, order.address.addressLine2, order.address.city, order.address.state, order.address.pinCode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        ) : (
          <PickupInformation />
        )}
        <Table className='w-full'>
          <TableHeader>
            <TableRow className='bg-black/10'>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order?.products?.map((order, index) => (
              <TableRow key={index}>
                <TableCell className='flex items-center gap-2'>
                  {order?.product?.images && (
                    <Image 
                      src={urlFor(order?.product?.images[0]).url()}
                      alt='productImage'
                      width={50}
                      height={50}
                      className='border rounded-sm'
                    />
                  )}

                  {order.product?.name}
                </TableCell>
                <TableCell>
                  {order.quantity}
                </TableCell>
                <TableCell>
                  <PriceFormatter
                    className='text-black font-medium' 
                    amount={order.product?.price}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='mt-4 bg-black/5 rounded-md p-2.5 text-right flex items-center justify-end'>
            <div className='w-full flex flex-col gap-1'>
              {order?.amountDiscount !== 0 && (
                <div className='w-full flex items-center justify-between'>
                  <strong>Discount: </strong>
                  <PriceFormatter 
                    amount={order?.amountDiscount}
                    className='font-bold text-black'
                  />
                </div>
              )}
              {order?.amountDiscount !== 0 && (
                <div className='w-full flex items-center justify-between'>
                  <strong>Subtotal: </strong>
                  <PriceFormatter 
                    amount={(order?.amountDiscount as number) + (order?.amountDiscount as  number)}
                    className='font-bold text-black'
                  />
                </div>
              )}
              <div className='w-full flex items-center justify-between'>
                <strong>Total:</strong>
                <PriceFormatter
                  amount={order?.totalPrice}
                  className='text-black font-bold'
                />
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderDetailDialogs
