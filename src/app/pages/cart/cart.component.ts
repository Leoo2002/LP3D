import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { WhatsappService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);
  private whatsappService = inject(WhatsappService);

  notes = signal('');
  showClearConfirm = signal(false);

  updateQuantity(productId: string, color: string, quantity: number): void {
    this.cartService.updateQuantity(productId, color, quantity);
  }

  removeItem(productId: string, color: string): void {
    this.cartService.removeItem(productId, color);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.showClearConfirm.set(false);
  }

  sendOrder(): void {
    this.whatsappService.sendOrder(
      this.cartService.items(),
      this.cartService.totalPrice(),
      this.notes()
    );
  }

  hasWholesaleItems(): boolean {
    return this.cartService.items().some(
      i => i.quantity >= i.product.minWholesaleQty
    );
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  }
}
