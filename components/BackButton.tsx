'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const BackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <button type='button' onClick={handleBack} aria-label='Go back'>
      <ArrowLeft />
    </button>
  )
}

export default BackButton
