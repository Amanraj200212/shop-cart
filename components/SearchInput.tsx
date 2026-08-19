'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

type SearchInputProps = {
  defaultValue: string
}

const SearchInput = ({ defaultValue }: SearchInputProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const searchTerm = value.trim()
    if (searchTerm === defaultValue.trim()) {
      return
    }

    const timeout = setTimeout(() => {
      const searchUrl = searchTerm
        ? `${pathname}?q=${encodeURIComponent(searchTerm)}`
        : pathname

      router.replace(searchUrl)
    }, 350)

    return () => clearTimeout(timeout)
  }, [defaultValue, pathname, router, value])

  return (
    <Input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className='border-none'
      placeholder='Search for Products, Brands and More'
      aria-label='Search for products'
    />
  )
}

export default SearchInput
