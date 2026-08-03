import CategoryProducts from '@/components/CategoryProducts';
import Container from '@/components/Container';
import { Title } from '@/components/Title';
import { getCategories } from '@/sanity/queries';
import React from 'react'

const page = async ({params}: {params: {slug: string}}) => {
  const categories = await getCategories();
  const {slug } = await params;

  return (
    <div className='bg-shop_light_bg py-10'>
      <Container>
        <Title className='mb-5 underline underline-offset-4 decoration-1 text-base uppercase tracking-wide text-black'>
          Product by Category: {" "}
          <span className='font-bold text-green-600 capitalize tracking-wide'>{slug && slug}</span>
        </Title>

        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  )
}

export default page