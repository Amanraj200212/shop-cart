import React from 'react'
import { getAllDealProducts } from '@/sanity/queries'
import Container from '@/components/Container';
import { Title } from '@/components/Title';
import ProductCard from '@/components/ProductCard';

const page = async () => {
  const products = await getAllDealProducts();
  console.log(products, "products")

  return (
    <div className='bg-shop_light_bg py-10'>
      <Container>
        <Title className='mb-5 underline underline-offset-4 decoration-1 text-base uppercase tracking-wide text-black'>Hot Deals of the Week</Title>
        <div className='text-sm border border-darkBlue/20 rounded-md bg-white group'>
          {products?.map((product) => (
          <ProductCard key={product?._id} product={product}/>

          ))}
        </div>
      </Container>
    </div>
  )
}




export default page