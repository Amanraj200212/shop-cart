'use client'

import createCheckoutSession, { MetaData } from "@/actions/createCheckoutSession";
import AddToWishListButton from "@/components/AddToWishListButton";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButton from "@/components/QuantityButton";
import { Title } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBagIcon, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState }from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct, 
    getTotalPrice, 
    getItemCount, 
    getSubTotalPrice, 
    resetCart,
    getGroupedItems,
  } = useStore();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const {isSignedIn} = useAuth();
  const {user} = useUser();
  const [addressess, setAddressess] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchAddressess = async() => {
      setIsLoading(true);
      try {
        const query = `*[_type == "address"] | order(publishedAt desc)`;
        const data = await client.fetch(query);
        setAddressess(data);
        const defaultAddress = data.find((addr: Address) => addr.default);
        if(defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if(data.length > 0) {
          setSelectedAddress(data[0]);
        }
      } catch (error) {
        console.error('Error in fetching Address' , error)
      } finally{
        setIsLoading(false);
      }
    }
    fetchAddressess();
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm('Are you sure you want to reset your cart?');
    if(confirmed) {
      resetCart();
      toast.success('Cart reset successfully!')
    }
  }

  const handleCheckOut = async() => {
    setIsLoading(true);
    try {
      const metaData: MetaData = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
      };
      const checkOutUrl = await createCheckoutSession(groupedItems, metaData);
      if(checkOutUrl){
        window.location.href = checkOutUrl;
      }
    } catch (error) {
      console.error("Error in Creating checkout session", error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
          <Container >
            {groupedItems?.length ? (
              <>
                <div className="flex items-center gap-2 py-5">
                  <ShoppingBagIcon  className="text-darkColor"/>
                  <Title className="text-black font-semibold pb-3">Shopping Cart</Title>
                </div>
                <div className="grid lg:grid-cols-3 md:gap-8">
                  <div className="lg:col-span-2 rounded-lg">
                    <div className="border bg-white rounded-md">
                      {groupedItems?.map(({product}) => {
                        const itemCount = getItemCount(product?._id);
                        return (
                          <div 
                            key={product?._id}
                            className="flex items-center justify-between gap-5 border-b p-2.5 last:border-b-0"
                          >
                            <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                              {product?.images && ( 
                                <Link 
                                  href={`/product/${product?.slug?.current}`}
                                  className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                                >
                                  <Image 
                                    src={urlFor(product?.images[0]).url()} 
                                    alt="product_image"
                                    width={500}
                                    height={500}
                                    loading='lazy'
                                    className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                  />
                                </Link>
                              )}
                              <div className="h-full flex flex-1 flex-col justify-between py-1">
                                <div className="flex flex-col gap-0.5 md:gap-1.5">
                                  <h2 className="text-shop_dark_green font-semibold line-clamp-1">
                                    {product?.name}
                                  </h2>
                                  <p className="text-sm text-shop_dark_green capitalize">
                                    Variant:{" "}
                                    <span className="font-semibold text-shop_light_green">
                                      {product?.variant}
                                    </span>
                                  </p>
                                  <p className="text-sm text-shop_dark_green capitalize">
                                    Status:{" "}
                                    <span className="font-semibold text-shop_light_green">
                                      {product?.status}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <AddToWishListButton 
                                          product={product} 
                                          className="relative top-0 right-0"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent className="font-bold">
                                        Add to Favorite
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Trash 
                                          onClick={() =>{ 
                                            deleteCartProduct(product?._id);
                                            toast.success('Product deleted from cart!');
                                            }
                                          }
                                          className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent className="font-bold">
                                        Delete product
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                              <PriceFormatter 
                                amount={(product?.price as number)* itemCount}
                                className="text-lg font-bold"
                              />
                              <QuantityButton product={product} />
                            </div>
                          </div>
                        );
                      })}
                      <Button 
                        onClick={handleResetCart}
                        variant='destructive'
                        className="m-5 font-semibold"
                      >
                        Reset Cart
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="lg:col-span-1">
                      <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Order Summarry</h2>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>SubTotal</span>
                            <PriceFormatter amount={getSubTotalPrice()} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Discount</span>
                            <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between font-semibold text-shop_dark_green  ">
                            <span>Total</span>
                            <PriceFormatter className="font-bold text-lg" amount={getTotalPrice()} />
                          </div>
                          <Button
                            className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                            variant='custom'
                            onClick={handleCheckOut}
                            disabled={isLoading}
                          >
                            {isLoading ? '' : 'Proceed to checkout'}
                          </Button>
                        </div>
                      </div>
                        {addressess && (
                          <div className="bg-white rounded-md mt-5">
                            <Card>
                              <CardHeader>
                                <CardTitle>
                                  Delivery Address
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <RadioGroup defaultValue={addressess?.find((addr) => addr.default)?._id.toString()}>
                                  {addressess?.map((address) => (
                                    <div 
                                      key={address._id}
                                      onClick={() => setSelectedAddress(address)}
                                      className={`flex items-center space-x-2 mb-4 cursor-pointer ${selectedAddress?._id === address?._id && 'text-shop_dark_green'}`}
                                    >
                                      <RadioGroupItem value={address?._id.toString()} />
                                      <Label 
                                        htmlFor={`address-${address?._id}`}
                                        className="grid gap-1.5 flex-1"
                                      >
                                        <span className="font-semibold">{address?.name}</span>
                                        <span className="text-sm text-black/60">
                                          {address?.address},{address?.city},{" "}{address?.state} {address?.zip}
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                                <Button 
                                  variant='outline' 
                                  className="w-fulll mt-4"
                                >
                                  + Add New Address
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                    </div>
                  </div>
                      {/* FOR MOBILE VIEW OF ORDER SUMMARY */}
                    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                      <div className="bg-white p-4 rounded-lg border mx-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>SubTotal</span>
                            <PriceFormatter amount={getSubTotalPrice()} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Discount</span>
                            <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between font-semibold text-shop_dark_green  ">
                            <span>Total</span>
                            <PriceFormatter className="font-bold text-lg" amount={getTotalPrice()} />
                          </div>
                          <Button
                            className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                            variant='custom'
                            onClick={handleCheckOut}
                            disabled={isLoading}
                          >
                            {isLoading ? '' : 'Proceed to checkout'}
                          </Button>
                        </div>
                      </div>
                    </div>
                </div>
              </>
            ) : (
              <EmptyCart />
            )}
          </Container> 
        ) : (
          <NoAccess />
        )
      }
    </div>
  )
}

export default CartPage