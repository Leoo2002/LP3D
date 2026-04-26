import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private readonly CALCULATOR_PASSWORD = 'lp3d2024';
  private readonly SESSION_KEY = 'lp3d_calc_auth';

  isCalculatorAuthenticated = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (stored === 'true') {
        this.isCalculatorAuthenticated.set(true);
      }
    }
  }

  loginCalculator(password: string): boolean {
    const isValid = password === this.CALCULATOR_PASSWORD;
    if (isValid) {
      this.isCalculatorAuthenticated.set(true);
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem(this.SESSION_KEY, 'true');
      }
    }
    return isValid;
  }

  logoutCalculator(): void {
    this.isCalculatorAuthenticated.set(false);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }
}
