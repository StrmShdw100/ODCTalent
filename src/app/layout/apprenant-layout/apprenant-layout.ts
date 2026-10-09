import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-apprenant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './apprenant-layout.html',
  styleUrls: ['./apprenant-layout.css']
})
export class ApprenantLayout {
    constructor(private router: Router) {}

  deconnecter(): void {
    // Nettoyage du stockage local
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    
    // Redirection vers la page de connexion
    this.router.navigate(['/login']);
  }
}