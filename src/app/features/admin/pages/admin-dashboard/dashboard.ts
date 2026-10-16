import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStats } from './dashboard.service';
import { AdminDashboardService } from '../admin-administrateurs/administrateur.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
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
}