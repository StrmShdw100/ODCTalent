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
      password: ['', [Validators.required, Validators.minLength(4)]],
      rememberMe: [false] 
    });
  }

 onSubmit(): void {
  console.log("--> Bouton cliqué ! Données saisies :", this.loginForm.value);

  if (this.loginForm.invalid) {
    console.warn("⚠️ Le formulaire est invalide, mais le bouton est cliquable.");
    this.errorMessage = "Veuillez remplir correctement tous les champs.";
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  const payload = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  };

  this.authService.login(payload).subscribe({
    next: (response) => {
      this.isLoading = false;
      console.log("Connexion réussie, rôle reçu :", response.role);
      this.redirectUserBasedOnRole(response.role);
    },
    error: (err) => {
      this.isLoading = false;
      console.error("Erreur HTTP capturée :", err);
      this.errorMessage = "Email ou mot de passe incorrect.";
    }
  });
}

redirectUserBasedOnRole(role: string): void {
  // Nettoyage du format du rôle au cas où (ex: ROLE_ADMIN ou ADMIN)
  const formattedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;

  switch (formattedRole) {
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