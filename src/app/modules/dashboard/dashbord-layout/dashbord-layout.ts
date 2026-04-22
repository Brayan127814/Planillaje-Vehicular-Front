import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Interfaces
interface Vehiculo {
  id: number;
  nombre: string;
  placa: string;
  marca: string;
  parqueadero: number;
  estado: 'ACTIVO' | 'MANTENIMIENTO' | 'INACTIVO' | 'EN_RUTA';
  ultimoReporte?: string;
}

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
  imports: [CommonModule,FormsModule],
  templateUrl: './dashbord-layout.html',
  styleUrl: './dashbord-layout.css',
})
export class DashbordLayout implements OnInit, OnDestroy {
  
  // ==================== VARIABLES ====================
  
  // Estadísticas
  estadisticas: Estadisticas = {
    activos: 0,
    planillados: 0,
    totalRegistrados: 0,
    parqueaderos: 0,
    activosHoy: 142,
    planillajesHoy: 37
  };
  
  // Búsqueda
  searchText: string = '';
  
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  
  // Lista de vehículos
  vehiculos: Vehiculo[] = [];
  
  // Estado de carga
  isLoading: boolean = true;
  
  // Intervalo para datos en tiempo real
  private refreshInterval: any;
  
  // Título de la página según la ruta
  pageTitle: string = 'Dashboard';
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Cargar datos iniciales
    this.cargarDatosIniciales();
    
