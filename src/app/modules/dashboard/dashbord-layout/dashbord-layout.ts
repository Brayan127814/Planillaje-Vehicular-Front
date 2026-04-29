import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VehiculoService } from '../../../core/services/vehiculos/vehiculo-service';
import { PlanillajeService } from '../../../core/services/planillaje/planillaje-service';
import { ParqueaderoService } from '../../../core/services/parqueaderos/parqueadero-service';
import { VehiculoResponse } from '../../../dtos/vehiculo/vhiculo-dto';



interface Estadisticas {
  activos: number;
  planillados: number;
  totalRegistrados: number;
  parqueaderos: number;
  activosHoy: number;
  planillajesHoy: number;
}

@Component({
  selector: 'app-dashbord-layout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashbord-layout.html',
  styleUrl: './dashbord-layout.css',
})
export class DashbordLayout implements OnInit, OnDestroy {

  // ==================== VARIABLES ====================


  // Búsqueda
  searchText: string = '';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPaginas = 0

  // Lista de vehículos
  vehiculos: VehiculoResponse[] = [];

  // Estado de carga
  isLoading: boolean = true;

  // Intervalo para datos en tiempo real
  private refreshInterval: any;

  // Título de la página según la ruta
  pageTitle: string = 'Dashboard';

  totalVehiculos: number = 0;
  totalParqueaderos: number = 0;
  planillajesHoy: number = 0;
  totalPlanillados: number = 0;
  planillajesDelDia: number = 0;
  parqueaderosOcupados: number = 0;
  parqueaderosLibres: number = 0;

  constructor(private router: Router, private vehiculoService: VehiculoService,
    private planillajeService: PlanillajeService, private parqueaderoService: ParqueaderoService, private cdr: ChangeDetectorRef) { }

  cargarVehiculos() {
    this.vehiculoService.listarVehiculos(this.currentPage - 1, this.itemsPerPage).subscribe(response => {
      console.log('Respuesta de listarVehiculos:', response);
      this.vehiculos = response.content;
      this.totalVehiculos = response.totalElements;
      this.totalPaginas = response.totalPages;
      console.log('Total paginas:', this.totalPaginas);

      this.isLoading = false
      this.cdr.detectChanges();
    })
  }

  //CARGAR PLANILLAJES DEL DIA
  cargarPlanillajesDelDia() {
    this.planillajeService.planillajesDelDia(this.currentPage - 1, this.itemsPerPage).subscribe(response => {

      this.planillajesHoy = response.totalElements
      console.log('Planillajes del día:', this.planillajesHoy);
      this.cdr.detectChanges();

    })
  }
  //CARGAR PARQUEADEROS LIBRES
  cargarParqueaderosOucupados() {
    this.parqueaderoService.parqueaderosOucpados(this.currentPage - 1, this.itemsPerPage).subscribe(response => {
      this.parqueaderosOcupados = response.totalElements
      console.log('Parqueaderos ocupados:', this.parqueaderosOcupados);
      this.cdr.detectChanges();
    })
  }

  //CARGAR PARQUEADEROS LIBRES
  cargarParqueaderosLibres() {
    this.parqueaderoService.obtenerParqueaderos(this.currentPage - 1, this.itemsPerPage).subscribe(response =>{
      this.parqueaderosLibres = response.totalElements
      console.log('Parqueaderos libres:', this.parqueaderosLibres);
      this.cdr.detectChanges();
    })
  }

  ngOnInit() {

    this.cargarVehiculos()
    this.cargarPlanillajesDelDia()
    this.cargarParqueaderosOucupados()
    this.cargarParqueaderosLibres()
    // Actualizar título según la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.actualizarTitulo();
    });


  }

  ngOnDestroy() {
    // Limpiar intervalo al destruir el componente
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }





  vehiculosFiltrados(): VehiculoResponse[] {
    if (!this.searchText.trim()) {
      return this.vehiculos;
    }
    const search = this.searchText.toLowerCase();
    return this.vehiculos.filter(v =>
      v.placa.toLowerCase().includes(search) ||
      v.marca.toLowerCase().includes(search) ||
      v.numeroDeParqueadero.toString().toLowerCase().includes(search)
    );

  }




  actualizarTitulo() {
    const path = this.router.url;
    if (path.includes('dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (path.includes('planillaje')) {
      this.pageTitle = 'Registrar Planillaje';
    } else if (path.includes('registrar-vehiculo')) {
      this.pageTitle = 'Registrar Vehículo';
    } else if (path.includes('vehiculos')) {
      this.pageTitle = 'Consultar Vehículos';
    } else if (path.includes('parqueaderos')) {
      this.pageTitle = 'Parqueaderos';
    }
  }

  navegarARegistrarVehiculo() {
    this.router.navigate(['/dashboard/registrar-vehiculo']);
  }

  navegarAPlanillaje() {
    this.router.navigate(['/dashboard/planillaje']);
  }

  verPlanillaje(vehiculo: VehiculoResponse) {
    console.log('Ver planillaje del vehículo:', vehiculo);
    this.router.navigate(['/dashboard/planillaje'], {
      queryParams: { placa: vehiculo.placa, vehiculoId: vehiculo.id }
    });
  }

  contarPlanillajesDelDia() {

    this.planillajeService.contarPlnaillajesDelDia(this.fechaLocalDateTime()).subscribe({
      next: res => {
        this.planillajesDelDia = res
      }, error: e => {
        console.error(e)
      }
    })

  }
  private fechaLocalDateTime() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  paginaSiguiente() {
    if (this.currentPage < this.totalPaginas) {
      this.currentPage++;
      this.cargarVehiculos()
    }
  }

  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarVehiculos()
    }
  }




  formatearNumero(numero: number): string {
    if (numero >= 1000) {
      return (numero / 1000).toFixed(1) + 'k';
    }
    return numero.toString();
  }
}