import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  // Route vers ta page de login basée sur ta maquette Figma
  { path: 'login', component: LoginComponent },
  
  // Redirection par défaut de la racine vers /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Route joker (si l'URL n'existe pas, renvoie vers le login)
  { path: '**', redirectTo: 'login' }
];