import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderCompnent } from '../../header/header-compnent/header-compnent';
import { AsideComponent } from '../../aside/aside-component/aside-component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule, HeaderCompnent, AsideComponent, RouterOutlet],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
isSidebarOpen = false;

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
  console.log('estado:', this.isSidebarOpen);
}
}