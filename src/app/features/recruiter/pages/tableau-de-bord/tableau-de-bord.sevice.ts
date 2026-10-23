import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecruiterStats {
  missionsPubliees: number;
  candidaturesRecues: number;
  candidaturesEnCours: number;
  contratsActifs: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecruiterDashboardService {
  private apiUrl = 'http://localhost:8080/api/v1/recruteur/dashboard/stats';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRecruiterStats(): Observable<RecruiterStats> {
    return this.http.get<RecruiterStats>(this.apiUrl, { headers: this.getHeaders() });
  }
}