import { productType } from '@/constants/data'
import Link from 'next/link'

interface props{
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({selectedTab, onTabSelect}: props) => {
  const carouselItems = [...productType, ...productType]

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5'>
      <div className='group -mx-4 overflow-hidden px-4 sm:mx-0 sm:flex-1 sm:px-0'>
        <div className='flex w-max animate-[home-tab-marquee_18s_linear_infinite] items-center gap-1.5 text-sm font-semibold group-hover:paused group-active:paused'>
        {carouselItems.map((item, index) => (
          <button 
            key={`${item?.value}-${index}`}
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
      <style jsx>{`
        @keyframes home-tab-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default HomeTabBar
