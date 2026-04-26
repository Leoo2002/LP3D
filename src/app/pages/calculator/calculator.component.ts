import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Pieza {
  nombre: string;
  horasImpresion: number;
  minutosImpresion: number;
  gramosFilamento: number;
  materialesExtras: number;
}

interface ResultadoPieza {
  pieza: Pieza;
  costoBase: number;
  costoConMargen: number;
  precioFinal: number;
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  loginPassword = signal('');
  loginError = signal(false);

  impresoras = [
    { nombre: 'FlashForge Adventurer 3 / 5M (200W)', consumoW: 200 },
    { nombre: 'Ender 3 (350W)', consumoW: 350 },
    { nombre: 'Prusa i3 MK3S (120W)', consumoW: 120 },
    { nombre: 'Bambu Lab X1 (400W)', consumoW: 400 },
    { nombre: 'Personalizada', consumoW: 0 },
  ];
  selectedImpresora = signal(0);

  precioKg = signal(25000);
  precioKwh = signal(340);

  tarifasKwh = [
    { nombre: 'Córdoba (EPEC) ($340)', valor: 340 },
    { nombre: 'Buenos Aires (EDESUR) ($290)', valor: 290 },
    { nombre: 'CABA ($310)', valor: 310 },
    { nombre: 'Mendoza ($280)', valor: 280 },
    { nombre: 'Rosario (EPE) ($320)', valor: 320 },
    { nombre: 'Personalizada', valor: 0 },
  ];
  selectedTarifa = signal(0);

  consumoW = signal(200);
  vidaUtilHs = signal(4320);
  costoRepuestos = signal(150000);
  margenError = signal(30);

  multiplicadores = [
    { nombre: 'Minorista (×4)', valor: 4 },
    { nombre: 'Mayorista (×2)', valor: 2 },
    { nombre: 'Revendedor (×3)', valor: 3 },
    { nombre: 'Costo + 50%', valor: 1.5 },
    { nombre: 'Personalizado', valor: 0 },
  ];
  selectedMultiplicador = signal(0);
  multiplicadorManual = signal(false);
  multiplicadorCustom = signal(4);

  costosFijosExpanded = signal(false);
  alquilerMensual = signal(0);
  arcaMensual = signal(0);
  ingresosBrutosMensual = signal(0);
  horasMensualesMaquina = signal(720);

  piezas = signal<Pieza[]>([{
    nombre: '',
    horasImpresion: 10,
    minutosImpresion: 0,
    gramosFilamento: 100,
    materialesExtras: 100
  }]);

  horasOptions = Array.from({ length: 49 }, (_, i) => i);
  minutosOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  presupuesto = signal<ResultadoPieza[]>([]);
  resultados = signal<ResultadoPieza[]>([]);
  calculado = signal(false);
  copiado = signal<number | null>(null);

  get multiplicadorActivo(): number {
    if (this.multiplicadorManual()) {
      return this.multiplicadorCustom();
    }
    const mult = this.multiplicadores[this.selectedMultiplicador()];
    return mult.valor > 0 ? mult.valor : this.multiplicadorCustom();
  }

  get consumoActual(): number {
    const imp = this.impresoras[this.selectedImpresora()];
    return imp.consumoW > 0 ? imp.consumoW : this.consumoW();
  }

  get costoFijoPorHora(): number {
    const totalMensual = this.alquilerMensual() + this.arcaMensual() + this.ingresosBrutosMensual();
    const horas = this.horasMensualesMaquina() || 1;
    return totalMensual / horas;
  }

