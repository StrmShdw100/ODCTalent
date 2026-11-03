import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 🚀 1. Import du Router
import { AdminDashboardService, DashboardStats } from './dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalApprenants: 0,
    totalRecruteurs: 0,
    totalOpportunites: 0,
    totalAdministrateurs: 0,
    comptesEnAttente: 0,
    totalCandidatures: 0
  };
  chargement: boolean = true;

  constructor(
    private dashboardService: AdminDashboardService,
    private router: Router, // 🚀 2. Injection du Router
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerStats();
  }

  chargerStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement dashboard :", err);
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🚀 3. Méthodes de redirection (adapte les chemins selon tes routes exactes)
  goToApprenants(): void {
    this.router.navigate(['/admin/apprenants']);
  }

  goToOpportunites(): void {
    this.router.navigate(['/admin/opportunites']);
  }

  goToRecruteurs(): void {
    this.router.navigate(['/admin/recruteurs']);
  }
}