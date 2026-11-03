import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CandidatureRecente, RecruiterDashboardService, RecruiterStats } from './tableau-de-bord.sevice';

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
  
  candidaturesRecentes: CandidatureRecente[] = [];
  chargement: boolean = true;

  constructor(
    private dashboardService: RecruiterDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonneesDashboard();
  }

  chargerDonneesDashboard(): void {
    this.chargement = true;

    this.dashboardService.getRecruiterStats().subscribe({
      next: (data: RecruiterStats) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement stats recruteur :', err);
      }
    });

    // Récupération des candidatures récentes (limitées aux 4 premières)
    this.dashboardService.getCandidaturesRecentes().subscribe({
      next: (data: CandidatureRecente[]) => {
        this.candidaturesRecentes = (data || []).slice(0, 4);
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur candidatures récentes :', err);
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  getInitiales(prenom: string, nom: string): string {
    const p = prenom ? prenom.charAt(0) : '';
    const n = nom ? nom.charAt(0) : '';
    return (p + n).toUpperCase() || 'CN';
  }

  getLibelleStatut(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'Nouvelle';
      case 'EN_COURS': return 'En cours';
      case 'ENTRETIEN': return 'Entretien';
      case 'ACCEPTEE': return 'Acceptée';
      case 'REFUSEE': return 'Refusée';
      default: return statut || 'En cours';
    }
  }

  getClasseStatut(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'statut-nouvelle';
      case 'EN_COURS': return 'statut-cours';
      case 'ENTRETIEN': return 'statut-entretien';
      case 'ACCEPTEE': return 'statut-entretien';
      default: return 'statut-cours';
    }
  }
}