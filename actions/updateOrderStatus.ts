"use server";

import { revalidatePath } from "next/cache";

import { assertAdminAccess } from "@/lib/admin";
import { backendClient } from "@/lib/backendClient";
import { DeliveryMethod, OrderStatus, isAllowedOrderStatus } from "@/lib/delivery";

export const updateOrderStatus = async ({
  orderId,
  deliveryMethod,
  orderStatus,
}: {
  orderId: string;
  deliveryMethod: DeliveryMethod;
  orderStatus: OrderStatus;
}) => {
  await assertAdminAccess();

  if (!orderId) {
    throw new Error("Missing order ID");
  }

  if (!isAllowedOrderStatus(deliveryMethod, orderStatus)) {
    throw new Error("This status is not valid for the selected delivery method.");
  }

  await backendClient.patch(orderId).set({ orderStatus }).commit();
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
};

export const markManualUpiOrderPaid = async (orderId: string) => {
  await assertAdminAccess();

  if (!orderId) {
    throw new Error("Missing order ID");
  }

  const order = await backendClient.fetch(
    `*[_type == "order" && _id == $orderId][0]{paymentMethod}`,
    { orderId }
  );

  if (order?.paymentMethod !== "upi_manual") {
    throw new Error("Only manual UPI orders can be verified manually.");
  }

  await backendClient
    .patch(orderId)
    .set({
      status: "paid",
      orderStatus: "confirmed",
    })
    .commit();

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
};
