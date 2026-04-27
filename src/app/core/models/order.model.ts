import { CartItem } from './cart-item.model';

export type OrderStatus = 'pendiente' | 'confirmado' | 'en_produccion' | 'enviado' | 'entregado';

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  status: OrderStatus;
  createdAt: Date;
}
