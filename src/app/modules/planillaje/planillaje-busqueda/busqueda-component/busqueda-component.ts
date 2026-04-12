import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PlanillajeService } from '../../../../core/services/planillaje/planillaje-service';

@Component({
  selector: 'app-busqueda-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busqueda-component.html',
  styleUrl: './busqueda-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush  // 🔥 Optimización crítica
})
export class BusquedaComponent {

  page = 0;
  size = 5;
  totalPages = 0;

  loading = false;
  mensaje = '';

  planillajes: any[] = [];

  placaActual: string = '';

  constructor(
    private ps: PlanillajeService,
    private cdr: ChangeDetectorRef   // 🔥 Para notificar cambios
  ) {}

  // 🔍 BOTÓN BUSCAR
  buscar() {
    if (!this.placaActual || this.placaActual.trim().length < 3) {
      this.planillajes = [];
      this.mensaje = 'Ingresa una placa válida';
      this.cdr.markForCheck(); // Notificar cambios
      return;
    }

    this.page = 0;
    this.consultar();
  }

  // 🔥 MÉTODO CENTRAL
  consultar() {
    this.loading = true;
    this.mensaje = '';
    this.planillajes = []; // Limpiar mientras carga (opcional, mejora UX)
    this.cdr.markForCheck();

    this.ps.obtenerPlanillaje(this.placaActual.toUpperCase(), this.page, this.size)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck(); // 🔥 Siempre notificar al finalizar
        })
      )
      .subscribe({
        next: res => {
          // 🔥 Asignar directamente sin transformaciones pesadas
          this.planillajes = res.content;
          this.totalPages = res.totalPages;

          if (res.content.length === 0) {
            this.mensaje = 'No se encontraron resultados';
          }

          this.cdr.markForCheck(); // 🔥 Notificar cambios
        },
        error: () => {
          this.planillajes = [];
          this.mensaje = 'Error al consultar';
          this.cdr.markForCheck();
        }
      });
  }

  // ➡️ PAGINACIÓN
  siguiente() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.consultar();
    }
  }

  anterior() {
    if (this.page > 0) {
      this.page--;
      this.consultar();
    }
  }

  // 🔥 trackBy más robusto: usa id si existe, si no, usa el índice
  trackById(index: number, item: any) {
    return item.id ?? index;
  }
}