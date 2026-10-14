import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
export class AdministrateurService {
  private apiUrl = 'http://localhost:8080/api/v1/admin/administrateurs';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllAdministrateurs(): Observable<AdministrateurBackend[]> {
    return this.http.get<AdministrateurBackend[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  creerAdministrateur(data: any): Observable<AdministrateurBackend> {
    return this.http.post<AdministrateurBackend>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  toggleStatut(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/toggle`, {}, { headers: this.getHeaders() });
  }

  getUtilisateursEnAttente(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/v1/admin/utilisateurs/en-attente', { headers: this.getHeaders() });
  }

}