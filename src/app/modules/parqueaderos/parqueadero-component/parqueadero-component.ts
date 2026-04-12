import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { PageResponse } from '../../../dtos/planillaje/planillaje-paginados-dto';
import { ParqueaderoResponse } from '../../../dtos/parqueaderos-dto/parqueadero-response';
import { ParqueaderoService } from '../../../core/services/parqueaderos/parqueadero-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-parqueadero-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parqueadero-component.html',
  styleUrl: './parqueadero-component.css',
})
export class ParqueaderoComponent implements OnInit {

  // Variables para Libres
  parqueaderosLibres!: Observable<PageResponse<ParqueaderoResponse>>;
  totalPageLibres = 0;
  paginaLibres = 0;
  private refreshLibres = new BehaviorSubject<number>(0);

  // Variables para Ocupados
  parqueaderosOcupados!: Observable<PageResponse<ParqueaderoResponse>>;
  totalPageOcupados = 0;
  paginaOcupados = 0;

  //Mensajes de error
  errorMessge = ''

  //total
  totalLibres = 0
  totalOcupados = 0
  private refreshOcupados = new BehaviorSubject<number>(0);
  constructor(private ps: ParqueaderoService) { }
  ngOnInit(): void {
    this.cargarLibres();
    this.cargarOcupados();
  }

  cargarLibres() {
    this.parqueaderosLibres = this.refreshLibres.pipe(
      switchMap(pagi => this.ps.obtenerParqueaderos(pagi, 3)),
      tap(res => {
        this.totalPageLibres = res.totalPages;
        this.paginaLibres = res.number;
        this.totalLibres = res.totalElements
      })

      
    );
  }

  cargarOcupados() {
    this.parqueaderosOcupados = this.refreshOcupados.pipe(
      switchMap(pagi => this.ps.parqueaderosOucpados(pagi, 6)),
      tap(res => {
        this.totalPageOcupados = res.totalPages;
        this.paginaOcupados = res.number;
        this.totalOcupados= res.totalElements
      })
    );
  }

  // Métodos de navegación específicos
  siguienteLibres() {
    if (this.paginaLibres < this.totalPageLibres - 1) {
      this.refreshLibres.next(this.paginaLibres + 1);
    }
  }

  siguienteOcupados() {
    if (this.paginaOcupados < this.totalPageOcupados - 1) {
      this.refreshOcupados.next(this.paginaOcupados + 1);
    }
  }
  anteriorOcupados() {
    if (this.paginaOcupados > 0) {
      this.refreshOcupados.next(this.paginaOcupados - 1)
    }
  }
  anteriorLibres() {
    if (this.paginaLibres > 0) {
      this.refreshLibres.next(this.paginaLibres - 1)
    }
  }
  liberar(parqueaderoId: number) {
    this.ps.liberarParqueadero(parqueaderoId).subscribe({
      next: () => {
        // Importante: Refrescamos los BehaviorSubject para que las tablas se actualicen solas
        this.refreshLibres.next(this.paginaLibres);
        this.refreshOcupados.next(this.paginaOcupados);
        console.log('Parqueadero liberado con éxito');
      },
      error: (err) => {
        this.errorMessge = 'No se pudo liberar el parqueadero';
        console.error(err);
      }
    });
  }
}
