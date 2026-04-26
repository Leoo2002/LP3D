import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'LP3D - Inicio'
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent),
    title: 'LP3D - Catálogo'
  },
  {
    path: 'producto/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'LP3D - Producto'
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    title: 'LP3D - Carrito'
  },
  {
    path: 'calculadora',
    loadComponent: () => import('./pages/calculator/calculator.component').then(m => m.CalculatorComponent),
    title: 'LP3D - Calculadora'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'LP3D - Página no encontrada'
  }
];
