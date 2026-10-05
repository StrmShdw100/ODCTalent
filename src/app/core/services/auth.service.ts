import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  role: string; // Ex: 'ROLE_ADMIN', 'ROLE_RECRUTEUR', 'ROLE_APPRENANT'
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Remplace par l'URL de ton API Spring Boot
  private apiUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          // Stockage du token et du rôle dans le localStorage
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_role', response.role);
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

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}