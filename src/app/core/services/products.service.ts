import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, ProductCategory } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(() => of(this.getMockProducts()))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(() => of(this.getMockProducts().find(p => p.id === id)))
    );
  }

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?category=${category}`).pipe(
      catchError(() => of(this.getMockProducts().filter(p => p.category === category)))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/featured`).pipe(
      catchError(() => of(this.getMockProducts().filter(p => p.featured)))
    );
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Macetero Geométrico',
        description: 'Macetero impreso en 3D con diseño geométrico moderno. Perfecto para cactus y suculentas. Material resistente al agua.',
        shortDescription: 'Macetero moderno de diseño geométrico',
        price: 3500,
        priceWholesale: 2800,
        minWholesaleQty: 5,
        stock: 15,
        category: 'hogar',
        images: ['https://placehold.co/600x400/e53935/ffffff?text=Macetero+3D'],
        weight: 120,
        printTime: 4,
        material: 'PLA',
        colors: ['Rojo', 'Blanco', 'Negro', 'Verde'],
        featured: true,
        rating: 4.8,
        reviews: 24,
        tags: ['hogar', 'plantas', 'decoracion']
      },
      {
        id: '2',
        name: 'Llavero Personalizado',
        description: 'Llavero 100% personalizable con tu nombre, iniciales o diseño favorito. Resistente y liviano.',
        shortDescription: 'Llavero a medida con tu diseño',
        price: 800,
        priceWholesale: 550,
        minWholesaleQty: 10,
        stock: 50,
        category: 'personalizado',
        images: ['https://placehold.co/600x400/e53935/ffffff?text=Llavero+3D'],
        weight: 15,
        printTime: 0.5,
        material: 'PLA',
        colors: ['Rojo', 'Azul', 'Negro', 'Dorado', 'Plateado'],
        featured: true,
        rating: 4.9,
        reviews: 89,
        tags: ['regalo', 'personalizado', 'llavero']
      },
      {
        id: '3',
        name: 'Figura Articulada Dragon',
        description: 'Dragón articulado impreso en 3D, completamente flexible. Todas las articulaciones impresas en una sola pieza.',
        shortDescription: 'Dragón articulado flex-print',
        price: 5500,
        priceWholesale: 4200,
        minWholesaleQty: 3,
        stock: 8,
        category: 'juguetes',
        images: ['https://placehold.co/600x400/e53935/ffffff?text=Dragon+3D'],
        weight: 250,
        printTime: 12,
        material: 'PLA',
        colors: ['Rojo', 'Dorado', 'Verde', 'Morado'],
        featured: true,
        rating: 5.0,
        reviews: 17,
        tags: ['juguete', 'dragon', 'articulado', 'regalo']
      },
      {
        id: '4',
        name: 'Organizador de Escritorio',
        description: 'Organizador modular para escritorio. Incluye portabolígrafos, bandeja para clips y espacio para celular.',
        shortDescription: 'Organizador modular para escritorio',
        price: 4200,
        priceWholesale: 3300,
        minWholesaleQty: 4,
        stock: 12,
        category: 'hogar',
        images: ['https://placehold.co/600x400/e53935/ffffff?text=Organizador+3D'],
        weight: 180,
        printTime: 7,
        material: 'PETG',
        colors: ['Negro', 'Blanco', 'Gris'],
        featured: false,
        rating: 4.6,
        reviews: 31,
        tags: ['escritorio', 'organizador', 'oficina']
      },
      {
        id: '5',
        name: 'Soporte para Celular',
        description: 'Soporte ajustable para celular, compatible con todos los tamaños. Base antideslizante incluida.',
        shortDescription: 'Soporte ajustable para smartphones',
        price: 1800,
        priceWholesale: 1300,
        minWholesaleQty: 6,
        stock: 25,
        category: 'hogar',
        images: ['https://placehold.co/600x400/e53935/ffffff?text=Soporte+Celular'],
        weight: 80,
        printTime: 2.5,
        material: 'PETG',
        colors: ['Negro', 'Blanco', 'Rojo'],
        featured: false,
        rating: 4.7,
        reviews: 45,
        tags: ['celular', 'soporte', 'escritorio']
      },
      {
        id: '6',
        name: 'Figura Mandalorian',
        description: 'Figura coleccionable del Mandalorian con detalle de alta resolución. 15cm de altura.',
        shortDescription: 'Figura coleccionable 15cm',
        price: 7500,
        priceWholesale: 6000,
        minWholesaleQty: 2,
        stock: 5,
        category: 'decoracion',
        images: ['https://placehold.co/600x400/e53935/ffffff?text=Mandalorian+3D'],
        weight: 350,
        printTime: 18,
        material: 'PLA',
        colors: ['Plateado', 'Dorado', 'Negro'],
        featured: true,
        rating: 4.9,
        reviews: 12,
        tags: ['figura', 'mandalorian', 'coleccionable', 'starwars']
      },
      {
        id: '7',
        name: 'Cubo Anti-Estrés',
        description: 'Cubo fidget con múltiples funciones: botones, ruedas, joystick. Ideal para concentrarse.',
        shortDescription: 'Cubo fidget anti-estrés',
        price: 2200,
        priceWholesale: 1700,
        minWholesaleQty: 5,
        stock: 20,
        category: 'juguetes',
        images: ['https://placehold.co/600x400/e53935/ffffff?text=Cubo+AntiEstrés'],
        weight: 60,
        printTime: 3,
        material: 'PLA',
        colors: ['Rojo', 'Azul', 'Negro', 'Verde'],
        featured: false,
        rating: 4.4,
        reviews: 28,
        tags: ['fidget', 'antiestrés', 'juguete']
      },
      {
        id: '8',
        name: 'Engranajes Educativos',
        description: 'Set de engranajes de distintos tamaños para enseñar mecánica a niños. Coloridos e interconectables.',
        shortDescription: 'Set educativo de engranajes',
        price: 3800,
        priceWholesale: 3000,
        minWholesaleQty: 3,
        stock: 10,
        category: 'educacion',
        images: ['https://placehold.co/600x400/e53935/ffffff?text=Engranajes+Edu'],
        weight: 200,
        printTime: 8,
        material: 'PLA',
        colors: ['Multicolor'],
        featured: false,
        rating: 4.8,
        reviews: 19,
        tags: ['educacion', 'engranajes', 'niños', 'stem']
      }
    ];
  }
}
