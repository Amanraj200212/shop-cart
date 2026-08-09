import { urlFor } from '@/sanity/lib/image'
import { Flame, StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import AddToWishListButton from './AddToWishListButton'
import PriceView from './PriceView'
import AddToCartButton from './AddToCartButton'
import { Product } from '@/sanity.types'

type ProductCardProduct = Omit<Product, "categories"> & {
  categories?: Product["categories"] | Array<string | null> | null;
};

const ProductCard = ({product}: {product : ProductCardProduct}) => {
  const categoryNames = product?.categories
    ?.map((category) => (typeof category === "string" ? category : category?._ref))
    .filter(Boolean)
    .join(", ");

  return (
    <div className='text-sm border border-darkBlue/20 rounded-md bg-white group'>
      <div className='relative group overflow-hidden bg-shop_light_bg'>
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image 
              alt="productImage" 
              src={urlFor(product?.images[0]).url()} 
              loading='lazy'
              height={700}
              width={700}
              className={`w-full h-64 object-contain overflow-hidden cursor-pointer transition-transform bg-shop_light_bg hoverEffect 
                ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          </Link>
        )}
        <AddToWishListButton product={product as Product} />

        {/* on product show for normal sale  */}
        {product?.status === "sale" && (
          <p className='absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hoverEffect'
          >
            sale
          </p>
        )}
        {/* on product show for hot deals */}
        {product?.status === "hot" && (
          <Link 
            href="/deal"
            className='absolute top-2 left-2 z-10 border-[1.2px] border-shop_orange/70 p-1 rounded-full group-hover:border-shop_orange group-hoverEffect'
            
          >
            <Flame fill="#fb6c08" />
          </Link>
        )}
        {/* on product show for new sale */}
        {product?.status === "new" && (
          <p className='absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hoverEffect'
          >
            New!
          </p>
        )}
      </div>


      <div className='p-3 flex flex-col gap-2'>
        {categoryNames && (
          <p className='uppercase line-clamp-1 text-xs font-medium text-shop_light_text'>
          {categoryNames}
          </p>
        )}

        <h2 className='text-sm font-semibold line-clamp-1'>
          {product?.name}
        </h2>

        <div className='flex items-center gap-4'>
          <div className='flex items-center '>
            {[...Array(5)].map((_, index) => (
              <StarIcon 
                size={13}
                key={index} 
                className={index < 4 ? "text-shop_lighter_green" : "text-shop_lighter_text"}
                fill={index < 4 ? "#93D991" : "#ababab"}
              />
            ))}
          </div>
          <p className='text-shop_light_text text-xs tracking-wide'>
            5 reviews
          </p>
        </div>

        <div className='flex items-center gap-2.5'>
          <p className='font-medium'>In Stock</p>
          <p 
            className={` ${product?.stock === 0 ? 'text-red-600' : 'text-shop_dark_green/80 font-semibold'}`}
          > 
            {(product?.stock as number) <= 0 ? "unavailable" : product?.stock }
          </p>
        </div>

        <PriceView 
          price={product?.price} 
          discount={product?.discount} 
          className="text-sm"
        />

        <AddToCartButton product={product as Product} className='w-36 rounded-full'/>
      </div>
    </div>
  );
};

export default ProductCard
