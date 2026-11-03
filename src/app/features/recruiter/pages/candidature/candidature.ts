import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

export interface CandidatureResponse {
  id: number;
  lettreMotivation: string;
  tarifPropose: number;
  statut: string;
  dateCandidature: string;
  missionId: number;
  titreMission: string;
  apprenantId: number;
  nomApprenant: string;
  prenomApprenant: string;
  emailApprenant: string;
}

@Component({
  selector: 'app-candidatures',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './candidature.html',
  styleUrls: ['./candidature.css']
})
export class Candidatures implements OnInit {
  candidatures: CandidatureResponse[] = [];
  isLoading: boolean = true;
  private apiUrl = 'http://localhost:8080/api/v1/candidatures/recruteur';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // 🚀 Injection de ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerCandidatures();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerCandidatures(): void {
    this.isLoading = true;
    this.http.get<CandidatureResponse[]>(this.apiUrl, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.candidatures = data || [];
          this.isLoading = false;
          this.cdr.detectChanges(); // 🚀 Force le rafraîchissement immédiat de la liste
        },
        error: (err) => {
          console.error('Erreur lors du chargement des candidatures :', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  get totalCandidatures(): number {
    return this.candidatures.length;
  }

  get candidaturesEnCours(): number {
    return this.candidatures.filter(c => c.statut === 'EN_ATTENTE' || c.statut === 'EN_COURS').length;
  }

  get candidaturesEntretiens(): number {
    return this.candidatures.filter(c => c.statut === 'ENTRETIEN').length;
  }

  get candidaturesAcceptees(): number {
    return this.candidatures.filter(c => c.statut === 'ACCEPTEE').length;
  }
}