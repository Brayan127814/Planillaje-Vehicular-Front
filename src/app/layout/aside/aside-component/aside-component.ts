import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aside-component',
  standalone:true,
  imports: [CommonModule, RouterLinkActive,RouterLink],
  templateUrl: './aside-component.html',
  styleUrl: './aside-component.css',
})
export class AsideComponent {
  @Input() isOpen = false

  constructor(public authService:  Auth, private router: Router) {}

  cerrarSesion() {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Seguro que quieres salir?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('RefreshToken');
        this.router.navigate(['/login']);
      }
    });
  }

}
