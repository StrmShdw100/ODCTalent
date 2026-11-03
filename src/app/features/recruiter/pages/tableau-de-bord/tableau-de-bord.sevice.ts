import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private statsUrl = 'http://localhost:8080/api/v1/recruteur/dashboard/stats';
  private candidaturesUrl = 'http://localhost:8080/api/v1/candidatures/recruteur';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRecruiterStats(): Observable<RecruiterStats> {
    return this.http.get<RecruiterStats>(this.statsUrl, { headers: this.getHeaders() });
  }

  getCandidaturesRecentes(): Observable<CandidatureRecente[]> {
    return this.http.get<CandidatureRecente[]>(this.candidaturesUrl, { headers: this.getHeaders() });
  }
}