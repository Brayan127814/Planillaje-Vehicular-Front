import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PuestoServices } from '../../../core/services/puestos/puesto-services';
import { InvitacionService } from '../../../core/services/invitacion/invitacion-service';

@Component({
  selector: 'app-invitacion-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invitacion-component.html',
  styleUrls: ['./invitacion-component.css'],
})
export class InvitacionComponent implements OnInit {
  puestos: any[] = [];
  puestoSeleccionado!: number;
  cargandoPuestos = true; // 🔄 Indicador de carga

  private tokenSubject = new BehaviorSubject<string>('');
  tokenGenerado$ = this.tokenSubject.asObservable();

  constructor(
    private puestoService: PuestoServices,
    private invitacionService: InvitacionService,
    private cdr: ChangeDetectorRef // 🔥 Para forzar detección de cambios
  ) { }

  ngOnInit(): void {
    this.cargarPuestos();
  }

  cargarPuestos(): void {
    this.cargandoPuestos = true;
    this.puestoService.listarPuestos(0, 50).subscribe({
      next: (res) => {
        this.puestos = res.content;
        this.cargandoPuestos = false;
        console.log('PUESTOS:', this.puestos);
        this.cdr.detectChanges(); //  Fuerza la actualización de la vista
      },
      error: (err) => {
        console.error('Error al cargar puestos:', err);
        this.cargandoPuestos = false;
        this.cdr.detectChanges();
      },
    });
  }

  crearInvitacion(): void {
    if (!this.puestoSeleccionado) {
      alert('Selecciona un puesto');
      return;
    }

    this.invitacionService.crearInvitacion(this.puestoSeleccionado).subscribe({
      next: (res: any) => {
        console.log('RESPUESTA completa:', res);
        const token = res?.token
          ? `//https://planillaje-vehicular-front.onrender.com/#/registrate?token=${res.token}`
          : '';
        //https://planillaje-vehicular-front.onrender.com/#/registrate?token=${res.token}http://localhost:4200/#/registrate?token=${res.token}
        console.log('TOKEN GENERADO:', token);
        this.tokenSubject.next(token);
      },
      error: (err) => console.error('Error al crear invitación:', err),
    });
  }

  copiarToken(token: string): void {
    navigator.clipboard.writeText(token).then(() => {
      alert('Token copiado al portapapeles');
    }).catch(() => {
      alert('No se pudo copiar el token');
    });
  }
}