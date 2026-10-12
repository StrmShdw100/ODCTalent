import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Actualite {
  id?: number;
  badge: string;
  title: string;
  description: string;
  category: string;
  publicationDate: string;
  status: 'Publié' | 'Brouillon';
  author: string;
  imageUrl?: string;
  showMenu?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {
  private apiUrl = 'http://localhost:8080/api/v1/actualites';
  private fileUploadUrl = 'http://localhost:8080/api/v1/files/upload';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getActualites(): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createActualite(actualite: Actualite): Observable<Actualite> {
    return this.http.post<Actualite>(this.apiUrl, actualite, { headers: this.getHeaders() });
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.fileUploadUrl, formData, { headers: this.getHeaders() });
  }

  deleteActualite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}