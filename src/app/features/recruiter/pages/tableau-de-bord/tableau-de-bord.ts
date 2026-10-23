import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecruiterDashboardService, RecruiterStats } from './tableau-de-bord.sevice';

@Component({
  selector: 'app-tableau-de-bord-recruteur',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tableau-de-bord.html',
  styleUrls: ['./tableau-de-bord.css']
})
export class TableauDeBord implements OnInit {

  stats: RecruiterStats = {
    missionsPubliees: 0,
    candidaturesRecues: 0,
    candidaturesEnCours: 0,
    contratsActifs: 0
  };
  chargement: boolean = true;

  constructor(
    private dashboardService: RecruiterDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerStats();
  }

  chargerStats(): void {
    this.chargement = true;
    this.dashboardService.getRecruiterStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques recruteur :', err);
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}