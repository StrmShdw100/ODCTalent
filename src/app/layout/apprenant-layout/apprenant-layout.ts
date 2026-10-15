import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-apprenant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './apprenant-layout.html',
  styleUrls: ['./apprenant-layout.css']
})
export class ApprenantLayout implements OnInit {
  nom = localStorage.getItem('user_name') || 'Apprenant';
  role = localStorage.getItem('user_role') || 'Apprenant ODC';
  unreadCount: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.chargerCompteurNotifications();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerCompteurNotifications(): void {
    this.http.get<any[]>('http://localhost:8080/api/v1/apprenants/notifications', { headers: this.getHeaders() })
      .subscribe({
        next: (notifications) => {
          // Compte uniquement les notifications non lues
          this.unreadCount = notifications.filter(n => !n.lu).length;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des notifications :', err);
        }
      });
  }

  deconnecter(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    
    this.router.navigate(['/login']);
  }
}