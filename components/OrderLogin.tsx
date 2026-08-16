'use client'

import { useClerk } from '@clerk/nextjs'
import { useEffect } from 'react'

const OrderLogin = () => {
  const {openSignIn} = useClerk();

  useEffect(() => {
    openSignIn()
  },[openSignIn])

  return null
}

export default OrderLogin