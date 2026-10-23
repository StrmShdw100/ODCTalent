import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationItem {
  id: number;
  titre: string;
  message: string;
  type: string;
  lue: boolean;
  dateCreation: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/v1/admin/notifications';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getNombreNonLues(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/non-lues/count`, { headers: this.getHeaders() });
  }

  marquerCommeLue(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/lire`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }

  toutMarquerCommeLu(): Observable<string> {
    return this.http.put(`${this.apiUrl}/lire-tout`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }
}