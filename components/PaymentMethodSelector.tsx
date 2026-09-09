"use client";

import { CreditCard, QrCode } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethod } from "@/lib/payment";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

const paymentOptions: Array<{
  value: PaymentMethod;
  title: string;
  description: string;
  icon: typeof CreditCard;
}> = [
  {
    value: "stripe",
    title: "Card Payment",
    description: "Pay securely online with Stripe.",
    icon: CreditCard,
  },
  {
    value: "upi_manual",
    title: "UPI QR Payment",
    description: "Scan, pay, and enter your transaction ID.",
    icon: QrCode,
  },
];

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
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = paymentMethod === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onPaymentMethodChange(option.value)}
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

export default PaymentMethodSelector;
