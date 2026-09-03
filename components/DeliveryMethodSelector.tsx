"use client";

import { Bike, Info, Store } from "lucide-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryMethod, amountToUnlockDelivery, formatRupees, qualifiesForDelivery } from "@/lib/delivery";
import { cn } from "@/lib/utils";

interface DeliveryMethodSelectorProps {
  subtotal: number;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
}

const DeliveryMethodSelector = ({
  subtotal,
  deliveryMethod,
  onDeliveryMethodChange,
}: DeliveryMethodSelectorProps) => {
  const canDeliver = qualifiesForDelivery(subtotal);
  const unlockAmount = amountToUnlockDelivery(subtotal);
  const hasWarnedDeliveryReset = useRef(false);

  useEffect(() => {
    if (!canDeliver && deliveryMethod === "delivery") {
      if (!hasWarnedDeliveryReset.current) {
        toast.error("Home delivery requires an order above ₹500.");
        hasWarnedDeliveryReset.current = true;
      }
      return;
    }

    if (canDeliver) {
      hasWarnedDeliveryReset.current = false;
    }
  }, [canDeliver, deliveryMethod]);

  if (!canDeliver) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Receiving Method</CardTitle>
          <p className="text-sm text-gray-500">Store pickup is selected for this order.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <Info className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">Home delivery is available for orders above ₹500.</p>
              <p>Add {formatRupees(unlockAmount)} more to unlock home delivery.</p>
            </div>
          </div>
          <div className="rounded-lg border border-shop_light_green bg-shop_light_green/5 p-4">
            <div className="flex items-start gap-3">
              <Store className="mt-0.5 size-5 text-shop_dark_green" />
              <div>
                <h3 className="font-semibold text-shop_dark_green">Store Pickup</h3>
                <p className="text-sm text-gray-600">
                  Collect your order from our shop after it is prepared.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const options: Array<{
    value: DeliveryMethod;
    title: string;
    description: string;
    icon: typeof Bike;
  }> = [
    {
      value: "delivery",
      title: "Home Delivery",
      description: "Get your order delivered to your selected address.",
      icon: Bike,
    },
    {
      value: "pickup",
      title: "Store Pickup",
      description: "Collect your order from our shop.",
      icon: Store,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>How would you like to receive your order?</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = deliveryMethod === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onDeliveryMethodChange(option.value)}
              className={cn(
                "rounded-lg border p-4 text-left transition-all hover:border-shop_light_green hover:bg-shop_light_green/5",
                isSelected
                  ? "border-shop_light_green bg-shop_light_green/10 ring-2 ring-shop_light_green/20"
                  : "border-gray-200 bg-white"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 text-shop_dark_green" />
                <div>
                  <h3 className="font-semibold text-shop_dark_green">{option.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DeliveryMethodSelector;
