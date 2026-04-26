import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'lp3d_cart';

  items = signal<CartItem[]>([]);

  totalItems = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));

  totalPrice = computed(() => this.items().reduce((sum, i) => sum + i.subtotal, 0));

  uniqueItemsCount = computed(() => this.items().length);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
      }
    });
  }

  addItem(product: Product, quantity: number = 1, selectedColor: string = ''): void {
    const currentItems = this.items();
    const existingIndex = currentItems.findIndex(
      i => i.product.id === product.id && i.selectedColor === selectedColor
    );
    const unitPrice = quantity >= product.minWholesaleQty ? product.priceWholesale : product.price;

    if (existingIndex >= 0) {
      const updated = [...currentItems];
      const newQty = updated[existingIndex].quantity + quantity;
      const newUnitPrice = newQty >= product.minWholesaleQty ? product.priceWholesale : product.price;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        unitPrice: newUnitPrice,
        subtotal: newQty * newUnitPrice
      };
      this.items.set(updated);
    } else {
      this.items.set([...currentItems, {
        product,
        quantity,
        selectedColor,
        unitPrice,
        subtotal: quantity * unitPrice
      }]);
    }
  }

  updateQuantity(productId: string, selectedColor: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId, selectedColor);
      return;
    }
    const updated = this.items().map(item => {
      if (item.product.id === productId && item.selectedColor === selectedColor) {
        const unitPrice = quantity >= item.product.minWholesaleQty
          ? item.product.priceWholesale
          : item.product.price;
        return { ...item, quantity, unitPrice, subtotal: quantity * unitPrice };
      }
      return item;
    });
    this.items.set(updated);
  }

  removeItem(productId: string, selectedColor: string): void {
    this.items.set(this.items().filter(
      i => !(i.product.id === productId && i.selectedColor === selectedColor)
    ));
  }

  clearCart(): void {
    this.items.set([]);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.items.set(JSON.parse(stored));
      }
    } catch {
      this.items.set([]);
    }
  }
}
