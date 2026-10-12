import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MissionRequest {
  titre: string;
  description: string;
  budget?: number;
  competencesRequises?: string;
  statut?: string;
}

export interface MissionResponse {
  id: number;
  titre: string;
  description: string;
  budget: number;
  competencesRequises: string;
  statut: string;
  datePublication: string;
  recruteurId: number;
  nomRecruteur: string;
  prenomRecruteur: string;
  emailRecruteur: string;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = 'http://localhost:8080/api/v1/missions';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllMissions(): Observable<MissionResponse[]> {
    return this.http.get<MissionResponse[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createMission(request: MissionRequest): Observable<MissionResponse> {
    return this.http.post<MissionResponse>(this.apiUrl, request, { headers: this.getHeaders() });
  }

  deleteMission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}