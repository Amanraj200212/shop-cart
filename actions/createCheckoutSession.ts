'use server'

import stripe from "@/lib/strips";
import type { DeliveryMethod } from "@/lib/delivery";
import { formatWeight, isLooseProduct } from "@/lib/loose-products";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import type Stripe from "stripe";

export interface ShippingAddressSnapshot {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface MetaData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  clerkUserId?: string;
  deliveryMethod: DeliveryMethod;
  address?: ShippingAddressSnapshot | null;
}

export interface GroupedCartItem {
  product: CartItem["product"];
  quantity: number;
  selectedWeightGrams?: number;
  linePrice?: number;
  pricePerKg?: number;
}

const createCheckoutSession = async(items: GroupedCartItem[], metadata: MetaData) => {
  try {
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;
    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        customerPhone: metadata.customerPhone ?? "",
        clerkUserId: metadata.clerkUserId ?? "",
        deliveryMethod: metadata.deliveryMethod,
        address: JSON.stringify(metadata.address),
      },
      customer: customerId,
      customer_email: customerId ? undefined : metadata.customerEmail,
      mode: 'payment',
      allow_promotion_codes: true,
      payment_method_types: ['card'],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      line_items: items.map((item) => {
        const isLoose = isLooseProduct(item.product);
        const price = isLoose ? item.linePrice : item.product.price;

        if (typeof price !== "number") {
          throw new Error(`Missing price for product ${item.product._id}`);
        }

        const selectedWeight = item.selectedWeightGrams
          ? formatWeight(item.selectedWeightGrams)
          : undefined;

        return {
          price_data: {
            currency: 'inr',
            unit_amount: Math.round(price * 100),
            product_data: {
              name: selectedWeight
                ? `${item.product.name || "Unknown Product"} - ${selectedWeight}`
                : item.product.name || 'Unknown Product',
              description: item.product.description,
              metadata: {
                id: item.product._id,
                sellingType: item.product.sellingType || "fixed",
                selectedWeightGrams: item.selectedWeightGrams?.toString() || "",
                pricePerKg: item.pricePerKg?.toString() || "",
                linePrice: item.linePrice?.toString() || "",
              },
              images: 
                item.product.images && item.product.images.length > 0 ? [urlFor(item.product.images[0]).url()] : undefined
            },
          },
          quantity: item.quantity,
        };
      }),
    };

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.log("Error in creating checkout session", error);
    throw error;
  }
}

export default createCheckoutSession
