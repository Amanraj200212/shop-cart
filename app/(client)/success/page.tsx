'use client'

import useStore from "@/store";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Home } from "lucide-react";
import Link from "next/link";

const SuccessContent = () => {
  const {resetCart} = useStore();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const orderNumber = searchParams.get("orderNumber");
  
  useEffect(() => {
    if(session_id) {
      resetCart()
    }
  } , [session_id, resetCart]);
  return (
    <div
      className="py-5 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4"
    >
      <motion.div 
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y:0}}
        transition={{duration: 0.5}}
        className="bg-white rounded-2xl flex flex-col gap-8 shadow-2xl p-6 max-w-xl w-full text-center"
      >
        <motion.div
          initial={{scale: 0}}
          animate={{scale: 1}}
          transition={{delay: 0.2, type: 'spring', stiffness: 200}}
          className="w-20 h-20 bg-shop_light_green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <Check className="text-white w-10 h-10"/>
        </motion.div>

        <h1 className="text-3xl font-bold text-shop_dark_green mb-4">
          Order Confirmed!!
        </h1>
        <div className="space-y-4 mb-4 text-left">
          <p className="text-gray-700">
            Thank you for your purchase. we&apos;re processing your order and will ship it soon. A confirmation email with your order details will be sent to your indox shortly.
          </p>
          <p className="text-gray-700">
            Order Number:{" "} 
            <span className="font-semibold">{orderNumber}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href='/'
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black/90 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2"/>
            Home
          </Link>
          <Link
            href='/orders'
            className="flex items-center justify-center px-4 py-3 border font-semibold bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2"/>
            orders
          </Link>
          <Link
            href='/orders'
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black/90 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2"/>
            shop
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

const SuccessPage = () => {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}

export default SuccessPage
