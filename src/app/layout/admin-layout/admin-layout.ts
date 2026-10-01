import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent {
  // Informations de l'admin connecté basées sur ta maquette
  adminName = 'Fatoumata Kaloga';
  adminRole = 'Super Administrateur';

  onLogout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
}