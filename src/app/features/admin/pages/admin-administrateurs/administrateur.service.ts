import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AdministrateurBackend {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  roleAdmin?: string;
  statut: string;
  actif: boolean;
  dateInscription: string;
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

  getAllAdministrateurs(): Observable<AdministrateurBackend[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/utilisateurs`, { headers: this.getHeaders() }).pipe(
      map((data) => (Array.isArray(data) ? data.filter(u => u.role === 'ADMIN') : []))
    );
  }

  creerAdministrateur(formData: any): Observable<AdministrateurBackend> {
    const payload = {
      prenom: formData.prenom,
      nom: formData.nom,
      telephone: formData.telephone,
      email: formData.email,
      role: 'ADMIN',
      motDePasse: formData.tempPassword
    };
    return this.http.post<AdministrateurBackend>(`${this.apiUrl}/auth/register`, payload, { headers: this.getHeaders() });
  }

  toggleStatut(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/utilisateurs/${id}/autoriser`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  getUtilisateursEnAttente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/utilisateurs`, { headers: this.getHeaders() }).pipe(
      map((data) => (Array.isArray(data) ? data.filter(u => !u.actif) : []))
    );
  }
}