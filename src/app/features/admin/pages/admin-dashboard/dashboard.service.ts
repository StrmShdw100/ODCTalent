import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
  totalApprenants: number;
  totalRecruteurs: number;
  totalOpportunites: number;
  totalAdministrateurs: number;
  comptesEnAttente: number;
  totalCandidatures: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/utilisateurs`, { headers: this.getHeaders() }).pipe(
      map((data) => {
        const utilisateurs = Array.isArray(data) ? data : [];
        const apprenants = utilisateurs.filter(u => u.role === 'APPRENANT');
        const recruteurs = utilisateurs.filter(u => u.role === 'RECRUTEUR');
        const administrateurs = utilisateurs.filter(u => u.role === 'ADMIN');
        const comptesEnAttente = utilisateurs.filter(u => !u.actif).length;

        return {
          totalApprenants: apprenants.length,
          totalRecruteurs: recruteurs.length,
          totalOpportunites: 0,
          totalAdministrateurs: administrateurs.length,
          comptesEnAttente,
          totalCandidatures: 0
        };
      })
    );
  }
}