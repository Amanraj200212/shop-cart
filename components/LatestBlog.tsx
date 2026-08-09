import { urlFor } from '@/sanity/lib/image';
import { getLatestBlogs } from '@/sanity/queries'
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';

const LatestBlog = async() => {
  const blogs = await getLatestBlogs();
  return (
    <div className='mb-10 lg:mb-20'>
      <h2 className='text-2xl font-semibold  pb-3'>Latest Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-5">
        {blogs?.map((blog) => (
          <div key={blog?._id} className="rounded-md overflow-hidden border border-shop_dark_green/10 hover:border-shop_dark_green hoverEffect">
            {blog?.mainImage && (
              <Link
                href={`/blog/${blog?.slug?.current}`}
              >
                <Image
                  src={urlFor(blog?.mainImage).url()}
                  alt='blogImage'
                  width={500}
                  height={500}
                  className='w-full max-h-80 object-cover'
                />
              </Link>
            )}
            <div className='bg-white p-5'>
              <div className="text-xs flex items-center gap-5 mb-5">
                <div className="flex items-center relative group cursor-pointer">
                  {blog?.blogcategories?.map((item, index) => (
                    <p
                      key={index}
                      className='font-semibold text-shop_dark_green tracking-wider'
                    >
                      {item?.title}
                    </p>
                  ))}
                  <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-0.5 group-hover:bg-shop_dark_green hover:cursor-pointer hoverEffect"/>
                </div>  
                <p className='flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect'>
                  <Calendar size={15} /> {""}
                  {dayjs(blog?.publishedAt).format("MMMM D, YYYY")}
                  <span className=" absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-0.5 group-hover:bg-shop_dark_green hoverEffect"></span>
                </p>
              </div>
              <Link href={`/blog/${blog?.slug?.current}`} className="text-base font-bold tracking-wide mt-5 line-clamp-2 hover:text-shop_dark_green hoverEffect">
                {blog?.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestBlog