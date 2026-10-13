"use server";

import { revalidatePath } from "next/cache";

import { assertAdminAccess } from "@/lib/admin";
import { backendClient } from "@/lib/backendClient";
import {
  DeliveryMethod,
  ORDER_STATUS_LABELS,
  OrderStatus,
  isAllowedOrderStatus,
} from "@/lib/delivery";
import { sendCustomerOrderStatusNotification } from "@/lib/push";

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

  const order = await backendClient.fetch<{
    _id: string;
    orderNumber?: string;
    clerkUserId?: string;
    orderStatus?: string;
  } | null>(
    `*[_type == "order" && _id == $orderId][0]{
      _id,
      orderNumber,
      clerkUserId,
      orderStatus
    }`,
    { orderId }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.orderStatus === orderStatus) {
    return;
  }

  await backendClient.patch(orderId).set({ orderStatus }).commit();
  revalidatePath("/admin/orders");
  revalidatePath("/orders");

  sendCustomerOrderStatusNotification({
    orderId,
    orderNumber: order.orderNumber,
    userId: order.clerkUserId,
    status: orderStatus,
    statusLabel: ORDER_STATUS_LABELS[orderStatus],
  }).catch((error) => {
    console.error("Failed to send customer order-status push notification:", error);
  });
};

export const markManualUpiOrderPaid = async (orderId: string) => {
  await assertAdminAccess();

  if (!orderId) {
    throw new Error("Missing order ID");
  }

  const order = await backendClient.fetch<{
    paymentMethod?: string;
    orderNumber?: string;
    clerkUserId?: string;
    orderStatus?: string;
  } | null>(
    `*[_type == "order" && _id == $orderId][0]{
      paymentMethod,
      orderNumber,
      clerkUserId,
      orderStatus
    }`,
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

  if (order.orderStatus !== "confirmed") {
    sendCustomerOrderStatusNotification({
      orderId,
      orderNumber: order.orderNumber,
      userId: order.clerkUserId,
      status: "confirmed",
      statusLabel: ORDER_STATUS_LABELS.confirmed,
    }).catch((error) => {
      console.error("Failed to send customer paid-order push notification:", error);
    });
  }
};
