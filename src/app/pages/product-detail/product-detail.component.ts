import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  loading = signal(true);
  notFound = signal(false);
  selectedColor = signal('');
  quantity = signal(1);
  addedToCart = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product.set(product);
          this.selectedColor.set(product.colors[0] ?? '');
        } else {
          this.notFound.set(true);
        }
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  changeQuantity(delta: number): void {
    const newQty = this.quantity() + delta;
    if (newQty >= 1) this.quantity.set(newQty);
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cartService.addItem(p, this.quantity(), this.selectedColor());
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2000);
  }

  get currentPrice(): number {
    const p = this.product();
    if (!p) return 0;
    return this.quantity() >= p.minWholesaleQty ? p.priceWholesale : p.price;
  }

  get isWholesalePrice(): boolean {
    const p = this.product();
    if (!p) return false;
    return this.quantity() >= p.minWholesaleQty;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  }

  renderStars(rating: number): string[] {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < full ? 'full' : 'empty');
    }
    return stars;
  }
}
