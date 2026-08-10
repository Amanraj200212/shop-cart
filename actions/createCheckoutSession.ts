'use server'

import stripe from "@/lib/strips";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

export  interface MetaData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
}

export interface GroupedCartItem{
  product: CartItem["product"];
  quantity:number;
}

const createCheckoutSession = async(items: GroupedCartItem[], metadata: MetaData) => {
  try {
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers?.data[0].id : "";
    const sessionPayLoad: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId!,
        address: JSON.stringify(metadata?.address),
      },
      mode: 'payment',
      allow_promotion_codes: true,
      payment_method_types: ['card'],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      line_items: items?.map((item) => ({
        price_data: {
          currency: 'USD',
          unit_amount: Math.round(item?.product?.price! * 100),
          product_data: {
            name: item?.product?.name || 'Unknown Product',
            description: item?.product?.description,
            metadata: {id: item?.product?._id},
            images: 
              item?.product?.images && item?.product?.images?.length > 0 ? [urlFor(item?.product?.images[0]).url()] : undefined
          },
        },
        quantity: item?.quantity,
      })
    )};
    if(customerId) {
      sessionPayLoad.customer = customerId;
    }
  } catch (error) {
    console.log("Error in creating checkout session", error);
    throw error;
  }
}

export default createCheckoutSession