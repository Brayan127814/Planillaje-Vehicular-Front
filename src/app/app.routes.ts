import { Routes } from '@angular/router';
import { PlanillajeComponent } from './modules/planillaje/planillaje-component/planillaje-component';
import { LoginComponent } from './modules/auth/login-component/login-component';
import { DashboardComponent } from './layout/dashboard-layout/dashboard-component/dashboard-component';
import { VehiculoComponent } from './modules/vehiculo/vehiculo-component/vehiculo-component';
import { BusquedaComponent } from './modules/planillaje/planillaje-busqueda/busqueda-component/busqueda-component';
import { CargarVehiculosComponent } from './modules/vehiculo/cargar-vehiculos-component/cargar-vehiculos-component';
import { ParqueaderoComponent } from './modules/parqueaderos/parqueadero-component/parqueadero-component';
import { InvitacionComponent } from './modules/invitacion/invitacion-component/invitacion-component';
import { RegistroComponent } from './modules/auth/registro-component/registro-component';
import { PuestoComponent } from './modules/puestos/puesto-component/puesto-component';

export const routes: Routes = [
  { path: 'registrate', component: RegistroComponent },
  // 1. Ruta de Login
  { path: 'login', component: LoginComponent },

  // 2. Ruta del Dashboard con sus hijos
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'planillaje', component: PlanillajeComponent },
      { path: 'crear-invitacion', component: InvitacionComponent },
      { path: 'crear-puesto', component: PuestoComponent },

      // Si entran a /dashboard a secas, mandarlos a /dashboard/planillaje
      { path: '', redirectTo: 'planillaje', pathMatch: 'full' },
      // registro de vhiculos
      { path: 'registrar-vehiculo', component: VehiculoComponent },
      // consultar planillaje de un vehiculo
      { path: 'conssultar-planillaje', component: BusquedaComponent },
      { path: 'vehiculos', component: CargarVehiculosComponent },
      { path: 'parqueaderos', component: ParqueaderoComponent },

      // Si escriben cualquier cosa mal DENTRO del dashboard
      { path: '**', redirectTo: 'planillaje' }
    ],
  },

  // 3. Rutas de raíz
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 4. Comodín global: si no existe la ruta, al login
  { path: '**', redirectTo: 'login' }
];