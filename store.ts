import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity.types";
import {
  calculateLoosePrice,
  getCartLineId,
  isLooseProduct,
  ProductWithSellingType,
} from "./lib/loose-products";

export interface CartItem {
  product: ProductWithSellingType;
  quantity: number;
  selectedWeightGrams?: number;
  linePrice?: number;
  pricePerKg?: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: ProductWithSellingType, selectedWeightGrams?: number) => void;
  removeItem: (productId: string, selectedWeightGrams?: number) => void;
  deleteCartProduct: (productId: string, selectedWeightGrams?: number) => void;
  updateLooseItemWeight: (
    productId: string,
    currentWeightGrams: number,
    nextWeightGrams: number
  ) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getItemCount: (productId: string, selectedWeightGrams?: number) => number;
  getGroupedItems: () => CartItem[];
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      addItem: (product, selectedWeightGrams) =>
        set((state) => {
          const isLoose = isLooseProduct(product);
          const lineId = getCartLineId(
            product._id,
            isLoose ? selectedWeightGrams : undefined
          );
          const existingItem = state.items.find(
            (item) =>
              getCartLineId(item.product._id, item.selectedWeightGrams) === lineId
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                getCartLineId(item.product._id, item.selectedWeightGrams) === lineId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            const linePrice =
              isLoose && selectedWeightGrams
                ? calculateLoosePrice(product.pricePerKg, selectedWeightGrams)
                : undefined;

            return {
              items: [
                ...state.items,
                {
                  product,
                  quantity: 1,
                  selectedWeightGrams: isLoose ? selectedWeightGrams : undefined,
                  linePrice,
                  pricePerKg: isLoose ? product.pricePerKg : undefined,
                },
              ],
            };
          }
        }),
      removeItem: (productId, selectedWeightGrams) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            const isTarget =
              getCartLineId(item.product._id, item.selectedWeightGrams) ===
              getCartLineId(productId, selectedWeightGrams);

            if (isTarget) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),
      deleteCartProduct: (productId, selectedWeightGrams) =>
        set((state) => ({
          items: state.items.filter((item) =>
            getCartLineId(item.product._id, item.selectedWeightGrams) !==
            getCartLineId(productId, selectedWeightGrams)
          ),
        })),
      updateLooseItemWeight: (productId, currentWeightGrams, nextWeightGrams) =>
        set((state) => {
          const currentLineId = getCartLineId(productId, currentWeightGrams);
          const nextLineId = getCartLineId(productId, nextWeightGrams);
          const currentItem = state.items.find(
            (item) =>
              getCartLineId(item.product._id, item.selectedWeightGrams) ===
              currentLineId
          );
          const existingNextItem = state.items.find(
            (item) =>
              getCartLineId(item.product._id, item.selectedWeightGrams) ===
              nextLineId
          );

          if (!currentItem) return state;

          if (existingNextItem) {
            return {
              items: state.items
                .filter(
                  (item) =>
                    getCartLineId(item.product._id, item.selectedWeightGrams) !==
                    currentLineId
                )
                .map((item) =>
                  getCartLineId(item.product._id, item.selectedWeightGrams) === nextLineId
                    ? { ...item, quantity: item.quantity + currentItem.quantity }
                    : item
                ),
            };
          }

          return {
            items: state.items.map((item) =>
              getCartLineId(item.product._id, item.selectedWeightGrams) ===
              currentLineId
                ? {
                    ...item,
                    selectedWeightGrams: nextWeightGrams,
                    linePrice: calculateLoosePrice(item.product.pricePerKg, nextWeightGrams),
                    pricePerKg: item.product.pricePerKg,
                  }
                : item
            ),
          };
        }),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) =>
            total + (item.linePrice ?? item.product.price ?? 0) * item.quantity,
          0
        );
      },
      getItemCount: (productId, selectedWeightGrams) => {
        const item = get().items.find(
          (item) =>
            getCartLineId(item.product._id, item.selectedWeightGrams) ===
            getCartLineId(productId, selectedWeightGrams)
        );
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item._id === product._id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                    (item) => item._id !== product._id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item?._id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "cart-store",
    }
  )
);

export default useStore;
