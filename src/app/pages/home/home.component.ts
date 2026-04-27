import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);

  featuredProducts = signal<Product[]>([]);
  loading = signal(true);
  addedProductId = signal<string | null>(null);

  categories = [
    { id: 'hogar', name: 'Hogar', icon: '🏠', description: 'Organización y decoración' },
    { id: 'decoracion', name: 'Decoración', icon: '🎨', description: 'Arte y figuras' },
    { id: 'juguetes', name: 'Juguetes', icon: '🎮', description: 'Para todas las edades' },
    { id: 'personalizado', name: 'Personalizado', icon: '✨', description: 'A tu medida' },
    { id: 'industrial', name: 'Industrial', icon: '⚙️', description: 'Piezas técnicas' },
    { id: 'educacion', name: 'Educación', icon: '📚', description: 'STEM y aprendizaje' },
  ];

  stats = [
    { value: '500+', label: 'Clientes satisfechos' },
    { value: '1000+', label: 'Piezas impresas' },
    { value: '15+', label: 'Materiales disponibles' },
    { value: '24hs', label: 'Tiempo de respuesta' },
  ];

  ngOnInit(): void {
    this.productsService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Product): void {
    const color = product.colors[0] ?? '';
    this.cartService.addItem(product, 1, color);
    this.addedProductId.set(product.id);
    setTimeout(() => this.addedProductId.set(null), 1500);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  }

  renderStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  }
}
