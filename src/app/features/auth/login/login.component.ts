import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false] // Optionnel, initialisé à false
    });
  }

  onSubmit(): void {
    console.log("Formulaire soumis, valeurs :", this.loginForm.value);

    if (this.loginForm.invalid) {
      console.log("Le formulaire est invalide !");
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.redirectUserBasedOnRole(response.role);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur de connexion :', err);
        this.errorMessage = "Email ou mot de passe incorrect.";
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
        this.router.navigate(['/admin/dashboard']);
        break;
    }
  }
}