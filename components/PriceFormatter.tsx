import { cn } from "@/lib/utils";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({amount, className}: Props) => {
  const formattedPrice = new Number(amount ?? 0).toLocaleString("en-IN", {
    currency: "INR",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return (
    <span
      className={cn("text-sm font-semibold text-darkColor", className)}
    >
      {formattedPrice}
    </span>
  )
}

export default PriceFormatter
