import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PageResponse } from '../../../dtos/planillaje/planillaje-paginados-dto';
import { ParqueaderoResponse } from '../../../dtos/parqueaderos-dto/parqueadero-response';
import { VehiculoService } from '../../../core/services/vehiculos/vehiculo-service';
import { ParqueaderoService } from '../../../core/services/parqueaderos/parqueadero-service';

@Component({
  selector: 'app-vehiculo-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculo-component.html',
  styleUrl: './vehiculo-component.css',
})
export class VehiculoComponent implements OnInit {
  // Formulario reactivo para registrar vehículos
  formVehiculo: FormGroup;

  // Control de mensajes de éxito y error en la UI
  successMessage = false;
  errorMessage = '';

  // Paginación de parqueaderos
  totalPaginas = 0;
  pagina = 0;

  // Subject para manejar la reactividad de la página de parqueaderos
  private refresh$ = new BehaviorSubject<number>(0);

  // Observable que emite la lista de parqueaderos según la página actual
  parqueaderos$!: Observable<PageResponse<ParqueaderoResponse>>;

  constructor(
    private vs: VehiculoService,           // Servicio para manejar vehículos
    private fb: FormBuilder,               // FormBuilder para crear formularios reactivos
    private ps: ParqueaderoService,        // Servicio para manejar parqueaderos
    private cdr: ChangeDetectorRef         // Forzar actualización de la vista cuando Angular no detecta cambios
  ) {
    // Inicializar el formulario con validaciones
    this.formVehiculo = this.fb.group({
      placa: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      marca: ["", [Validators.required]],
      parqueaderoId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Configurar el observable de parqueaderos
    // Cada vez que refresh$ emite, se llama al servicio para obtener los parqueaderos de esa página
    this.parqueaderos$ = this.refresh$.pipe(
      switchMap(pagi => this.ps.obtenerParqueaderos(pagi, 4)), // 4 parqueaderos por página
      tap(res => {
        this.totalPaginas = res.totalPages; // actualizar total de páginas
        this.pagina = res.number;           // actualizar página actual
      })
    );
  }

  // Avanza a la siguiente página de parqueaderos
  siguiente() {
    if (this.pagina < this.totalPaginas - 1) {
      this.refresh$.next(this.pagina + 1); // emitir nueva página
    }
  }

  // Retrocede a la página anterior de parqueaderos
  anterior() {
    if (this.pagina > 0) {
      this.refresh$.next(this.pagina - 1); // emitir página anterior
    }
  }

  normalizarPlaca() {
    const control = this.formVehiculo.get('placa');
    const placa = control?.value || '';
    control?.setValue(placa.toUpperCase().slice(0, 6), { emitEvent: false });
  }

  // Función para enviar el formulario y registrar un vehículo
  agregarCarro() {
    // Limpiar mensajes previos
    this.errorMessage = '';
    this.successMessage = false;

    // Validar formulario antes de enviar
    if (this.formVehiculo.invalid) {
      this.errorMessage = this.obtenerMensajeFormulario();
      this.formVehiculo.markAllAsTouched(); // marcar todos los campos como tocados para mostrar errores
      this.cdr.detectChanges();             // forzar actualización de la UI
      return;
    }

    // Llamar al servicio para registrar el vehículo
    this.vs.registrarVehiculo(this.formVehiculo.value).subscribe({
      next: () => {
        // Si el registro es exitoso
        this.successMessage = true;      // mostrar mensaje de éxito
        this.errorMessage = '';          // limpiar mensaje de error
        this.formVehiculo.reset();       // resetear el formulario
        this.refresh$.next(this.pagina); // refrescar lista de parqueaderos

        // Ocultar mensaje de éxito después de 1.5 segundos
        setTimeout(() => {
          this.successMessage = false;
          this.cdr.detectChanges();     // actualizar la UI
        }, 1500);
      },
      error: (e) => {
        // Si ocurre un error al registrar
        console.error("Error al registrar", e);

        let mensaje = 'Error del servidor. Intente más tarde.';

        // Manejo de errores de validación (status 400)
        if (e.status === 400 && e.error) {
          if (e.error.placa) mensaje = e.error.placa;                     // error en placa
          else if (e.error.marca) mensaje = e.error.marca;                // error en marca
          else if (e.error.parqueaderoId) mensaje = 'Debe seleccionar un parqueadero'; // error en parqueadero
          else if (e.error.message) mensaje = e.error.message;            // mensaje genérico
          else if (typeof e.error === 'string') mensaje = e.error;        // si viene como string
          else mensaje = 'Datos inválidos';
        }

        this.errorMessage = mensaje; // actualizar mensaje de error en la UI
        this.successMessage = false; // asegurar que no se muestre mensaje de éxito
        this.cdr.detectChanges();    // forzar actualización de la UI
      }
    });
  }

  obtenerMensajePlaca() {
    const placa = this.formVehiculo.get('placa');

    if (placa?.errors?.['required']) return 'La placa es requerida.';
    if (placa?.errors?.['minlength'] || placa?.errors?.['maxlength']) {
      return 'La placa debe tener exactamente 6 caracteres.';
    }

    return '';
  }

  private obtenerMensajeFormulario() {
    if (this.formVehiculo.get('placa')?.invalid) return this.obtenerMensajePlaca();
    if (this.formVehiculo.get('marca')?.invalid) return 'La marca es requerida.';
    if (this.formVehiculo.get('parqueaderoId')?.invalid) return 'Debe seleccionar un parqueadero.';
    return 'Complete todos los campos obligatorios.';
  }
}
