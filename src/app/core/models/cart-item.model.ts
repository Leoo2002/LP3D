import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  unitPrice: number;
  subtotal: number;
}
