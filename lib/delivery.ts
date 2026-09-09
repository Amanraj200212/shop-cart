import { Bike, CheckCircle2, Clock, PackageCheck, PackageOpen, Store } from "lucide-react";

import { cn } from "@/lib/utils";

export const DELIVERY_MINIMUM = 500;

export const STORE_PICKUP_DETAILS = {
  name: "Shop-Cart Grocery Store",
  address: "Yadu More, Mashrakh",
  openingHours: "Open daily, 8:00 AM - 10:00 PM",
};

export type DeliveryMethod = "delivery" | "pickup";

export type DeliveryOrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PickupOrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "cancelled";

export type OrderStatus = DeliveryOrderStatus | PickupOrderStatus;

export const qualifiesForDelivery = (subtotal: number) => subtotal > DELIVERY_MINIMUM;

export const amountToUnlockDelivery = (subtotal: number) =>
  Math.max(DELIVERY_MINIMUM - subtotal, 0);

export const formatRupees = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);

export const getAllowedOrderStatuses = (deliveryMethod: DeliveryMethod): OrderStatus[] =>
  deliveryMethod === "delivery"
    ? ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]
    : ["pending", "confirmed", "preparing", "ready_for_pickup", "picked_up", "cancelled"];

export const isAllowedOrderStatus = (
  deliveryMethod: DeliveryMethod,
  status: string | undefined
): status is OrderStatus =>
  Boolean(status && getAllowedOrderStatuses(deliveryMethod).includes(status as OrderStatus));

export const getDeliveryMethodLabel = (deliveryMethod?: string) =>
  deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup";

export const getDeliveryMethodIcon = (deliveryMethod?: string) =>
  deliveryMethod === "delivery" ? Bike : Store;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  ready_for_pickup: "Ready for Pickup",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  preparing: PackageOpen,
  out_for_delivery: Bike,
  delivered: PackageCheck,
  ready_for_pickup: Store,
  picked_up: PackageCheck,
  cancelled: Clock,
};

export const statusBadgeClassName = (status: OrderStatus) =>
  cn(
    "capitalize",
    status === "cancelled" && "border-red-200 bg-red-50 text-red-700",
    ["delivered", "picked_up"].includes(status) && "border-green-200 bg-green-50 text-green-700",
    ["ready_for_pickup", "out_for_delivery"].includes(status) &&
      "border-blue-200 bg-blue-50 text-blue-700",
    ["pending", "confirmed", "preparing"].includes(status) &&
      "border-amber-200 bg-amber-50 text-amber-800"
  );
