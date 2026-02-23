export type ProductStatus = 'Active' | 'Draft' | 'Archived';

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string; // e.g., "Small / Blue"
  optionValues: { optionId: string; value: string }[];
  price: number;
  inventory: number;
  sku: string;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  status: ProductStatus;
  inventory: number;
  type: string;
  vendor: string;
  price: number;
  image?: string;
  category?: string;
  options?: ProductOption[];
  variants?: ProductVariant[];
}

export interface ProductFilter {
  status?: ProductStatus[];
  type?: string[];
  vendor?: string[];
}
