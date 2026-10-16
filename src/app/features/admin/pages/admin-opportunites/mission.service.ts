import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MissionRequest {
  titre: string;
  description: string;
  competencesRequises?: string;
  statut?: string;
  dateLimite?: string;
  budget?: number;
}

export interface MissionResponse {
  id: number;
  titre: string;
  description: string;
  budget?: number;
  competencesRequises?: string;
  statut: string;
  datePublication?: string;
  dateLimite?: string;
  recruteurId?: number;
  nomRecruteur?: string;
  prenomRecruteur?: string;
  emailRecruteur?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private adminApiUrl = 'http://localhost:8080/api/v1/admin';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllMissions(): Observable<MissionResponse[]> {
    return this.http.get<MissionResponse[]>(`${this.adminApiUrl}/missions`, { headers: this.getHeaders() });
  }

  getOpportunitesStats(): Observable<{ recruteursActifs: number; candidatures: number }> {
    return this.http.get<{ recruteursActifs: number; candidatures: number }>(
      `${this.adminApiUrl}/stats/opportunites`,
      { headers: this.getHeaders() }
    );
  }

  createMission(request: MissionRequest, recruteurId?: number): Observable<MissionResponse> {
    const url = recruteurId 
      ? `${this.adminApiUrl}/missions?recruteurId=${recruteurId}`
      : `${this.adminApiUrl}/missions`;
    return this.http.post<MissionResponse>(url, request, { headers: this.getHeaders() });
  }

  updateMissionStatus(id: number, statut: string): Observable<MissionResponse> {
    return this.http.patch<MissionResponse>(
      `${this.adminApiUrl}/missions/${id}/statut?statut=${statut}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteMission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/missions/${id}`, { headers: this.getHeaders() });
  }
}