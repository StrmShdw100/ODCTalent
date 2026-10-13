import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

export interface DashboardStats {
  apprenants: number;
  recruteurs: number;
  projetsAModerer: number;
  opportunitesActives: number;
  nouvellesOpportunites: number;
  recentActivities: {
    title: string;
    time: string;
    type: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/v1/dashboard/stats';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getStats(): Observable<DashboardStats> {
    const token = this.authService.getToken(); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DashboardStats>(this.apiUrl, { headers });
  }
}