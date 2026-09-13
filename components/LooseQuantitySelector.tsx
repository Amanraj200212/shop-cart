"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatWeight,
  getInitialWeightGrams,
  getWeightStepGrams,
  ProductWithSellingType,
  WeightUnit,
} from "@/lib/loose-products";
import { cn } from "@/lib/utils";

interface LooseQuantitySelectorProps {
  product: ProductWithSellingType;
  unit: WeightUnit;
  weightGrams: number;
  onUnitChange: (unit: WeightUnit) => void;
  onWeightChange: (weightGrams: number) => void;
  className?: string;
  compact?: boolean;
}

const LooseQuantitySelector = ({
  product,
  unit,
  weightGrams,
  onUnitChange,
  onWeightChange,
  className,
  compact = false,
}: LooseQuantitySelectorProps) => {
  const stepGrams = getWeightStepGrams(product, unit);
  const minWeightGrams = getInitialWeightGrams(product, unit);

  const handleUnitChange = (nextUnit: WeightUnit) => {
    onUnitChange(nextUnit);
    onWeightChange(getInitialWeightGrams(product, nextUnit));
  };

  const handleDecrease = () => {
    onWeightChange(Math.max(minWeightGrams, weightGrams - stepGrams));
  };

  const handleIncrease = () => {
    onWeightChange(weightGrams + stepGrams);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {!compact && (
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-medium text-darkColor">Unit</span>
          <div className="grid grid-cols-2 rounded-md border bg-white p-0.5">
            {(["gram", "kilogram"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleUnitChange(item)}
                className={cn(
                  "rounded-sm px-3 py-1 text-xs font-semibold capitalize transition",
                  unit === item
                    ? "bg-shop_dark_green text-white"
                    : "text-shop_dark_green hover:bg-shop_dark_green/10"
                )}
              >
                {item === "gram" ? "Gram" : "Kilogram"}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        {!compact && <span className="text-sm font-medium text-darkColor">Weight</span>}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={weightGrams <= minWeightGrams}
            className="shadow-xs hover:bg-shop_dark_green/20 hoverEffect"
            onClick={handleDecrease}
          >
            <Minus />
          </Button>
          <span className="min-w-16 text-center text-sm font-semibold text-darkColor">
            {formatWeight(weightGrams)}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shadow-xs hover:bg-shop_dark_green/20 hoverEffect"
            onClick={handleIncrease}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LooseQuantitySelector;
