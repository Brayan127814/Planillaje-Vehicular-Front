import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-compnent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header-compnent.html',
  styleUrl: './header-compnent.css',
})
export class HeaderCompnent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  // Variables
  searchTerm = '';
  showNotifications = false;
  showUserMenu = false;
  unreadNotifications = 3;
  
  constructor(private router: Router) {}
  
  // Alternar sidebar (para móvil)
  onToggleMenu() {
    this.toggleSidebar.emit();
  }
  
  // Búsqueda
  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/dashboard/buscar'], { queryParams: { q: this.searchTerm } });
    }
  }
  
  // Notificaciones
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }
  
  // Menú de usuario
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }
  
  // Cerrar dropdowns al hacer clic fuera
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.icon-btn')) {
      this.showNotifications = false;
      this.showUserMenu = false;
    }
  }
}