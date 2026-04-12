import { ChangeDetectorRef, Component } from '@angular/core';
import { VehiculoResponse } from '../../../dtos/vehiculo/vhiculo-dto';
import { VehiculoService } from '../../../core/services/vehiculos/vehiculo-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanillajeService } from '../../../core/services/planillaje/planillaje-service';
import { finalize } from 'rxjs';
import { TestTools } from 'rxjs/internal/util/Immediate';

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
  placaPlanillaje=''
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

}
