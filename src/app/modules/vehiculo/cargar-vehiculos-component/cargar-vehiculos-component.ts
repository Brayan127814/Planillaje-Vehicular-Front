import { ChangeDetectorRef, Component } from '@angular/core';
import { VehiculoResponse } from '../../../dtos/vehiculo/vhiculo-dto';
import { VehiculoService } from '../../../core/services/vehiculos/vehiculo-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanillajeService } from '../../../core/services/planillaje/planillaje-service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { PlanillajeResponse } from '../../../dtos/planillaje/PlanillajeResponse';

@Component({
  selector: 'app-cargar-vehiculos-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cargar-vehiculos-component.html',
  styleUrl: './cargar-vehiculos-component.css',
})
export class CargarVehiculosComponent {

  vehiculos: VehiculoResponse[] = []
  planillajes: any[] = []
  mensaje = ""
  erro = ''
  loading = false
  page = 0
  size = 4
  totalPages = 0
  placa = ''
  placaPlanillaje = ''
  fechaFiltro = ''
  constructor(private vs: VehiculoService, private cdr: ChangeDetectorRef, private ps: PlanillajeService) { }

  //Cargar todos los vehiculos

  cargar() {
    this.vs.listarVehiculos(this.page, this.size).subscribe(res => {
      this.vehiculos = res.content
      this.totalPages = res.totalPages
      this.cdr.markForCheck()
    })
  }

  buscarVehiculo() {
    this.page = 0

    if (!this.placa) {
      this.cargar()
      return
    }

    this.loading = true
    this.erro = ''

    this.vs.listarVehiculoPlaca(this.placa.toUpperCase()).subscribe({
      next: res => {
        this.vehiculos = [res]
        this.cdr.markForCheck()
      },
      error: () => {
        this.vehiculos = []
        this.erro = 'Vehículo no encontrado'
        this.cdr.markForCheck()
      },
      complete: () => {
        this.loading = false
        this.cdr.markForCheck()
      }
    })
  }

  //OBTENER EL PLANILLAJE DE ESE VEHICULO
  consultarPlanillaje() {
    this.loading = true
    this.mensaje = ''
    this.planillajes = []
    this.cdr.markForCheck()

    this.ps.obtenerPlanillaje(this.placaPlanillaje.toUpperCase(), this.page, this.size)
      .pipe(

        finalize(() => {
          this.loading = false
          this.cdr.markForCheck()

        })

      ).subscribe({
        next: res => {
          console.log("RESPUESTA BACK:", res);
          this.planillajes = res.content
          this.totalPages = res.totalPages
          console.log(this.planillajes)
          if (res.content.length == 0) {
            this.mensaje = "No se encontraron resultados"
          }

          Swal.fire({
            title: 'Consulta de planillaje',
            text: this.mensaje || `Se encontraron ${res.content.length} planillajes para la placa ${this.placaPlanillaje.toUpperCase()}.`,
            icon: res.content.length > 0 ? 'success' : 'info',
            confirmButtonText: 'Aceptar'
          })

          this.cdr.markForCheck()
        }, error: () => {
          this.planillajes = []
          this.mensaje = "Error al consultar"
          this.cdr.markForCheck()
        }
      }
      )






  }


  //agregar paginacion al resultado de los planillajes
  siguiente() {

    if (this.page < this.totalPages - 1) {
      this.page++
      this.consultarPlanillaje()
    }



  }

  anterior() {
    if (this.page > 0) {
      {
        this.page--
        this.consultarPlanillaje()
      }
    }
  }

  trackById(index: number, item: any) {
    return item.id ?? index
  }

  formatearHora(valor: string): string {
    if (!valor) return 'Sin hora'

    const fecha = new Date(valor)
    if (!Number.isNaN(fecha.getTime())) {
      return new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(fecha)
    }

    const partesHora = valor.split(':')
    if (partesHora.length >= 2) {
      const horas = Number(partesHora[0])
      const minutos = partesHora[1]

      if (!Number.isNaN(horas)) {
        const periodo = horas >= 12 ? 'p. m.' : 'a. m.'
        const hora12 = horas % 12 || 12
        return `${hora12}:${minutos} ${periodo}`
      }
    }

    return valor
  }

  // Normaliza la foto que llega del backend.
  // Si ya viene como data URL, se usa igual; si viene Base64 puro, se le agrega el prefijo.
  obtenerSrcFoto(foto: string): string {
    if (!foto) return ''

    const fotoLimpia = foto.trim()

    if (fotoLimpia.startsWith('data:image')) {
      return fotoLimpia
    }

    return `data:image/jpeg;base64,${fotoLimpia}`
  }

  // Filtra solo los planillajes que ya están cargados en la tabla.
  // Como el backend responde "2026-04-28T22:45:14.2534914",
  // tomamos los primeros 10 caracteres para comparar solo "YYYY-MM-DD".
  filtrarPlanillajesPorFecha(): PlanillajeResponse[] {
    if (!this.fechaFiltro) {
      return this.planillajes
    }

    return this.planillajes.filter(p => {
      if (!p.horaInicio) return false

      const fechaPlanillaje = p.horaInicio.slice(0, 10)
      return fechaPlanillaje === this.fechaFiltro
    })
  }
}
