export type PaymentMethod = "stripe" | "upi_manual" | "cash_on_delivery";

export const PAYMENT_METHOD_OPTIONS: Array<{
  value: PaymentMethod;
  title: string;
  description: string;
  disabled?: boolean;
}> = [
  {
    value: "stripe",
    title: "Card Payment",
    description: "Pay securely online with card.",
    disabled: true,
  },
  {
    value: "upi_manual",
    title: "UPI QR Payment",
    description: "Scan, pay, and enter your transaction ID.",
  },
  {
    value: "cash_on_delivery",
    title: "Cash on Delivery",
    description: "Pay in cash when your order is delivered.",
    disabled: true,
  },
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  stripe: "Stripe Card",
  upi_manual: "Manual UPI QR",
  cash_on_delivery: "Cash on Delivery",
};

export const getEnabledPaymentMethods = () =>
  PAYMENT_METHOD_OPTIONS.filter((option) => !option.disabled);

export const getDefaultPaymentMethod = () =>
  getEnabledPaymentMethods()[0]?.value || PAYMENT_METHOD_OPTIONS[0].value;

export const isPaymentMethodEnabled = (paymentMethod: PaymentMethod) =>
  PAYMENT_METHOD_OPTIONS.some(
    (option) => option.value === paymentMethod && !option.disabled
  );

export const getPaymentMethodLabel = (paymentMethod?: string) =>
  paymentMethod && paymentMethod in PAYMENT_METHOD_LABELS
    ? PAYMENT_METHOD_LABELS[paymentMethod as PaymentMethod]
    : "Unknown";

export const getPaymentSubmitLabel = (paymentMethod: PaymentMethod) => {
  if (paymentMethod === "upi_manual") return "Place UPI Order";
  if (paymentMethod === "cash_on_delivery") return "Place COD Order";
  return "Proceed to checkout";
};

export const UPI_PAYMENT_DETAILS = {
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "your-upi-id@bank",
  qrImage: process.env.NEXT_PUBLIC_UPI_QR_IMAGE || "",
};
