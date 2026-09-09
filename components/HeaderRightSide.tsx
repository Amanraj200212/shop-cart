import {SignInButton, SignOutButton } from '@clerk/nextjs'
import { LogOut, } from 'lucide-react'
import {  currentUser } from '@clerk/nextjs/server'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import CartIcon from './CartIcon'
import FavoriteBtn from './FavoriteBtn'
import Image from 'next/image'
import OrderIcon from './OrderIcon'

const HeaderRightSide = async () => {
  const user = await currentUser()
  const displayName = user?.firstName || user?.username || 'Your account'
  const initials = displayName.slice(0, 1).toUpperCase()

  if (!user) {
    return (
      <SignInButton mode='modal'>
        <button
          type='button'
          className='inline-flex items-center justify-center rounded-full bg-shop_dark_green/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-shop_dark_green focus:outline-none focus:ring-2 focus:ring-shop_dark_green/40'
        >
          Login
        </button>
      </SignInButton>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label={`Open ${displayName}'s account menu`}
          className='flex items-center rounded-full border border-shop_light_green/30 bg-white p-1 transition-colors hover:border-shop_light_green hover:bg-shop_light_bg focus:outline-none focus:ring-2 focus:ring-shop_light_green/40'
        >
          <span className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-shop_dark_green text-sm font-semibold text-white'>
            {user.imageUrl ? (
              <Image width={36} height={36} src={user.imageUrl} alt={displayName} className='h-full w-full object-cover' />
            ) : (
              initials
            )}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64 p-2'>
        <DropdownMenuLabel className='flex items-center gap-3 px-3 py-3 font-normal'>
          <span className='min-w-0'>
            <span className='block truncate font-semibold text-shop_dark_green'>{displayName}</span>
            <span className='block truncate text-xs font-normal text-shop_light_text'>{user.primaryEmailAddress?.emailAddress}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className='p-5' asChild>
          <CartIcon />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <FavoriteBtn />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <OrderIcon />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <SignOutButton>
            <button type='button' className='flex w-full items-center gap-2 text-red-600'><LogOut /> Sign out</button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HeaderRightSide