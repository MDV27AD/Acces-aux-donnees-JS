export interface Distributor {
  name: string;
  categories: Category[];
  mongoUrl: string;
}

export interface Product {
  supplier: Supplier;
  category: Category;
  sku: string;
  serialNumber: number;
  name: string;
  description: string;
  price: number;
}

export type Category = string;

export type Supplier = string;
