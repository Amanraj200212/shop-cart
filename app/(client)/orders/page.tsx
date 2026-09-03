import Container from '@/components/Container';
import OrderLogin from '@/components/OrderLogin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMyOrders } from '@/sanity/queries';
import { auth } from '@clerk/nextjs/server'
import { FileX } from 'lucide-react';
import Link from 'next/link';
import NoAccess from '@/components/NoAccess';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import OrdersComponent from '@/components/OrdersComponent';

const OrderPage = async() => {
  const {userId} = await auth();

  if(!userId) {
    return <>
      <NoAccess 
        details={"log in to view your Order items and their details. Don't miss out, Track your order!"}
      />
      <OrderLogin />
    </>;
  }

  const orders = await getMyOrders(userId);
  return (
    <div>
      <Container className='py-10'>
        {orders?.length ? (
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='font-bold'>
                Order List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-25 md:w-auto font-semibold'>
                        Order Number
                      </TableHead>
                      <TableHead className='hidden md:table-cell font-semibold'>
                        Date
                      </TableHead>
                      <TableHead className='font-semibold'>
                        Customer
                      </TableHead>
                      <TableHead className='hidden md:table-cell font-semibold'>
                        Email
                      </TableHead>
                      <TableHead className='font-semibold' >
                        Total
                      </TableHead>
                      <TableHead className='font-semibold'>
                        Status
                      </TableHead>
                      <TableHead className='hidden md:table-cell font-semibold'>
                        Delivery
                      </TableHead>
                      <TableHead className='hidden md:table-cell font-semibold'>
                        Order Status
                      </TableHead>
                      <TableHead className='hidden md:table-cell font-semibold'>
                        Invoice
                      </TableHead>
                      <TableHead className='text-center font-semibold'>
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent orders={orders}/>
                </Table>
                <ScrollBar orientation='horizontal' />
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 px-12'>
            <FileX className='h-24 w-24 text-gray-400 mb-4' />
            <h2 className='text-2xl font-semibold text-gray-900'>
              No orders Found
            </h2>
            <p className='mt-2 text-sm text-gray-600 text-center max-w-md'>
              It looks like you have&apos;t placed any order yet. Start shopping to see your orders here!
            </p>
             <Button asChild className='mt-6 p-5' variant='custom'>
              <Link
                href='/'
              >
                Browse Products
              </Link>
             </Button>
          </div>
        )}
      </Container>
    </div>
  )
}

export default OrderPage
