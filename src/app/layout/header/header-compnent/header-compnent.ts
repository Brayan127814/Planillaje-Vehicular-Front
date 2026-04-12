import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-compnent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-compnent.html',
  styleUrl: './header-compnent.css',
})
export class HeaderCompnent {
  @Output() toggleSidebar = new EventEmitter<void>()
  
  onToggleMenu() {
    console.log('CLICK MENU')
    this.toggleSidebar.emit();
  }
}
