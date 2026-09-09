export type PaymentMethod = "stripe" | "upi_manual";

export const UPI_PAYMENT_DETAILS = {
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "your-upi-id@bank",
  qrImage: process.env.NEXT_PUBLIC_UPI_QR_IMAGE || "",
};
