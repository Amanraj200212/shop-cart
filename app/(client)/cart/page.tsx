'use client'

import createManualUpiOrder from "@/actions/createManualUpiOrder";
import createCheckoutSession, { MetaData } from "@/actions/createCheckoutSession";
import AddToWishListButton from "@/components/AddToWishListButton";
import CheckoutAddressSelector from "@/components/address/CheckoutAddressSelector";
import Container from "@/components/Container";
import DeliveryMethodSelector from "@/components/DeliveryMethodSelector";
import EmptyCart from "@/components/EmptyCart";
import ManualUpiPayment from "@/components/ManualUpiPayment";
import NoAccess from "@/components/NoAccess";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import PickupContactForm from "@/components/PickupContactForm";
import PickupInformation from "@/components/PickupInformation";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButton from "@/components/QuantityButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddressDocument, toShippingAddressSnapshot } from "@/lib/address";
import { DeliveryMethod, qualifiesForDelivery } from "@/lib/delivery";
import { PaymentMethod } from "@/lib/payment";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState }from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const router = useRouter();
  const {
    deleteCartProduct, 
    getTotalPrice, 
    getItemCount, 
    getSubTotalPrice, 
    resetCart,
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const {isSignedIn} = useAuth();
  const {user} = useUser();
  const [selectedAddress, setSelectedAddress] = useState<AddressDocument | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [pickupFullName, setPickupFullName] = useState(user?.fullName || "");
  const [pickupPhone, setPickupPhone] = useState(user?.primaryPhoneNumber?.phoneNumber || "");
  const [upiTransactionId, setUpiTransactionId] = useState("");
  const subtotal = getTotalPrice();
  const canDeliver = qualifiesForDelivery(subtotal);
  const checkoutDeliveryMethod: DeliveryMethod = canDeliver ? deliveryMethod : "pickup";

  useEffect(() => {
    if (canDeliver || deliveryMethod === "pickup") return;

    const timer = window.setTimeout(() => setDeliveryMethod("pickup"), 0);
    return () => window.clearTimeout(timer);
  }, [canDeliver, deliveryMethod]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPickupFullName((currentName) => currentName || user?.fullName || "");
      setPickupPhone((currentPhone) => currentPhone || user?.primaryPhoneNumber?.phoneNumber || "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [user?.fullName, user?.primaryPhoneNumber?.phoneNumber]);

  const handleResetCart = () => {
    const confirmed = window.confirm('Are you sure you want to reset your cart?');
    if(confirmed) {
      resetCart();
      toast.success('Cart reset successfully!')
    }
  }

  const handleCheckOut = async() => {
    if (checkoutDeliveryMethod === "delivery" && !selectedAddress) {
      toast.error("Please select or add a delivery address");
      return;
    }

    if (checkoutDeliveryMethod === "pickup") {
      if (!pickupFullName.trim()) {
        toast.error("Please enter your full name for store pickup");
        return;
      }

      if (!/^(?:\+91[\s-]?|91[\s-]?)?[6-9]\d{9}$/.test(pickupPhone.trim())) {
        toast.error("Please enter a valid mobile number for store pickup");
        return;
      }
    }

    if (paymentMethod === "upi_manual" && upiTransactionId.trim().length < 6) {
      toast.error("Please enter your UPI transaction ID after payment");
      return;
    }

    setIsLoading(true);
    try {
      const metaData: MetaData = {
        orderNumber: crypto.randomUUID(),
        customerName:
          checkoutDeliveryMethod === "pickup"
            ? pickupFullName.trim()
            : user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        customerPhone:
          checkoutDeliveryMethod === "pickup"
            ? pickupPhone.trim()
            : selectedAddress?.phone || user?.primaryPhoneNumber?.phoneNumber || "",
        clerkUserId: user?.id,
        deliveryMethod: checkoutDeliveryMethod,
        address: checkoutDeliveryMethod === "delivery" ? toShippingAddressSnapshot(selectedAddress) : null,
      };

      if (paymentMethod === "upi_manual") {
        await createManualUpiOrder({
          items: groupedItems,
          metadata: metaData,
          upiTransactionId,
        });
        resetCart();
        toast.success("Order placed. Payment is pending verification.");
        router.push(`/success?orderNumber=${metaData.orderNumber}&payment=upi`);
        return;
      }

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
                <div className='border-b mb-10'>
                  <h2 className='text-2xl font-semibold pb-3'>Shopping Cart Itmes </h2>
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
                                      <TooltipTrigger asChild>
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
                                      <TooltipTrigger asChild>
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
                      <div className="mb-5">
                        <DeliveryMethodSelector
                          subtotal={subtotal}
                          deliveryMethod={deliveryMethod}
                          onDeliveryMethodChange={setDeliveryMethod}
                        />
                      </div>
                      <div className="mb-5">
                        <PaymentMethodSelector
                          paymentMethod={paymentMethod}
                          onPaymentMethodChange={setPaymentMethod}
                        />
                      </div>
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
                            {isLoading
                              ? 'Your order is processing...'
                              : paymentMethod === "upi_manual"
                                ? "Place UPI Order"
                                : 'Proceed to checkout'}
                          </Button>
                        </div>
                      </div>
                        <div className="mt-5">
                          {checkoutDeliveryMethod === "delivery" ? (
                            <CheckoutAddressSelector
                              selectedAddress={selectedAddress}
                              onSelectAddress={setSelectedAddress}
                              defaultEmail={user?.primaryEmailAddress?.emailAddress}
                              defaultFullName={user?.fullName || ""}
                            />
                          ) : (
                            <div className="space-y-5">
                              <PickupContactForm
                                fullName={pickupFullName}
                                phone={pickupPhone}
                                onFullNameChange={setPickupFullName}
                                onPhoneChange={setPickupPhone}
                              />
                              <PickupInformation />
                            </div>
                          )}
                          {paymentMethod === "upi_manual" && (
                            <div className="mt-5">
                              <ManualUpiPayment
                                amount={getTotalPrice()}
                                transactionId={upiTransactionId}
                                onTransactionIdChange={setUpiTransactionId}
                              />
                            </div>
                          )}
                        </div>
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
                            {isLoading
                              ? ''
                              : paymentMethod === "upi_manual"
                                ? "Place UPI Order"
                                : 'Proceed to checkout'}
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
