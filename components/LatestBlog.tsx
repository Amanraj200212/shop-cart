import { urlFor } from '@/sanity/lib/image';
import { getAlllatestBLog } from '@/sanity/queries'
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import React from 'react'

const LatestBlog = async() => {
  const blogs = await getAlllatestBLog();
  console.log("blogs", blogs)
  return (
    <div className='mb-10 lg:mb-20'>
      <h2 className='text-2xl font-semibold  pb-3'>Latest Blog</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
        {blogs?.map((blog) => (
          <div key={blog?._id}>
            {blog?.mainImage && (
              <Link
                href={`/blog/${blog?.slug?.current}`}
              >
                <Image
                  src={urlFor(blog?.mainImage).url()}
                  alt='blogImage'
                  width={500}
                  height={500}
                  className='w-full mx-h-80 object-cover rounded-md'
                />
              </Link>
            )}
            <div className='bg-shop_light_bg p-5'>
              <div className=' text-xs flex items-center gap-5 '>
                <div className='flex items-center relative group cursor-pointer'>
                  {blog?.blogCategories?.map((item, index) => (
                    <p 
                      key={index}
                      className='font-semibold text-shop_dark_green tracking-wide'
                    >
                      dshakkjhfdjk
                      {item?.title}
                    </p>
                  ))}
                  <span className='absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-0.5 group-hover:bg-shop_btn_dark_green hover:cursor-pointer hoverEffect' />
                </div>
                <p className='flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect'>
                  <Calendar size={15} /> {""}
                  {dayjs(blog?.publishedAt).format("MMMM D, YYYY")}
                  <span className='absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-0.5 group-hover:bg-shop_btn_dark_green hover:cursor-pointer hoverEffect' />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestBlog