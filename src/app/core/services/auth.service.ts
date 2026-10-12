import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  role: string;
  username?: string;
  nom?: string;
  prenom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8080/api/v1/auth';
  private apprenantUrl = 'http://localhost:8080/api/v1/apprenants';

  constructor(private http: HttpClient) {}

  // 1. Inscription (Étape 1) - Stocke le token comme le login
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, userData).pipe(
      tap(response => {
        console.log("Token reçu après inscription :", response.token);
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_role', response.role);
          
          if (response.nom && response.prenom) {
            localStorage.setItem('user_name', `${response.prenom} ${response.nom}`);
          }
        }
      })
    );
  }

  // Connexion (Déjà existant)
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        console.log("Token reçu du backend :", response.token);
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_role', response.role);
          
          if (response.nom && response.prenom) {
            localStorage.setItem('user_name', `${response.prenom} ${response.nom}`);
          } else if (response.username) {
            localStorage.setItem('user_name', response.username);
          }
        }
      })
    );
  }

  // 2. Complément de profil (Étape 2) - Nécessite le Token JWT
  completeProfile(profileData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // responseType: 'text' car le backend renvoie une chaîne de caractères simple
    return this.http.put(`${this.apprenantUrl}/profile`, profileData, { 
      headers, 
      responseType: 'text' 
    });
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserName(): string {
    return localStorage.getItem('user_name') || 'Utilisateur ODC';
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}