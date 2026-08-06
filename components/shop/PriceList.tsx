import React from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

const priceArray = [
  { title: 'Under $100', value: "0-100" },
  { title: '$100 - $200', value: "100-200" },
  { title: '$200 - $300', value: "200-300" },
  { title: '$300 - $500', value: "300-500" },
  { title: 'Over $500', value: "500-1000" },
]

interface Props{
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({selectedPrice, setSelectedPrice} : Props) => {
  return (
    <div className='w-full bg-white p-5'>
      <h2 className="text-none font-semibold ">
        Price
      </h2>
      <RadioGroup value={selectedPrice || ""} className='mt-2 space-y-1'>
        {priceArray?.map((price, index) => (
          <div 
            key={index}
            onClick={() => setSelectedPrice(price?.value)}
            className='flex items-center space-x-2 hover:cursor-pointer'
          >
            <RadioGroupItem
              value={price?.value} 
              id={price?.value} 
              className='rounded-sm' 
            />
            <Label
              htmlFor={price?.value}
              className={`${selectedPrice === price?.value ? " font-semibold text-shop_dark_green " : "font-normal"}`}            
            >
              {price?.title}
            </Label>
          </div>
        ))}
        {selectedPrice && (
          <button 
            onClick={() => setSelectedPrice(null)}
            className='text-sm font-medium mt-2 underline underline-offset-2 decoration-1 text-left text-shop_dark_green hover:text-red-700 hoverEffect'
          >
            Reset Filter
          </button>
        )}
      </RadioGroup>
    </div>
  )
}

export default PriceList