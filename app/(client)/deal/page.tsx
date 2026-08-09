import React from 'react'
import { getDealProducts } from '@/sanity/queries'
import Container from '@/components/Container';
import { Title } from '@/components/Title';
import ProductCard from '@/components/ProductCard';

const page = async () => {
  const products = await getDealProducts();

  return (
    <div className='bg-shop_light_bg py-10'>
      <Container>
        <Title className='mb-5 underline underline-offset-4 decoration-1 text-base uppercase tracking-wide text-black'>
          Hot Deals of the Week
        </Title>
        <div className='grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-5'>
          {products?.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default page