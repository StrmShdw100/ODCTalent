import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

  private readonly apiUrl = environment.apiUrl;
  private readonly portfolioBaseUrl = `${this.apiUrl}/portfolios`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id') ?? this.route.snapshot.queryParamMap.get('id');
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
    this.errorMessage = '';

    this.http.get<any[]>(`${this.apiUrl}/missions`, { headers: this.getHeaders() })
      .pipe(
        switchMap((missions) => {
          const missionsList = Array.isArray(missions) ? missions : [];

          if (!missionsList.length) {
            return of([] as any[]);
          }

          return forkJoin(
            missionsList.map((mission) =>
              this.http.get<any[]>(`${this.apiUrl}/candidatures/mission/${mission.id}`, {
                headers: this.getHeaders()
              })
            )
          ).pipe(
            map((pages) => pages.flatMap((page) => page || []))
          );
        }),
        map((candidatures) => (candidatures || []).find((c) => c.id === this.candidatureId) || null),
        catchError((err) => {
          console.error('Erreur chargement détail candidature :', err);
          this.errorMessage = 'Impossible de récupérer les informations de cette candidature.';
          return of(null);
        })
      )
      .subscribe({
        next: (candidature) => {
          this.candidature = candidature;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
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
        console.error('Erreur chargement portfolio :', err);
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

  normalizeStatut(statut: string | null | undefined): string {
    return (statut || '').toString().trim().toUpperCase();
  }

  getLibelleStatut(statut: string | null | undefined): string {
    const s = this.normalizeStatut(statut);
    switch (s) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EN_COURS':
        return 'En cours';
      case 'ENTRETIEN':
        return 'Entretien';
      case 'ACCEPTEE':
      case 'VALIDEE':
      case 'VALIDEE':
        return 'Validée';
      case 'REFUSEE':
      case 'REJETEE':
      case 'REJETE':
        return 'Refusée';
      default:
        return statut || 'En attente';
    }
  }

  estCandidatureValidee(statut: string | null | undefined): boolean {
    const s = this.normalizeStatut(statut);
    return s === 'ACCEPTEE' || s === 'VALIDEE' || s === 'VALIDEE';
  }

  estCandidatureRefusee(statut: string | null | undefined): boolean {
    const s = this.normalizeStatut(statut);
    return s === 'REFUSEE' || s === 'REJETEE' || s === 'REJETE';
  }

  private changerStatut(nouveauStatut: string): void {
    this.http.patch(`${this.apiUrl}/candidatures/${this.candidatureId}/statut?statut=${nouveauStatut}`, {}, { headers: this.getHeaders() }).subscribe({
      next: (updated: any) => {
        if (this.candidature) {
          this.candidature.statut = updated?.statut || nouveauStatut;
        }
        this.fermerValidation();
        this.fermerRefus();
        this.cdr.detectChanges();
        alert(`La candidature a été mise à jour avec succès : ${this.getLibelleStatut(nouveauStatut)}`);
      },
      error: (err: any) => {
        console.error('Erreur modification statut :', err);
        alert('Une erreur est survenue lors de la mise à jour du statut.');
      }
    });
  }

  get initiales(): string {
    if (!this.candidature || !this.candidature.prenomApprenant) return 'CN';
    return (this.candidature.prenomApprenant.charAt(0) + (this.candidature.nomApprenant ? this.candidature.nomApprenant.charAt(0) : '')).toUpperCase();
  }
}