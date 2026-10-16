import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/v1/admin/dashboard/stats';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl, { headers: this.getHeaders() });
  }
}