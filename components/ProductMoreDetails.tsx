'use client'

import { Product } from '@/sanity.types'
import Container from './Container'

const ProductMoreDetails = ({product} : {product: Product | null | undefined}) => {
  return (
    <section className='w-full pb-10'>
      <Container>
        <div className='border-t border-gray-200 pt-6 md:pt-8'>
          <div className='max-w-4xl'>
            <h3 className='text-lg font-semibold text-shop_dark_green md:text-xl'>
              Description
            </h3>
            <p className='mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 md:text-base md:leading-7'>
              {product?.description || 'No description available for this product.'}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default ProductMoreDetails
