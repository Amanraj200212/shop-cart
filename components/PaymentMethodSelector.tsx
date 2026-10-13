"use client";

import { CreditCard, QrCode, Banknote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAYMENT_METHOD_OPTIONS } from "@/lib/payment";
import type { PaymentMethod } from "@/lib/payment";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

const paymentIcons: Record<PaymentMethod, LucideIcon> = {
  stripe: CreditCard,
  upi_manual: QrCode,
  cash_on_delivery: Banknote,
};

const PaymentMethodSelector = ({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {PAYMENT_METHOD_OPTIONS.map((option) => {
          const Icon = paymentIcons[option.value];
          const isSelected = paymentMethod === option.value;
          const isDisabled = option.disabled;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (!isDisabled) {
                  onPaymentMethodChange(option.value);
                }
              }}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              className={cn(
                "rounded-lg border p-4 text-left transition-all",
                isSelected
                  ? "border-shop_light_green bg-shop_light_green/10 ring-2 ring-shop_light_green/20"
                  : "border-gray-200 bg-white",
                isDisabled
                  ? "cursor-not-allowed border-red-200 bg-red-50/70 opacity-80"
                  : "hover:border-shop_light_green hover:bg-shop_light_green/5"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    "mt-0.5 size-5",
                    isDisabled ? "text-red-600" : "text-shop_dark_green"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-shop_dark_green">{option.title}</h3>
                    {isDisabled && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Disabled
                      </span>
                    )}
                  </div>
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

export default PaymentMethodSelector;
