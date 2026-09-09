"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import type { GroupedCartItem, MetaData } from "@/actions/createCheckoutSession";
import { backendClient } from "@/lib/backendClient";

const updateStockLevels = async (
  stockUpdates: { productId: string; quantity: number }[]
) => {
  for (const { productId, quantity } of stockUpdates) {
    try {
      const product = await backendClient.getDocument(productId);

      if (!product || typeof product.stock !== "number") {
        console.warn(`Product with Id ${productId} not found or stock is invalid`);
        continue;
      }

      const newStock = Math.max(product.stock - quantity, 0);
      await backendClient.patch(productId).set({ stock: newStock }).commit();
    } catch (error) {
      console.error(`Failed to update stock for product ${productId}:`, error);
    }
  }
};

const createManualUpiOrder = async ({
  items,
  metadata,
  upiTransactionId,
}: {
  items: GroupedCartItem[];
  metadata: MetaData;
  upiTransactionId: string;
}) => {
  const { userId } = await auth();

  if (!userId || metadata.clerkUserId !== userId) {
    throw new Error("You must be signed in to place an order.");
  }

  const transactionId = upiTransactionId.trim();

  if (transactionId.length < 6) {
    throw new Error("Enter a valid UPI transaction ID.");
  }

  if (!metadata.customerName.trim() || !metadata.customerPhone?.trim()) {
    throw new Error("Name and phone number are required.");
  }

  if (metadata.deliveryMethod === "delivery" && !metadata.address) {
    throw new Error("Delivery orders require a shipping address.");
  }

  const sanityProducts = [];
  const stockUpdate = [];
  let totalPrice = 0;

  for (const item of items) {
    const productId = item.product._id;
    const quantity = item.quantity || 0;
    const price = item.product.price || 0;

    if (!productId || quantity <= 0) continue;

    sanityProducts.push({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: productId,
      },
      quantity,
    });
    stockUpdate.push({ productId, quantity });
    totalPrice += price * quantity;
  }

  const order = await backendClient.create({
    _type: "order",
    orderNumber: metadata.orderNumber,
    customerName: metadata.customerName,
    customerPhone: metadata.customerPhone,
    stripeCustomerId: metadata.customerEmail,
    clerkUserId: metadata.clerkUserId,
    email: metadata.customerEmail,
    products: sanityProducts,
    totalPrice,
    currency: "inr",
    amountDiscount: 0,
    status: "pending_verification",
    paymentMethod: "upi_manual",
    upiTransactionId: transactionId,
    deliveryMethod: metadata.deliveryMethod,
    orderStatus: "pending",
    orderDate: new Date().toISOString(),
    invoice: null,
    address:
      metadata.deliveryMethod === "delivery" && metadata.address
        ? {
            fullName: metadata.address.fullName,
            email: metadata.address.email,
            phone: metadata.address.phone,
            address: metadata.address.address,
            addressLine2: metadata.address.addressLine2,
            city: metadata.address.city,
            state: metadata.address.state,
            pinCode: metadata.address.pinCode,
            zip: metadata.address.pinCode,
            country: metadata.address.country,
            latitude: metadata.address.latitude,
            longitude: metadata.address.longitude,
          }
        : null,
  });

  await updateStockLevels(stockUpdate);
  revalidatePath("/admin/orders");
  revalidatePath("/orders");

  return order;
};

export default createManualUpiOrder;