  calcularPieza(pieza: Pieza): ResultadoPieza {
    const horasTotales = pieza.horasImpresion + pieza.minutosImpresion / 60;
    const costoFilamento = (pieza.gramosFilamento / 1000) * this.precioKg();
    const costoEnergia = (this.consumoActual / 1000) * horasTotales * this.precioKwh();
    const costoAmortizacion = (this.costoRepuestos() / this.vidaUtilHs()) * horasTotales;
    const costoFijos = this.costoFijoPorHora * horasTotales;
    const costoBase = costoFilamento + costoEnergia + costoAmortizacion + costoFijos + pieza.materialesExtras;
    const costoConMargen = costoBase * (1 + this.margenError() / 100);
    const precioFinal = costoConMargen * this.multiplicadorActivo;

    return {
      pieza,
      costoBase: Math.round(costoBase),
      costoConMargen: Math.round(costoConMargen),
      precioFinal: Math.round(precioFinal)
    };
  }

  calcular(): void {
    const resultados = this.piezas().map(p => this.calcularPieza(p));
    this.resultados.set(resultados);
    this.calculado.set(true);
  }

  agregarPieza(): void {
    this.piezas.update(ps => [...ps, {
      nombre: '',
      horasImpresion: 1,
      minutosImpresion: 0,
      gramosFilamento: 50,
      materialesExtras: 0
    }]);
    this.calculado.set(false);
  }

  eliminarPieza(index: number): void {
    this.piezas.update(ps => ps.filter((_, i) => i !== index));
    this.calculado.set(false);
  }

  limpiar(): void {
    this.piezas.set([{
      nombre: '',
      horasImpresion: 10,
      minutosImpresion: 0,
      gramosFilamento: 100,
      materialesExtras: 100
    }]);
    this.resultados.set([]);
    this.calculado.set(false);
  }

  copiarResultado(resultado: ResultadoPieza, index: number): void {
    const text = `LP3D - Cotización\n${resultado.pieza.nombre || 'Pieza'}\nCosto base: $${resultado.costoBase.toLocaleString('es-AR')}\nCosto c/margen: $${resultado.costoConMargen.toLocaleString('es-AR')}\nPrecio final: $${resultado.precioFinal.toLocaleString('es-AR')}`;
    navigator.clipboard.writeText(text).then(() => {
      this.copiado.set(index);
      setTimeout(() => this.copiado.set(null), 2000);
    }).catch(() => {});
  }

  agregarAlPresupuesto(resultado: ResultadoPieza): void {
    this.presupuesto.update(p => [...p, { ...resultado }]);
  }

  eliminarDelPresupuesto(index: number): void {
    this.presupuesto.update(p => p.filter((_, i) => i !== index));
  }

  get totalPresupuesto(): number {
    return this.presupuesto().reduce((sum, r) => sum + r.precioFinal, 0);
  }

  copiarPresupuesto(): void {
    const lines = [
      '🖨️ LP3D - Presupuesto Completo',
      '─────────────────────────────',
      '',
      ...this.presupuesto().map((r, i) =>
        `${i + 1}. ${r.pieza.nombre || 'Pieza'}: $${r.precioFinal.toLocaleString('es-AR')}`
      ),
      '',
      `TOTAL: $${this.totalPresupuesto.toLocaleString('es-AR')}`,
      '',
      '_Calculado con LP3D Calculadora_'
    ];
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  }

  onImpresoraChange(index: number): void {
    this.selectedImpresora.set(index);
    const imp = this.impresoras[index];
    if (imp.consumoW > 0) {
      this.consumoW.set(imp.consumoW);
    }
  }

  onTarifaChange(index: number): void {
    this.selectedTarifa.set(index);
    const tarifa = this.tarifasKwh[index];
    if (tarifa.valor > 0) {
      this.precioKwh.set(tarifa.valor);
    }
  }

  tryLogin(): void {
    const ok = this.authService.loginCalculator(this.loginPassword());
    if (!ok) {
      this.loginError.set(true);
      setTimeout(() => this.loginError.set(false), 3000);
    }
  }

  cerrarSesion(): void {
    this.authService.logoutCalculator();
    this.router.navigate(['/']);
  }

  updatePieza(index: number, field: keyof Pieza, value: string | number): void {
    this.piezas.update(ps => {
      const updated = [...ps];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  toggleCostosFijos(): void {
    this.costosFijosExpanded.update(v => !v);
  }
}
