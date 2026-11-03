import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './candidature-detail.html',
  styleUrls: ['./candidature-detail.css']
})
export class CandidatureDetail implements OnInit {
  candidatureId!: number;
  candidature: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  modalValidationOuverte = false;
  modalRefusOuverte = false;
  
  modalPortfolioOuvert = false;
  portfolioCandidat: any = null;
  chargementPortfolio = false;

  commentaireInterne: string = 'Profil validé après entretien. Compétences adaptées au poste.';
  motifRefus: string = '';

  private baseUrl = 'http://localhost:8080/api/v1/candidatures';
  private portfolioBaseUrl = 'http://localhost:8080/api/v1/portfolios';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.candidatureId = Number(idParam);
        this.chargerDetailCandidature();
      } else {
        this.errorMessage = "ID de candidature introuvable dans l'URL.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerDetailCandidature(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${this.baseUrl}/recruteur`, { headers: this.getHeaders() }).subscribe({
      next: (data: any[]) => {
        this.candidature = (data || []).find(c => c.id === this.candidatureId);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Erreur chargement détail candidature :", err);
        this.errorMessage = "Impossible de récupérer les informations de cette candidature.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ouvrirValidation(): void { 
    this.modalValidationOuverte = true; 
    this.cdr.detectChanges();
  }
  fermerValidation(): void { 
    this.modalValidationOuverte = false; 
    this.cdr.detectChanges();
  }

  ouvrirRefus(): void { 
    this.modalRefusOuverte = true; 
    this.cdr.detectChanges();
  }
  fermerRefus(): void { 
    this.modalRefusOuverte = false; 
    this.cdr.detectChanges();
  }

  ouvrirPortfolioCandidat(): void {
    if (!this.candidature || !this.candidature.apprenantId) return;

    this.modalPortfolioOuvert = true;
    this.chargementPortfolio = true;
    this.cdr.detectChanges();

    this.http.get<any>(`${this.portfolioBaseUrl}/apprenant/${this.candidature.apprenantId}`, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => {
        this.portfolioCandidat = data;
        this.chargementPortfolio = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Erreur chargement portfolio :", err);
        this.portfolioCandidat = null;
        this.chargementPortfolio = false;
        this.cdr.detectChanges();
      }
    });
  }

  fermerPortfolioCandidat(): void {
    this.modalPortfolioOuvert = false;
    this.portfolioCandidat = null;
    this.cdr.detectChanges();
  }

  validerCandidature(): void {
    this.changerStatut('ACCEPTEE');
  }

  refuserCandidature(): void {
    this.changerStatut('REFUSEE');
  }

  private changerStatut(nouveauStatut: string): void {
    this.http.patch(`${this.baseUrl}/${this.candidatureId}/statut?statut=${nouveauStatut}`, {}, { headers: this.getHeaders() }).subscribe({
      next: (updated: any) => {
        if (this.candidature) {
          this.candidature.statut = updated.statut || nouveauStatut;
        }
        this.fermerValidation();
        this.fermerRefus();
        this.cdr.detectChanges();
        alert(`La candidature a été mise à jour avec succès : ${nouveauStatut}`);
      },
      error: (err: any) => {
        console.error("Erreur modification statut :", err);
        alert("Une erreur est survenue lors de la mise à jour du statut.");
      }
    });
  }

  get initiales(): string {
    if (!this.candidature || !this.candidature.prenomApprenant) return 'CN';
    return (this.candidature.prenomApprenant.charAt(0) + (this.candidature.nomApprenant ? this.candidature.nomApprenant.charAt(0) : '')).toUpperCase();
  }
}