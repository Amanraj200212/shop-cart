'use client'

import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import React from 'react';
import useStore from '@/store';
import toast from 'react-hot-toast';
import { Product } from '@/sanity.types';

const AddToWishListButton = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();

  const isFavorite = favoriteProduct?.some(
    (item) => item?._id === product?._id
  );

  const handleFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!product?._id) return;

    const wasFavorite = isFavorite;

    await addToFavorite(product);

    toast.success(
      wasFavorite
        ? "Removed from Favorite!"
        : "Added to Favorite!"
    );
  };

  return (
    <div className={cn("absolute top-2 right-2 z-10 hover:cursor-pointer", className)} >
      <button
        onClick={handleFavorite}
        className={cn(
          "p-2 rounded-full bg-shop_lighter_bg hover:bg-shop_dark_green/80 hover:text-white transition",
          isFavorite && "bg-shop_dark_green/80 text-white"
        )}
      >
        <Heart size={15}/>
      </button>
    </div>
  );
};
export default AddToWishListButton;