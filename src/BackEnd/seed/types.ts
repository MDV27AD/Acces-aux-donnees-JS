export interface Distributor {
  name: string;
  categories: string[];
}

export interface Product {
  supplier: string;
  category: string;
  sku: string;
  serialNumber: number;
  name: string;
  description: string;
  price: number;
}

export type Category = string;

export type Supplier = string;
