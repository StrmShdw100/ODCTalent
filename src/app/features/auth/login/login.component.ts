import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adapte le chemin selon ton arborescence

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onLogin(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Aiguillage basé sur le rôle renvoyé par Spring Boot
        this.redirectUserBasedOnRole(response.role);
      },
      error: (err) => {
        this.isLoading = false;
        console.err('Erreur de connexion :', err);
        this.errorMessage = "Email ou mot de passe incorrect, ou serveur inaccessible.";
      }
    });
  }

  private redirectUserBasedOnRole(role: string): void {
    switch (role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ROLE_RECRUTEUR':
        this.router.navigate(['/recruteur/espace']);
        break;
      case 'ROLE_APPRENANT':
        this.router.navigate(['/apprenant/espace']);
        break;
      default:
        this.router.navigate(['/admin/dashboard']); // Fallback par défaut
        break;
    }
  }
}