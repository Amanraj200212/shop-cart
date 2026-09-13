import Container from '@/components/Container';
import ImageView from '@/components/ImageView';
import { getProductBySlug } from '@/sanity/queries';
import { CornerDownLeft, Truck } from 'lucide-react';
import PriceView from '@/components/PriceView';
import AddToCartButton from '@/components/AddToCartButton';
import FavoriteBtn from '@/components/FavoriteBtn';
import ProductCharacteristics from '@/components/ProductCharacteristics';
import { notFound } from 'next/navigation';
import {RxBorderSplit} from "react-icons/rx"
import {FaRegQuestionCircle} from "react-icons/fa"
import {FiShare2} from "react-icons/fi"
import {TbTruckDelivery} from "react-icons/tb"
import ProductMoreDetails from '@/components/ProductMoreDetails';
import PriceFormatter from '@/components/PriceFormatter';
import { isLooseProduct, ProductWithSellingType } from '@/lib/loose-products';

const page = async({params}: {params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const productForSale = product as ProductWithSellingType;
  const isLoose = isLooseProduct(productForSale);

  return (
    <div className='mx-auto px-4'>
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
          </div>
          <div className='space-y-2 border-b border-t border-gray-200 py-5 '>
            {isLoose ? (
              <div className='flex items-center gap-1 text-lg font-bold'>
                <PriceFormatter amount={productForSale?.pricePerKg} className='text-shop_dark_green' />
                <span className='text-sm font-semibold text-shop_light_text'>/kg</span>
              </div>
            ) : (
              <PriceView 
                price={product?.price} 
                className='text-lg font-bold'
              />
            )}
            <p 
              className={`px-4 py-1.5 inline-block font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : " bg-green-100 text-green-600"}`}
            >
              {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>
          <div className='flex items-center gap-2.5 lg:gap-3'>
            <AddToCartButton product={productForSale}/>
            <FavoriteBtn showProduct={true} product={product} />
          </div>
          <ProductCharacteristics product={product} />
          <div className='flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2'>
            <div className='flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect'>
              <RxBorderSplit className="text-lg" />
              <p>Compare color</p>
            </div>
            <div className='flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect'>
              <FaRegQuestionCircle className="text-lg" />
              <p>Ask aquestion</p>
            </div>
            <div className='flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect'>
              <TbTruckDelivery className="text-lg" />
              <p>Delivery & Return</p>
            </div>
            <div className='flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect'>
              <FiShare2 className="text-lg" />
              <p>Share</p>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5'>
              <Truck size={30} className='text-shop_orange'/>
              <div>
                <p className='text-base font-semibold text-black'>
                  Free Delivery
                </p>
                <p className='text-sm font-semibold text-gray-500 '>
                  If order is above {" "}
                  <span className='underline underline-offset-2'>
                    <PriceFormatter amount={1000} className='text-shop_light_green' />
                  </span>.
                </p>
              </div>
            </div>
            <div className='border border-lightColor/25  p-3 flex items-center gap-2.5'>
              <CornerDownLeft size={30} className='text-shop_orange'/>
              <div>
                <p className='text-sm font-semibold text-black'>
                  Return Delivery
                </p>
                <p className='text-sm font-semibold text-gray-500 '>
                  Only some items are eligible for {" "} {" "}
                  <span className='underline text-red-500 underline-offset-2'>Return</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <ProductMoreDetails product={product}/>
    </div>
  )
}

export default page
