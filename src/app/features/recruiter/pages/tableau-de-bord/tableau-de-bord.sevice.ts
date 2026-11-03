import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RecruiterStats {
  missionsPubliees: number;
  candidaturesRecues: number;
  candidaturesEnCours: number;
  contratsActifs: number;
}

export interface CandidatureRecente {
  id: number;
  nomApprenant: string;
  prenomApprenant: string;
  titreMission: string;
  dateCandidature: string;
  statut: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecruiterDashboardService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRecruiterStats(): Observable<RecruiterStats> {
    return this.http.get<any[]>(`${this.apiUrl}/missions`, { headers: this.getHeaders() }).pipe(
      switchMap((missions) => {
        const missionsList = Array.isArray(missions) ? missions : [];

        if (!missionsList.length) {
          return of({
            missionsPubliees: 0,
            candidaturesRecues: 0,
            candidaturesEnCours: 0,
            contratsActifs: 0
          } as RecruiterStats);
        }

        return forkJoin(
          missionsList.map((mission) =>
            this.http.get<any[]>(`${this.apiUrl}/candidatures/mission/${mission.id}`, {
              headers: this.getHeaders()
            })
          )
        ).pipe(
          map((pages) => {
            const candidatures = pages.flatMap((page) => page || []);
            return {
              missionsPubliees: missionsList.length,
              candidaturesRecues: candidatures.length,
              candidaturesEnCours: candidatures.filter((c) => c.statut === 'EN_ATTENTE' || c.statut === 'EN_COURS').length,
              contratsActifs: 0
            } as RecruiterStats;
          })
        );
      })
    );
  }

  getCandidaturesRecentes(): Observable<CandidatureRecente[]> {
    return this.http.get<any[]>(`${this.apiUrl}/missions`, { headers: this.getHeaders() }).pipe(
      switchMap((missions) => {
        const missionsList = Array.isArray(missions) ? missions : [];

        if (!missionsList.length) {
          return of([] as CandidatureRecente[]);
        }

        return forkJoin(
          missionsList.map((mission) =>
            this.http.get<any[]>(`${this.apiUrl}/candidatures/mission/${mission.id}`, {
              headers: this.getHeaders()
            })
          )
        ).pipe(
          map((pages) =>
            pages
              .flatMap((page) => page || [])
              .map((c) => ({
                id: c.id,
                nomApprenant: c.nomApprenant || '',
                prenomApprenant: c.prenomApprenant || '',
                titreMission: c.titreMission || 'Mission',
                dateCandidature: c.dateCandidature || '',
                statut: c.statut || 'EN_ATTENTE'
              }))
              .slice(0, 4)
          )
        );
      })
    );
  }
}