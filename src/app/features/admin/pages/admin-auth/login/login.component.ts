import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    // 1. Vérifier si un token existe déjà au chargement de la page de login
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');

    if (token && role) {
      console.info("⚡ Session active détectée, redirection automatique...");
      this.redirectUserBasedOnRole(role);
    }
  }

  onSubmit(): void {
    console.log("--> Bouton cliqué ! Données saisies :", this.loginForm.value);

    if (this.loginForm.invalid) {
      console.warn("⚠️ Le formulaire est invalide.");
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
      next: (response: any) => {
        this.isLoading = false;
        console.log("Connexion réussie, réponse reçue :", response);

        // 2. Sauvegarder le token et le rôle dans le stockage du navigateur
        // (Vérifie si la propriété s'appelle 'token', 'accessToken' ou autre dans ton backend)
        const tokenValue = response.token || response.accessToken;
        const roleValue = response.role;

        if (tokenValue) {
          localStorage.setItem('token', tokenValue);
        }
        if (roleValue) {
          localStorage.setItem('user_role', roleValue);
        }

        this.redirectUserBasedOnRole(roleValue);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Erreur HTTP capturée :", err);
        this.errorMessage = "Email ou mot de passe incorrect.";
      }
    });
  }

  redirectUserBasedOnRole(role: string): void {
    if (!role) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    const formattedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;

    switch (formattedRole) {
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ROLE_RECRUTEUR':
      case 'ROLE_RECRUITER':
        this.router.navigate(['/recruteur/tableau-de-bord']);
        break;
      case 'ROLE_APPRENANT':
        this.router.navigate(['/apprenant/tableau-de-bord']);
        break;
      default:
        this.router.navigate(['/admin/dashboard']);
        break;
    }
  }
}