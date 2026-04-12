import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-aside-component',
  standalone:true,
  imports: [CommonModule, RouterLinkActive,RouterLink],
  templateUrl: './aside-component.html',
  styleUrl: './aside-component.css',
})
export class AsideComponent {
  @Input() isOpen = false

  constructor(public authService:  Auth) {}


}
