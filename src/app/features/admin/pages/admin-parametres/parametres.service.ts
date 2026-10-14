import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametresService {
  private apiUrl = 'http://localhost:8080/api/v1/admin/parametres';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profil`, { headers: this.getHeaders() });
  }

  updateProfil(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profil`, data, { headers: this.getHeaders() });
  }
}