    // Actualizar título según la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.actualizarTitulo();
    });
    
    // Actualizar datos cada 30 segundos
    this.refreshInterval = setInterval(() => {
      this.actualizarDatosTiempoReal();
    }, 30000);
  }
  
  ngOnDestroy() {
    // Limpiar intervalo al destruir el componente
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  
  // ==================== MÉTODOS DE CARGA DE DATOS ====================
  
  cargarDatosIniciales() {
    this.isLoading = true;
    
    // Simular carga de datos desde API
    setTimeout(() => {
      // Cargar vehículos
      this.vehiculos = [
        { id: 1, nombre: 'Carga Pesada #402', placa: 'XYY-9021', marca: 'Volvo', parqueadero: 3, estado: 'ACTIVO', ultimoReporte: 'Hace 5 min' },
        { id: 2, nombre: 'SUV Supervisión', placa: 'ABC-1234', marca: 'Toyota', parqueadero: 1, estado: 'ACTIVO', ultimoReporte: 'Hace 12 min' },
        { id: 3, nombre: 'Tractocamión #452', placa: 'DEF-5678', marca: 'Mercedes', parqueadero: 2, estado: 'MANTENIMIENTO', ultimoReporte: 'Ayer, 14:30' },
        { id: 4, nombre: 'Camioneta #108', placa: 'XYZ-9876', marca: 'Mazda', parqueadero: 1, estado: 'ACTIVO', ultimoReporte: 'Hace 3 min' },
        { id: 5, nombre: 'Bus Urbano #023', placa: 'GHI-9012', marca: 'Scania', parqueadero: 4, estado: 'EN_RUTA', ultimoReporte: 'Hace 8 min' },
        { id: 6, nombre: 'Minibús Escolar', placa: 'JKL-3456', marca: 'Mercedes', parqueadero: 2, estado: 'ACTIVO', ultimoReporte: 'Hace 20 min' },
        { id: 7, nombre: 'Furgón #007', placa: 'MNO-7890', marca: 'Ford', parqueadero: 3, estado: 'INACTIVO', ultimoReporte: 'Hace 2 horas' },
        { id: 8, nombre: 'Camión Refrigerado', placa: 'PQR-1234', marca: 'Volvo', parqueadero: 4, estado: 'EN_RUTA', ultimoReporte: 'Hace 1 min' },
      ];
      
      // Calcular estadísticas
      this.actualizarEstadisticas();
      
      this.isLoading = false;
    }, 500);
  }
  
  actualizarEstadisticas() {
    this.estadisticas.activos = this.vehiculos.filter(v => v.estado === 'ACTIVO').length;
    this.estadisticas.planillados = this.vehiculos.filter(v => v.estado === 'EN_RUTA').length;
    this.estadisticas.totalRegistrados = this.vehiculos.length;
    this.estadisticas.parqueaderos = 8; // Número fijo de parqueaderos disponibles
  }
  
  actualizarDatosTiempoReal() {
    // Simular actualización de datos en tiempo real
    const nuevosActivos = Math.floor(Math.random() * (160 - 120 + 1) + 120);
    const nuevosPlanillajes = Math.floor(Math.random() * (45 - 25 + 1) + 25);
    
    this.estadisticas.activosHoy = nuevosActivos;
    this.estadisticas.planillajesHoy = nuevosPlanillajes;
    
    // Actualizar algunos estados aleatoriamente
    const randomIndex = Math.floor(Math.random() * this.vehiculos.length);
    const estados: Vehiculo['estado'][] = ['ACTIVO', 'EN_RUTA', 'MANTENIMIENTO'];
    if (this.vehiculos[randomIndex]) {
      this.vehiculos[randomIndex].estado = estados[Math.floor(Math.random() * estados.length)];
      this.vehiculos[randomIndex].ultimoReporte = 'Ahora';
      this.actualizarEstadisticas();
    }
  }
  
  // ==================== GETTERS PARA VISTA ====================
  
  get vehiculosFiltrados(): Vehiculo[] {
    if (!this.searchText.trim()) {
      return this.vehiculos;
    }
    const search = this.searchText.toLowerCase();
    return this.vehiculos.filter(v => 
      v.placa.toLowerCase().includes(search) ||
      v.marca.toLowerCase().includes(search) ||
      v.nombre.toLowerCase().includes(search)
    );
  }
  
  get totalPages(): number {
    return Math.ceil(this.vehiculosFiltrados.length / this.itemsPerPage);
  }
  
  get vehiculosPaginados(): Vehiculo[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.vehiculosFiltrados.slice(start, end);
  }
  
  get totalActivos(): number {
    return this.vehiculos.filter(v => v.estado === 'ACTIVO').length;
  }
  
  get totalPlanillados(): number {
    return this.vehiculos.filter(v => v.estado === 'EN_RUTA').length;
  }
  
  get totalEnMantenimiento(): number {
    return this.vehiculos.filter(v => v.estado === 'MANTENIMIENTO').length;
  }
  
  get totalInactivos(): number {
    return this.vehiculos.filter(v => v.estado === 'INACTIVO').length;
  }
  
  get porcentajeActivos(): number {
    if (this.estadisticas.totalRegistrados === 0) return 0;
    return Math.round((this.totalActivos / this.estadisticas.totalRegistrados) * 100);
  }
  
  // ==================== MÉTODOS DE NAVEGACIÓN ====================
  
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
  
  verPlanillaje(vehiculo: Vehiculo) {
    console.log('Ver planillaje del vehículo:', vehiculo);
    this.router.navigate(['/dashboard/planillaje'], { 
      queryParams: { placa: vehiculo.placa, vehiculoId: vehiculo.id }
    });
  }
  
  // ==================== PAGINACIÓN ====================
  
  paginaSiguiente() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  // ==================== UTILIDADES ====================
  
  obtenerClaseEstado(estado: Vehiculo['estado']): string {
    switch(estado) {
      case 'ACTIVO': return 'status-active';
      case 'EN_RUTA': return 'status-route';
      case 'MANTENIMIENTO': return 'status-maintenance';
      case 'INACTIVO': return 'status-inactive';
      default: return '';
    }
  }
  
  obtenerIconoEstado(estado: Vehiculo['estado']): string {
    switch(estado) {
      case 'ACTIVO': return 'check_circle';
      case 'EN_RUTA': return 'directions_car';
      case 'MANTENIMIENTO': return 'build';
      case 'INACTIVO': return 'block';
      default: return 'help';
    }
  }
  
  formatearNumero(numero: number): string {
    if (numero >= 1000) {
      return (numero / 1000).toFixed(1) + 'k';
    }
    return numero.toString();
  }
}