import Logo from '@/components/Logo'
import Link from 'next/link'
import React from 'react'

const notFoundPage = () => {
  return (
    <div className='bg-white flex flex-col items-center justify-center px-4 sm:px-6 py-10 md:py-32'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <Logo />
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>Looking for something?</h2>
          <p className='mt-2 text-3xl text-gray-600'>We&apos;re sorry. the web address you entred is not a functioning page on our site</p>
        </div>
        <div className='mt-8 space-y-6'>
          <div className='rounded-md shadow-sm space-y-4'>
            <Link 
              href='/' 
              className='w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-shop_dark_green/80 hover:bg-shop_dark_green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazonOrangeDark hoverEffect'
            >
             Go to ShopCart&apos;s home page 
            </Link>
            <Link 
              href='/help' 
              className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-md text-amazonBlue bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazonBlue'
            >
             Help 
            </Link>
          </div>
        </div>
        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-600'>
            Need help? Visit the {" "}
            <Link
              href="/help" 
              className='font-medium text-blue-600 hover:text-blue-900'
            >
              Help section
            </Link>{" "}
            or{" "}
            <Link
              href="/contact" 
              className='font-medium text-blue-600 hover:text-blue-900'
            >
              contact us.
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default notFoundPage