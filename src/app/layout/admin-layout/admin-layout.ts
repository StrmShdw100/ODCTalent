import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit {
  src:string="/logoODC.png"
  adminName = 'Chargement...';
  adminRole = 'Administrateur';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    if (role) {
      this.adminRole = role.replace('ROLE_', '').toLowerCase();
      this.adminRole = this.adminRole.charAt(0).toUpperCase() + this.adminRole.slice(1);
    }

    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      this.adminName = storedName;
    } else {
      this.adminName = 'Utilisateur ODC';
    }
  }

  onLogout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}