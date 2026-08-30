import React from 'react'
import Logo from './Logo'
import { Search } from 'lucide-react'
import Link from 'next/link'

const searchData = [
  {
    searchTitle: '43″ Class TU7000 Series Crystal UHD 4K Smart TV',
  },
  {
    searchTitle: 'iphone',
  },
  {
    searchTitle: 'iPhone 16 Pro Max 128GB',
  },
  {
    searchTitle: 'Portable Mini Washing Machine, White',
  },
  {
    searchTitle: 'High Performance Cooling Fan, 4-Pin, 1500 RPM',
  },
  {
    searchTitle: 'HP Laptop, AMD Ryzen 5 5500U Processor',
  },
  {
    searchTitle: 'refrigerator',
  },
  {
    searchTitle: 'Energy Star Stainless Steel Compact Freezer',
  },
]

const SearchHistory = () => {
  return (
    <div className="w-full h-full overflow-y-scroll border border-dark-color/20 rounded-md">
      <div>
        <div className="py-5 px-3 bg-shop_dark_green/10 font-semibold tracking-wide">
          <div className="text-shop_light_text flex items-center gap-1">
            <Search />
            <span>Search and explore your products from</span>
            <Logo />
          </div>
        </div>
        <div className="space-y-2 flex flex-col my-5">
          {searchData.map((search, index) => (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(search.searchTitle)}`}
              className="flex items-center gap-x-2 text-black/70 font-medium hover:bg-shop_light_green/30 px-3 py-1.5"
            >
              <Search />
              {search.searchTitle}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchHistory