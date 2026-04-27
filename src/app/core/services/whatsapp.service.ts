import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  sendOrder(items: CartItem[], total: number, notes?: string): void {
    const message = this.buildOrderMessage(items, total, notes);
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${environment.whatsappPhone}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  private buildOrderMessage(items: CartItem[], total: number, notes?: string): string {
    const lines: string[] = [
      '🖨️ *Nuevo Pedido - LP3D*',
      '─────────────────────',
      ''
    ];

    items.forEach(item => {
      lines.push(`• *${item.product.name}*`);
      lines.push(`  Color: ${item.selectedColor || 'A definir'}`);
      lines.push(`  Cantidad: ${item.quantity}`);
      lines.push(`  Precio unit.: $${item.unitPrice.toLocaleString('es-AR')}`);
      lines.push(`  Subtotal: $${item.subtotal.toLocaleString('es-AR')}`);
      lines.push('');
    });

    lines.push('─────────────────────');
    lines.push(`💰 *TOTAL: $${total.toLocaleString('es-AR')}*`);

    if (notes) {
      lines.push('');
      lines.push(`📝 Notas: ${notes}`);
    }

    lines.push('');
    lines.push('_Enviado desde LP3D Web_');

    return lines.join('\n');
  }
}
