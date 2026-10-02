import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SplashComponent } from './features/splash/splash';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SplashComponent],
  template: `
    <!-- Affichage du splash screen au démarrage -->
    <app-splash *ngIf="isLoading" (finished)="isLoading = false"></app-splash>

    <!-- Application principale -->
    <router-outlet *ngIf="!isLoading"></router-outlet>
  `
})
export class AppComponent {
  isLoading: boolean = true;
}