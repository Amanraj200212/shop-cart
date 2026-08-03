import Container from '@/components/Container';
import ImageView from '@/components/ImageView';
import { getProductsBySlugQuery } from '@/sanity/queries';
import { StarIcon } from 'lucide-react';
import PriceView from '@/components/PriceView';
import React from 'react'

const page = async({params}: {params: {slug: string}}) => {
  const {slug} = await params;
  const product = await getProductsBySlugQuery(slug);

  return (
    <Container className='flex flex-col md:flex-row gap-10 py-10'>
      {product?.images && (
        <ImageView images={product?.images} isStock={product?.stock}/>
      )}
      <div className='w-full md:w-1/2 flex flex-col gap-5'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold'>{product?.name}</h2>
          <p className='text-sm text-gray-600 tracking-wide'>
            {product?.description}
          </p>
          <div className='flex items-center gap-0.5 text-xs'>
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className='text-shop_light_green'
                fill='#3b9c3c' 
              />
            ))}
            <p className='font-semibold'>{`(120})`}</p>
          </div>
        </div>
        <div className='space-y-2 border-b border-t border-gray-200 py-5'>
          <PriceView 
            price={product?.price} 
            discount={product?.discount} 
            className='text-lg font-bold'
          />
          <p 
            className={`px-4 py-1.5 font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : " bg-green-100 text-green-600"}`}
          >
            {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>
      </div>
    </Container>
  )
}

export default page