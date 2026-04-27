export type ProductCategory = 'decoracion' | 'hogar' | 'juguetes' | 'personalizado' | 'industrial' | 'educacion';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  priceWholesale: number;
  minWholesaleQty: number;
  stock: number;
  category: ProductCategory;
  images: string[];
  weight: number;
  printTime: number;
  material: string;
  colors: string[];
  featured: boolean;
  rating: number;
  reviews: number;
  tags: string[];
}
