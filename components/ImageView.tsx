"use client"

import { internalGroqTypeReferenceTo, SanityImageHotspot,SanityImageCrop } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import React, { useState } from 'react'

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
  const[active, setActive] = useState(images[0])

  return (
    <div className='w-full md:w-1/2 space-y-2 md:space-y-4'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={active?._key}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.5}}
          className='w-full max-h-137.5 min-h-112.5 border border-darkColor/10 rounded-md group overflow-hidden'
        >
          <Image
            alt="productImage"
            src={urlFor(active).url()}
            width={700}
            height={700}
            priority
            className={`w-full h-96 max-h-137.5 object-contain group-hover:scale-110 hoverEffect rounded-md ${isStock === 0 ? "opacity-50" : ""}`}
          />
        </motion.div>
      </AnimatePresence>
      <div className='grid grid-cols-6 gap-2 h-20 md:h-24'>
        {images?.map((image) => (
          <button 
            key={image?._key} 
            onClick={() =>setActive(image)}
            className={`border border-muted overflow-hidden ${active?._key === image?._key ? "opacity-100 border-darkColor" : "opacity-80"}`}
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