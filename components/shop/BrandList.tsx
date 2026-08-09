import { BRAND_QUERY_RESULT } from '@/sanity.types';
import React from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface Props{
  brands: BRAND_QUERY_RESULT ;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null >>
}

const BrandList = ({brands, selectedBrand, setSelectedBrand} :  Props) => {
  
  console.log('brands')
  console.log(brands)
  return (
    <div className='w-full bg-white p-5'>
      <h2 className="text-none font-semibold ">
        Brands
      </h2>
      <RadioGroup value={selectedBrand || ''} className='mt-2 space-y-1'>
        {brands?.map((brand) => (
          <div 
            onClick={() => setSelectedBrand(brand?.slug?.current as string)}
            key={brand?._id}
            className='flex items-center space-x-2 hover:cursor-pointer'
          >
            <RadioGroupItem
              value={brand?.slug?.current as string} 
              id={brand?.slug?.current} 
              className='rounded-sm' 
            />
            <Label
              htmlFor={brand?.slug?.current}
              className={`${selectedBrand === brand?.slug?.current ? " font-semibold text-shop_dark_green " : "font-normal"}`}            >
              {brand?.title}
            </Label>
          </div>
        ))}
        {selectedBrand && (
          <button 
            onClick={() => setSelectedBrand(null)}
            className='text-sm font-medium mt-2 underline underline-offset-2 decoration-1 text-left text-shop_dark_green hover:text-red-700 hoverEffect'
          >
            Reset Filter
          </button>
        )}
      </RadioGroup>
    </div>
  )
}

export default BrandList