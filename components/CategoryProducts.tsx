"use client"

import { Category, Product } from '@/sanity.types'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button';
import { client } from '@/sanity/lib/client';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import NoProductAvailable from './NoProductAvailable';
import { AnimatePresence, motion } from 'motion/react';

interface CategoryProductsProps {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({categories, slug}: CategoryProductsProps) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCategoryChange = (newSlug: string) => {
    if(newSlug === currentSlug) return; // new slug if same as old then do nothing
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, {scroll: false});
  };

  // const fetchProducts= async (categorySlug: string) => {
  //   setLoading(true);
  //   try{
  //     const query = `*[_type == "product" && references(*[_type=="category" && slug.current == $categorySlug]._id)] | order(name asc) {..., "categories": categories[]->title}`;

  //     const data = await client.fetch(query, {categorySlug});
  //     setProducts(data);
  //     console.log(data);
  //   } catch (error) {
  //     console.log("Error in fetching products by category", error);
  //     setProducts([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts(currentSlug)
  // },[router])

  useEffect(() => {
    const fetchProducts = async (categorySlug: string) => {
      setLoading(true);
      try {
        const query = `*[_type == "product" && references(*[_type=="category" && slug.current == $categorySlug]._id)] | order(name asc) {..., "categories": categories[]->title}`;

        const data = await client.fetch(query, {categorySlug});
        setProducts(data);
      } catch (error) {
        console.log("Error in fetching produtcs bt category", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if(currentSlug) {
      fetchProducts(currentSlug);
    }
  }, [router])

  return (
    <div className='py-5 flex flex-col md:flex-row items-start gap-5'>
      <div className='flex flex-col md:min-w-40 border'>
        {categories?.map((item) => (
          <Button
            onClick={()=> handleCategoryChange(item?.slug?.current as string)}
            key={item?._id}
            className={`w-full justify-start rounded-none border-0 border-b border-border bg-transparent p-0 px-2 py-2 text-left text-darkColor shadow-none capitalize transition-colors hover:bg-shop_orange hover:text-white hoverEffect last:border-b-0 ${item?.slug?.current === currentSlug && "bg-shop_orange text-white"}`}
          >
            <p className='w-full text-left font-semibold'>{item?.title}</p>
          </Button>
        ))}
      </div>
      
      <div className='flex-1'>
        {loading ? (
          <div className='flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full'>
            <div className='flex items-center space-x-2 text-blue-600'>
              <Loader2 className='w-5 h-5 animate-spin'/>
              <span>Product is loading...</span>
            </div>
          </div>
        ) : products?.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5
            '>
              {products?.map((product: Product) => (
                <AnimatePresence key={product?._id} >
                  <motion.div>
                    <ProductCard product={product}/>
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          ) : (
            <NoProductAvailable selectedTab={currentSlug} className='mt-0 w-full'/>
          )
        }
      </div>
    </div>
  )
}

export default CategoryProducts