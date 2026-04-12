import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { PuestoServices } from '../../../core/services/puestos/puesto-services';
import { ParqueaderoService } from '../../../core/services/parqueaderos/parqueadero-service';

@Component({
  selector: 'app-puesto-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './puesto-component.html',
  styleUrl: './puesto-component.css',
})
export class PuestoComponent implements OnInit {

  formsPuestos!: ReturnType<FormBuilder['group']>
  puestos: any[] = []
  puestoSeleccionado: number | null = null

  mensajeExit = ''
  errorMensaje = ''

  mensajeExitParqueaderos = ''
  errorMensajeParqueaderos = ''

  constructor(
    private puestoService: PuestoServices,
    private fb: FormBuilder,
    private parqueaderoService: ParqueaderoService,
    private cdr: ChangeDetectorRef
  ) {
    this.formsPuestos = fb.nonNullable.group({
      nombrePuesto: ["", [Validators.required]],
      direccion: ["", [Validators.required]],
      totalParqueaderos: [null, [Validators.required, Validators.min(1)]]
    })
  }

  ngOnInit(): void {
    this.cargarPuestos()
  }

  cargarPuestos(page: number = 0, size: number = 50) {
    this.puestoService.listarPuestos(page, size).subscribe({
      next: (res) => {
        this.puestos = res.content
        this.cdr.detectChanges()
      },
      error: () => {
        this.mostrarMensajeError('Error al cargar la lista de puestos', 'errorMensaje')
        this.limpiarMensajeDespuesDeTiempo('errorMensaje')
      }
    })
  }

  registrarPuesto() {
    if (this.formsPuestos.invalid) {
      this.formsPuestos.markAllAsTouched()
      return
    }

    const datosPuesto = this.formsPuestos.value

    this.puestoService.registrarPuesto(datosPuesto).subscribe({
      next: (res) => {
        this.mostrarMensajeExito('Puesto registrado correctamente', 'mensajeExit')
        this.limpiarMensajesParqueaderos()

        this.puestoSeleccionado = res.id
        this.cargarPuestos()
        this.formsPuestos.reset()

        this.limpiarMensajeDespuesDeTiempo('mensajeExit')
      },
      error: (err) => {
        const mensajeError = this.extraerMensajeError(err)
        this.mostrarMensajeError(mensajeError, 'errorMensaje')
        this.limpiarMensajeDespuesDeTiempo('errorMensaje')
      }
    })
  }

  crearParqueaderos() {
    if (!this.puestoSeleccionado) {
      this.mostrarMensajeError('Debe seleccionar un puesto', 'errorMensajeParqueaderos')
      this.limpiarMensajeDespuesDeTiempo('errorMensajeParqueaderos')
      return
    }

    this.mostrarMensajeExito('Generando parqueaderos...', 'mensajeExitParqueaderos')

    this.parqueaderoService.registrarParqueadero(this.puestoSeleccionado)
      .subscribe({
        next: () => {
          this.mostrarMensajeExito('Parqueaderos generados correctamente', 'mensajeExitParqueaderos')
          this.errorMensajeParqueaderos = ''
          this.cargarPuestos()
          this.limpiarMensajeDespuesDeTiempo('mensajeExitParqueaderos')
        },
        error: (err) => {
          const mensajeError = this.extraerMensajeError(err)
          this.mostrarMensajeError(mensajeError, 'errorMensajeParqueaderos')
          this.mensajeExitParqueaderos = ''
          this.limpiarMensajeDespuesDeTiempo('errorMensajeParqueaderos')
        }
      })
  }

  // 🔥 MÉTODO CENTRALIZADO (LA CLAVE)
  private extraerMensajeError(err: any): string {

    // Backend ErrorResponse → { message, status }
    if (err.error?.message) {
      return err.error.message
    }

    // Validaciones → { campo: mensaje }
    if (typeof err.error === 'object') {
      return Object.values(err.error).join(', ')
    }

    // 401
    if (err.status === 401) {
      return 'Sesión expirada. Inicie sesión nuevamente.'
    }

    // 403
    if (err.status === 403) {
      return 'No tiene permisos para realizar esta acción.'
    }

    return err.message || 'Error inesperado'
  }

  private mostrarMensajeExito(mensaje: string, propiedad: 'mensajeExit' | 'mensajeExitParqueaderos') {
    this[propiedad] = mensaje

    if (propiedad === 'mensajeExit') {
      this.errorMensaje = ''
    } else {
      this.errorMensajeParqueaderos = ''
    }

    this.cdr.detectChanges()
  }

  private mostrarMensajeError(mensaje: string, propiedad: 'errorMensaje' | 'errorMensajeParqueaderos') {
    this[propiedad] = mensaje

    if (propiedad === 'errorMensaje') {
      this.mensajeExit = ''
    } else {
      this.mensajeExitParqueaderos = ''
    }

    this.cdr.detectChanges()
  }

  private limpiarMensajeDespuesDeTiempo(
    propiedad: 'mensajeExit' | 'errorMensaje' | 'mensajeExitParqueaderos' | 'errorMensajeParqueaderos',
    tiempo: number = 3000
  ) {
    setTimeout(() => {
      this[propiedad] = ''
      this.cdr.detectChanges()
    }, tiempo)
  }

  private limpiarMensajesParqueaderos() {
    this.mensajeExitParqueaderos = ''
    this.errorMensajeParqueaderos = ''
    this.cdr.detectChanges()
  }

  puestoYaTieneParqueaderos(puestoId: number): boolean {
    const puesto = this.puestos.find(p => p.id === puestoId)
    return puesto && (puesto.totalParqueaderos > 0 ||
      (puesto.parqueaderos && puesto.parqueaderos.length > 0))
  }

  obtenerNombrePuesto(puestoId: number): string {
    const puesto = this.puestos.find(p => p.id === puestoId)
    return puesto ? puesto.nombrePuesto : ''
  }
}