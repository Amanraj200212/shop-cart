"use client";

import { Copy, QrCode } from "lucide-react";
import toast from "react-hot-toast";

import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UPI_PAYMENT_DETAILS } from "@/lib/payment";

interface ManualUpiPaymentProps {
  amount: number;
  transactionId: string;
  onTransactionIdChange: (value: string) => void;
}

const ManualUpiPayment = ({
  amount,
  transactionId,
  onTransactionIdChange,
}: ManualUpiPaymentProps) => {
  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_PAYMENT_DETAILS.upiId);
      toast.success("UPI ID copied");
    } catch {
      toast.error("Unable to copy UPI ID");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-shop_dark_green">UPI QR Payment</h3>
        <p className="text-sm text-gray-500">
          Pay the exact amount, then enter your transaction ID for verification.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div className="flex aspect-square items-center justify-center rounded-lg border bg-gray-50">
          {UPI_PAYMENT_DETAILS.qrImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={UPI_PAYMENT_DETAILS.qrImage}
              alt="UPI QR code"
              className="h-full w-full rounded-lg object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center text-gray-500">
              <QrCode className="size-10" />
              <p className="px-3 text-xs">Add QR image URL in NEXT_PUBLIC_UPI_QR_IMAGE</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-shop_light_green/10 p-3">
            <p className="text-xs font-medium text-gray-500">Amount to Pay</p>
            <PriceFormatter amount={amount} className="text-lg font-bold text-shop_dark_green" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">UPI ID</p>
            <div className="flex gap-2">
              <div className="flex min-h-10 flex-1 items-center rounded-lg border px-3 text-sm font-semibold">
                {UPI_PAYMENT_DETAILS.upiId}
              </div>
              <Button type="button" variant="outline" size="icon" onClick={handleCopyUpiId}>
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="upiTransactionId">UPI Transaction ID</Label>
            <Input
              id="upiTransactionId"
              value={transactionId}
              onChange={(event) => onTransactionIdChange(event.target.value)}
              placeholder="Enter UPI reference / transaction ID"
              className="h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualUpiPayment;
