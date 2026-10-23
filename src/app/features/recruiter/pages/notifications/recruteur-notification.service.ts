import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecruteurNotificationItem {
  id: number;
  titre: string;
  message: string;
  type?: string;
  lue: boolean;
  dateCreation: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecruteurNotificationService {
  private apiUrl = 'http://localhost:8080/api/v1/notifications';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getNotifications(): Observable<RecruteurNotificationItem[]> {
    return this.http.get<RecruteurNotificationItem[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  marquerCommeLue(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/lire`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }
}