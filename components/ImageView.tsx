"use client"

import { internalGroqTypeReferenceTo, SanityImageHotspot,SanityImageCrop } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react'

interface Props {
  images?: Array<{
    asset?: {
      _ref:string;
      _type: "reference";
      _weak?:boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined
}

const ImageView = ({images = [], isStock}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const active = images[activeIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  const showNextImage = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    );
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleImages || touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;
    const swipeDistance = touchStartX.current - touchEndX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        showNextImage();
      } else {
        showPreviousImage();
      }
    }

    touchStartX.current = null;
  };

  if (!active) return null;

  return (
    <div className='w-full md:w-1/2 space-y-2 md:space-y-4'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={active?._key}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.5}}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={handleTouchEnd}
          className='relative w-full max-h-137.5 min-h-112.5 border border-darkColor/10 rounded-md group overflow-hidden'
        >
          <Image
            alt="productImage"
            src={urlFor(active).url()}
            width={700}
            height={700}
            priority
            className={`w-full h-96 max-h-137.5 object-contain group-hover:scale-110 hoverEffect rounded-md ${isStock === 0 ? "opacity-50" : ""}`}
          />
          {hasMultipleImages && (
            <>
              <button
                type='button'
                onClick={showPreviousImage}
                className='absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-shop_light_green/30 bg-white/90 text-shop_dark_green shadow-sm hover:bg-shop_light_green hover:text-white hoverEffect'
                aria-label='Previous product image'
              >
                <ChevronLeft className='size-5' />
              </button>
              <button
                type='button'
                onClick={showNextImage}
                className='absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-shop_light_green/30 bg-white/90 text-shop_dark_green shadow-sm hover:bg-shop_light_green hover:text-white hoverEffect'
                aria-label='Next product image'
              >
                <ChevronRight className='size-5' />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <div className='grid grid-cols-6 gap-2 h-20 md:h-24'>
        {images?.map((image, index) => (
          <button 
            key={image?._key} 
            type='button'
            onClick={() => setActiveIndex(index)}
            className={`border overflow-hidden rounded-lg ${active?._key === image?._key ? "opacity-100 border-darkColor" : "opacity-80"}`}
          >
            <Image  
              src={urlFor(image).url()} 
              alt={`thumbnail ${image?._key}`} 
              width={100} 
              height={100}
              className='w-full h-auto object-contain'
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageView