import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
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

    this.http.get<any[]>(`${this.apiUrl}/missions`, { headers: this.getHeaders() })
      .pipe(
        switchMap((missions) => {
          const missionsList = Array.isArray(missions) ? missions : [];

          if (!missionsList.length) {
            return of([] as CandidatureResponse[]);
          }

          return forkJoin(
            missionsList.map((mission) =>
              this.http.get<CandidatureResponse[]>(`${this.apiUrl}/candidatures/mission/${mission.id}`, {
                headers: this.getHeaders()
              })
            )
          ).pipe(
            map((pages) => pages.flatMap((page) => page || []))
          );
        }),
        catchError((err) => {
          console.error('Erreur lors du chargement des candidatures :', err);
          return of([] as CandidatureResponse[]);
        })
      )
      .subscribe({
        next: (data) => {
          this.candidatures = data || [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
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