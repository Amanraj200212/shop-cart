'use client'

import { productType } from '@/constants/data'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface props{
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({selectedTab, onTabSelect}: props) => {
  const carouselItems = [...productType, ...productType]
  const scrollRef = useRef<HTMLDivElement>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInteractingRef = useRef(false)
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    const container = scrollRef.current
    if (container) container.scrollLeft = Math.max(0, container.scrollWidth / 2 - 1)

    const intervalId = window.setInterval(() => {
      const currentContainer = scrollRef.current
      if (currentContainer && !isInteractingRef.current) {
        const copyWidth = currentContainer.scrollWidth / 2
        currentContainer.scrollBy({ left: 1, behavior: 'smooth' })

        if (currentContainer.scrollLeft >= copyWidth) {
          currentContainer.scrollLeft -= copyWidth
        }
      }

    }, 30)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [])

  const normalizeLoopPosition = () => {
    const container = scrollRef.current
    if (!container || !isInteractingRef.current) return

    const copyWidth = container.scrollWidth / 2
    if (container.scrollLeft >= copyWidth) {
      container.scrollLeft -= copyWidth
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft += copyWidth
    }
  }

  const startInteraction = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    isInteractingRef.current = true
    setIsInteracting(true)
  }

  const endInteraction = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
      setIsInteracting(false)
    }, 600)
  }

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5'>
      <div
        ref={scrollRef}
        onPointerDown={startInteraction}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
        onPointerLeave={endInteraction}
        onScroll={normalizeLoopPosition}
        className={`scrollbar-hide -mx-4 flex min-w-0 flex-1 touch-pan-x overflow-x-auto px-4 sm:mx-0 sm:px-0 ${isInteracting ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className='flex w-max items-center gap-1.5 text-sm font-semibold'>
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
