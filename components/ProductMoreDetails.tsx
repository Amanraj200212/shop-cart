'use client'

import React, { useState } from 'react'
import { Product } from '@/sanity.types'
import { ProductCardProduct } from './product-types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { CardContent } from './ui/card'
import Container from './Container'

const triggerClass =
  "w-full rounded-lg py-2.5 px-5 tracking-wider ring-white ring-opacity-60 text-sm font-medium hover:text-shop_dark_green transition-all \
  data-[state=active]:bg-white \
  data-[state=active]:text-shop_dark_green \
  data-[state=active]:shadow-sm \
  data-[state=active]:ring-2 \
  data-[state=active]:ring-shop_dark_green";

const ProductMoreDetails = ({product} : {product: ProductCardProduct | Product | null | undefined}) => {
  const [activeTab, setActiveTab] = useState('Description');
    
  return (
    <div className='max-w-7xl w-full mx-auto mb-10 '>
      <Container>
      {/* <div className='w-full max-w-3xl mb-10 bg-lightColor/10'> */}
        <Tabs defaultValue='Description' value={activeTab} onValueChange={setActiveTab}>
          <div className='bg-white '>
            <TabsList  className='bg-lightColor-none'>
              <div className='flex items-center justify-center space-x-3 rounded-xl bg-shop_dark_green/10 p-1'>
                <TabsTrigger 
                  value='Description' 
                  className={triggerClass}
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value='Addtional Information'
                  className={triggerClass}
                >
                  Addtional Information
                </TabsTrigger>
                <TabsTrigger 
                  value='Reviews'
                  className={triggerClass}
                >
                  Reviews
                </TabsTrigger>
              </div>
            </TabsList>
            
            <TabsContent value='Description' className='rounded-xl max-w-3xl w-full bg-white py-3 space-y-4'>
              <CardContent className='relative rounded-md'>
                <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                  {product?.description} [Still new some improvement !]
                </p>
              </CardContent>
            </TabsContent>
            <TabsContent value='Addtional Information' className='rounded-xl bg-white py-3 space-y-4'>
              <CardContent>
                Addition Information[Working on it !]
              </CardContent>
            </TabsContent>
            <TabsContent value='Reviews' className='rounded-xl bg-white py-3 space-y-4'>
              <CardContent>
                review [Working on it !]
              </CardContent>
            </TabsContent>        
          </div>
        </Tabs>
      </Container>
    </div>
  )
}

export default ProductMoreDetails