import type { Product } from "@/sanity.types";

export type SellingType = "fixed" | "loose";
export type WeightUnit = "gram" | "kilogram";

export type ProductWithSellingType = Product & {
  sellingType?: SellingType;
  pricePerKg?: number;
  weightIncrement?: number;
};

export const isLooseProduct = (
  product: ProductWithSellingType | null | undefined
) => product?.sellingType === "loose";

export const getWeightIncrement = (product: ProductWithSellingType) =>
  Math.max(1, Math.round(product.weightIncrement || 100));

export const getInitialWeightGrams = (
  product: ProductWithSellingType,
  unit: WeightUnit
) => (unit === "kilogram" ? 1000 : getWeightIncrement(product));

export const getWeightStepGrams = (
  product: ProductWithSellingType,
  unit: WeightUnit
) => (unit === "kilogram" ? 1000 : getWeightIncrement(product));

export const calculateLoosePrice = (
  pricePerKg: number | undefined,
  weightGrams: number
) => {
  const priceInPaise = Math.round((pricePerKg || 0) * weightGrams);
  return priceInPaise / 1000;
};

export const formatWeight = (weightGrams: number) => {
  if (weightGrams < 1000) return `${weightGrams}g`;

  const kg = weightGrams / 1000;
  return `${Number.isInteger(kg) ? kg : Number(kg.toFixed(2))}kg`;
};

export const getCartLineId = (
  productId: string,
  selectedWeightGrams?: number
) => selectedWeightGrams ? `${productId}:${selectedWeightGrams}g` : productId;
