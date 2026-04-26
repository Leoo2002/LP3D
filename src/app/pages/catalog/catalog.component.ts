import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Product, ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  allProducts = signal<Product[]>([]);
  loading = signal(true);
  selectedCategory = signal<string>('todas');
  searchQuery = signal('');
  sortBy = signal<string>('relevancia');
  addedProductId = signal<string | null>(null);

  categories = [
    { id: 'todas', name: 'Todas' },
    { id: 'hogar', name: 'Hogar' },
    { id: 'decoracion', name: 'Decoración' },
    { id: 'juguetes', name: 'Juguetes' },
    { id: 'personalizado', name: 'Personalizado' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'educacion', name: 'Educación' },
  ];

  filteredProducts = computed(() => {
    let products = this.allProducts();

    if (this.selectedCategory() !== 'todas') {
      products = products.filter(p => p.category === this.selectedCategory());
    }

    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    switch (this.sortBy()) {
      case 'precio-asc': return [...products].sort((a, b) => a.price - b.price);
      case 'precio-desc': return [...products].sort((a, b) => b.price - a.price);
      case 'nombre': return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'rating': return [...products].sort((a, b) => b.rating - a.rating);
      default: return products;
    }
  });

  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.loading.set(false);
        this.route.queryParams.subscribe(params => {
          if (params['categoria']) {
            this.selectedCategory.set(params['categoria']);
          }
        });
      },
      error: () => this.loading.set(false)
    });
  }

  setCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product, 1, product.colors[0] ?? '');
    this.addedProductId.set(product.id);
    setTimeout(() => this.addedProductId.set(null), 1500);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  }
}
