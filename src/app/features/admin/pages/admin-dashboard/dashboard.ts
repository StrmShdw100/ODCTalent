import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardService, DashboardStats } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    apprenants: 0,
    recruteurs: 0,
    projetsAModerer: 0,
    opportunitesActives: 0,
    nouvellesOpportunites: 0,
    recentActivities: []
  };

  loading: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.chargerStats();
  }

  chargerStats(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Erreur chargement dashboard :", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get recentActivities() {
    return this.stats?.recentActivities || [];
  }

  naviguerVersActualites(): void {
    this.router.navigate(['/admin/actualites']);
  }

  naviguerVersProjets(): void {
    this.router.navigate(['/admin/moderation']);
  }

  naviguerVersOpportunites(): void {
    this.router.navigate(['/admin/opportunites']);
  }
}