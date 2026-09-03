import { CheckCircle2 } from "lucide-react";

import {
  DeliveryMethod,
  ORDER_STATUS_ICONS,
  ORDER_STATUS_LABELS,
  OrderStatus,
  getAllowedOrderStatuses,
  isAllowedOrderStatus,
} from "@/lib/delivery";
import { cn } from "@/lib/utils";

interface OrderStatusTimelineProps {
  deliveryMethod?: DeliveryMethod | null;
  orderStatus?: string | null;
}

const OrderStatusTimeline = ({ deliveryMethod = "pickup", orderStatus }: OrderStatusTimelineProps) => {
  const method = deliveryMethod || "pickup";
  const currentStatus = isAllowedOrderStatus(method, orderStatus || undefined)
    ? orderStatus
    : "pending";
  const statuses = getAllowedOrderStatuses(method);
  const visibleStatuses = statuses.filter((status) => status !== "cancelled");
  const currentIndex = visibleStatuses.indexOf(currentStatus as Exclude<OrderStatus, "cancelled">);

  return (
    <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
      <h3 className="font-semibold text-shop_dark_green">Order Progress</h3>
      <div className="grid gap-3 sm:grid-cols-5">
        {visibleStatuses.map((status, index) => {
          const Icon = ORDER_STATUS_ICONS[status] || CheckCircle2;
          const isComplete = currentIndex >= index;

          return (
            <div key={status} className="flex items-center gap-2 sm:flex-col sm:items-start">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border",
                  isComplete
                    ? "border-shop_light_green bg-shop_light_green text-white"
                    : "border-gray-200 bg-white text-gray-400"
                )}
              >
                <Icon className="size-4" />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isComplete ? "text-shop_dark_green" : "text-gray-500"
                )}
              >
                {ORDER_STATUS_LABELS[status]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
