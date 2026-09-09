"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bike, CalendarDays, ChevronDown, Package, Phone, Store, User } from "lucide-react";
import toast from "react-hot-toast";

import { markManualUpiOrderPaid, updateOrderStatus } from "@/actions/updateOrderStatus";
import { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import PriceFormatter from "@/components/PriceFormatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DeliveryMethod,
  ORDER_STATUS_LABELS,
  OrderStatus,
  getAllowedOrderStatuses,
  getDeliveryMethodLabel,
  statusBadgeClassName,
} from "@/lib/delivery";
import { cn } from "@/lib/utils";

type AdminOrder = MY_ORDERS_QUERY_RESULT[number];

const adminTabs = [
  { value: "new", label: "New Orders" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready for Pickup" },
  { value: "out", label: "Out for Delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All Orders" },
] as const;

type AdminTab = (typeof adminTabs)[number]["value"];

const getOrderStatus = (order: AdminOrder): OrderStatus =>
  (order.orderStatus || "pending") as OrderStatus;

const getDeliveryMethod = (order: AdminOrder): DeliveryMethod =>
  order.deliveryMethod === "delivery" ? "delivery" : "pickup";

const getOrdersForTab = (orders: AdminOrder[], tab: AdminTab) => {
  switch (tab) {
    case "new":
      return orders.filter((order) => ["pending", "confirmed"].includes(getOrderStatus(order)));
    case "preparing":
      return orders.filter((order) => getOrderStatus(order) === "preparing");
    case "ready":
      return orders.filter((order) => getOrderStatus(order) === "ready_for_pickup");
    case "out":
      return orders.filter((order) => getOrderStatus(order) === "out_for_delivery");
    case "completed":
      return orders.filter((order) => ["delivered", "picked_up"].includes(getOrderStatus(order)));
    case "cancelled":
      return orders.filter((order) => getOrderStatus(order) === "cancelled");
    default:
      return orders;
  }
};

const AdminOrdersDashboard = ({ orders }: { orders: MY_ORDERS_QUERY_RESULT }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("new");
  const [localOrders, setLocalOrders] = useState(orders);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visibleOrders = useMemo(
    () => getOrdersForTab(localOrders, activeTab),
    [activeTab, localOrders]
  );

  const counts = useMemo(
    () =>
      adminTabs.reduce(
        (acc, tab) => ({ ...acc, [tab.value]: getOrdersForTab(localOrders, tab.value).length }),
        {} as Record<AdminTab, number>
      ),
    [localOrders]
  );

  const handleStatusChange = (order: AdminOrder, orderStatus: OrderStatus) => {
    const deliveryMethod = getDeliveryMethod(order);
    setUpdatingOrderId(order._id);

    startTransition(async () => {
      try {
        await updateOrderStatus({
          orderId: order._id,
          deliveryMethod,
          orderStatus,
        });
        setLocalOrders((currentOrders) =>
          currentOrders.map((item) =>
            item._id === order._id ? { ...item, orderStatus } : item
          )
        );
        router.refresh();
        toast.success("Order status updated");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to update order");
      } finally {
        setUpdatingOrderId(null);
      }
    });
  };

  const handleMarkPaid = (order: AdminOrder) => {
    setUpdatingOrderId(order._id);

    startTransition(async () => {
      try {
        await markManualUpiOrderPaid(order._id);
        setLocalOrders((currentOrders) =>
          currentOrders.map((item) =>
            item._id === order._id
              ? { ...item, status: "paid", orderStatus: "confirmed" }
              : item
          )
        );
        router.refresh();
        toast.success("UPI payment marked as paid");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to verify payment");
      } finally {
        setUpdatingOrderId(null);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {adminTabs.slice(0, 6).map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-lg border bg-white p-4 text-left transition hover:border-shop_light_green",
              activeTab === tab.value && "border-shop_light_green ring-2 ring-shop_light_green/20"
            )}
          >
            <p className="text-xs font-medium text-gray-500">{tab.label}</p>
            <p className="mt-2 text-2xl font-bold text-shop_dark_green">{counts[tab.value]}</p>
          </button>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AdminTab)}>
        <ScrollArea>
          <TabsList className="min-w-max">
            {adminTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                <span className="rounded-full bg-white px-1.5 text-xs text-gray-600">
                  {counts[tab.value]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {adminTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Shipping Address</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead className="text-right">Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleOrders.length ? (
                        visibleOrders.map((order) => {
                          const deliveryMethod = getDeliveryMethod(order);
                          const orderStatus = getOrderStatus(order);
                          const allowedStatuses = getAllowedOrderStatuses(deliveryMethod);
                          const customerPhone = order.customerPhone || order.address?.phone || "N/A";

                          return (
                            <TableRow key={order._id} className="align-top">
                              <TableCell className="min-w-40 font-medium">
                                {order.orderNumber?.slice(-10) || "N/A"}
                              </TableCell>
                              <TableCell className="min-w-52">
                                <div className="space-y-1">
                                  <p className="flex items-center gap-1.5 font-medium">
                                    <User className="size-3.5 text-gray-500" />
                                    {order.customerName || "N/A"}
                                  </p>
                                  <p className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <Phone className="size-3.5" />
                                    {customerPhone}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="min-w-56">
                                <div className="space-y-1">
                                  {order.products?.map((item) => (
                                    <p key={item._key} className="flex items-center gap-1.5 text-sm">
                                      <Package className="size-3.5 text-gray-500" />
                                      <span>{item.product?.name || "Deleted product"}</span>
                                      <span className="font-semibold">x{item.quantity || 0}</span>
                                    </p>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="min-w-28">
                                <PriceFormatter amount={order.totalPrice} className="text-black" />
                              </TableCell>
                              <TableCell>
                                <div className="space-y-2">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      order.status === "paid"
                                        ? "border-green-200 bg-green-50 text-green-700"
                                        : "border-amber-200 bg-amber-50 text-amber-800"
                                    )}
                                  >
                                    {order.status?.replaceAll("_", " ") || "pending"}
                                  </Badge>
                                  <p className="text-xs text-gray-500">
                                    {order.paymentMethod === "upi_manual" ? "Manual UPI" : "Stripe"}
                                  </p>
                                  {order.upiTransactionId && (
                                    <p className="text-xs font-medium text-gray-700">
                                      UPI: {order.upiTransactionId}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="gap-1 border-shop_light_green/40 text-shop_dark_green"
                                >
                                  {deliveryMethod === "delivery" ? (
                                    <Bike className="size-3" />
                                  ) : (
                                    <Store className="size-3" />
                                  )}
                                  {getDeliveryMethodLabel(deliveryMethod)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={statusBadgeClassName(orderStatus)}>
                                  {ORDER_STATUS_LABELS[orderStatus] || orderStatus}
                                </Badge>
                              </TableCell>
                              <TableCell className="min-w-64 text-sm text-gray-700">
                                {deliveryMethod === "delivery" && order.address ? (
                                  <div>
                                    <p className="font-medium text-darkColor">{order.address.fullName}</p>
                                    <p>
                                      {[
                                        order.address.address,
                                        order.address.addressLine2,
                                        order.address.city,
                                        order.address.state,
                                        order.address.pinCode,
                                      ]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Store pickup</span>
                                )}
                              </TableCell>
                              <TableCell className="min-w-40">
                                <p className="flex items-center gap-1.5 text-sm">
                                  <CalendarDays className="size-3.5 text-gray-500" />
                                  {order.orderDate
                                    ? new Date(order.orderDate).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col items-end gap-2">
                                  {order.paymentMethod === "upi_manual" &&
                                    order.status !== "paid" && (
                                      <Button
                                        type="button"
                                        variant="custom"
                                        size="sm"
                                        disabled={isPending && updatingOrderId === order._id}
                                        onClick={() => handleMarkPaid(order)}
                                      >
                                        Mark Paid
                                      </Button>
                                    )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={isPending && updatingOrderId === order._id}
                                      >
                                        Status
                                        <ChevronDown className="size-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                      {allowedStatuses.map((status) => (
                                        <DropdownMenuItem
                                          key={status}
                                          disabled={status === orderStatus}
                                          onSelect={() => handleStatusChange(order, status)}
                                        >
                                          {ORDER_STATUS_LABELS[status]}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={10} className="h-32 text-center text-gray-500">
                            No orders in this view.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminOrdersDashboard;
