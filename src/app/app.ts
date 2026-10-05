import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SplashComponent } from './features/splash/splash';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SplashComponent],
  template: `
    <!-- 1. Le Splash Screen s'affiche au démarrage -->
    <app-splash *ngIf="showSplash" (finished)="onSplashFinished()"></app-splash>

    <!-- 2. L'application principale gérée par le routeur (Login, Admin Layout, etc.) -->
    <router-outlet *ngIf="!showSplash"></router-outlet>
  `
})
export class AppComponent {
  showSplash: boolean = true;

  constructor(private router: Router) {}

  onSplashFinished(): void {
    // Le splash screen est terminé, on le cache
    this.showSplash = false;
    
    // On redirige l'utilisateur vers la page de connexion définie dans les routes
    this.router.navigate(['/login']);
  }
}