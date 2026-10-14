import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

export interface ProjetModeration {
  id: number;
  badge: string;
  title: string;
  description: string;
  apprenant: string;
  date: string;
  status: 'En attente' | 'Validé' | 'À corriger';
  type: string;
  showMenu?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModerationService {
private apiUrl = 'http://localhost:8080/api/v1/projets';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProjetsModeration(): Observable<ProjetModeration[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      map(response => response.map(p => ({
        id: p.id,
        badge: p.badge || 'WEB',
        title: p.titre,
        description: p.description,
        apprenant: p.apprenantNom,
        date: p.dateCreation ? new Date(p.dateCreation).toLocaleDateString() : 'Récemment',
        status: p.statut,
        type: p.type || 'Web'
      })))
    );
  }

  changerStatutProjet(id: number, nouveauStatut: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/${id}/statut`, { statut: nouveauStatut }, { headers });
  }

  getModerationStats(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/stats/moderation`, { headers });
  }
}