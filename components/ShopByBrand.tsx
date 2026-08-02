import React from 'react'
import Link from 'next/link'
import { getAllBrands } from '@/sanity/queries'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { GitCompareArrows, Headset, ShieldCheck, Truck } from 'lucide-react'


const extraData = [
  {
    title: "Free Delivery",
    description: " Free shipping over $249",
    icon: <Truck size={45} />
  },
  {
    title: "Free Return",
    description: " Free shipping over $249",
    icon: <GitCompareArrows size={45} />
  },
  {
    title: "Customer Support",
    description: "Friendly 24/7 customer support",
    icon: <Headset size={45} />
  },
  {
    title: "Money Back Guarantee",
    description: " Quality checked by our tea,",
    icon: <ShieldCheck size={45} />
  },
]

const ShopByBrand = async() => {
  const brands = await getAllBrands();

  return (
    <div className='mb-10 lg:pb-20 bg-shop_light_bg p-5 lg:p-7 rounded-md'>
      <div className='flex items-center gap-5 justify-between mb-10'>
        <h2 className='text-2xl font-semibold  pb-3'>
          Shop By Brand
        </h2>
        <Link
          href={"/shop"}
          className='tet-sm font-semibold tracking-wide hover:text-shop_btn_dark_green hoverEffect'
        >
          View all
        </Link>
      </div>

      {/* flex items-center  justify-between  */}
      {/* grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 */}
      <div className=' flex items-center justify-between gap-2.5 '>
        {brands?.map((brand) => (
          <Link 
            href={`/brand/${brand?.slug?.current}`} 
            key={brand?.title} 
            className='bg-white w-36 h-24 flex items-center justify-center rounded-md overflow-hidden hover:shadow-lg shadow-shop_dark_green/20 hoverEffect'
          > 
            {brand?.image && (
              <Image 
                src={urlFor(brand?.image).url()}
                alt="brandImage" 
                width={250}
                height={250}
                className='w-32 h-20 object-contain'
              />
            )}
          </Link>
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-16 gap-4 p-2 shadow-xs shadow-shop_light_green/20 py-5'>
      {extraData?.map((item, index) => (
        <div
          key={index}
          className='flex items-center gap-3 group text-lightColor hover:text-shop_light_green'
        >
          <span className='inline-flex scale-100 group-hover:scale-90 hoverEffect '>
            {item?.icon}
          </span>
          <div className='text-sm'>
            <p className='text-darkColor/80 font-bold capitalize'>
              {item?.title}
            </p>
            <p className='text-lightColor'>
              {item?.description}
            </p>
          </div>
        </div>
      ))}

      </div>
    </div>
  )
}

export default ShopByBrand;