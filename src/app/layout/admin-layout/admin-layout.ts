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
  adminName = 'Fatoumata Kaloga';
  adminRole = 'Super Administrateur';

  onLogout(): void {
    localStorage.removeItem('auth_token');
    // Si tu gères l'état global dans AppComponent, tu peux émettre un événement ou rediriger
    window.location.reload(); 
  }
}