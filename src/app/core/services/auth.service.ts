import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8080/api/v1/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
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