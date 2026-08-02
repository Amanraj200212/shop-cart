// for handle categories of product for product card component [to handle deal products and normal products]

import type { Product } from '@/sanity.types';

export type ProductCardProduct = Omit<Product, 'categories'> & {
  categories?: Array<string | { title?: string; name?: string } | null> | null;
};
