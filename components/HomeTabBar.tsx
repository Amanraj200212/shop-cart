import { productType } from '@/constants/data'
import Link from 'next/link'

interface props{
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({selectedTab, onTabSelect}: props) => {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5'>
      <div className='-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0'>
        <div className='flex min-w-max items-center gap-1.5 text-sm font-semibold sm:min-w-0 sm:flex-wrap'>
        {productType?.map((item) => (
          <button 
            key={item?.value}
            type='button'
            onClick={() => onTabSelect(item?.value)}
            className={`shrink-0 border border-shop_light_green/20 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${selectedTab === item?.value ? "bg-shop_light_green text-white" : "bg-shop_light_green/20"}`}
          >
            {item?.title}
          </button>
        ))}
        </div>
      </div>
      <Link 
        href={"/shop"}
        className={`w-fit border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect`}
      >
        See all
      </Link>
    </div>
  )
}

export default HomeTabBar
