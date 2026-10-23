import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit {
  adminName = localStorage.getItem('user_name') || 'Administrateur';
  adminRole = localStorage.getItem('user_role') || 'ADMIN';
  src: string = '/logoODC.png'; 
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
    this.http.get<any[]>('http://localhost:8080/api/v1/admin/recruteurs/notifications', { headers: this.getHeaders() })
      .subscribe({
        next: (notifications) => {
          const list = notifications || [];
          this.unreadCount = list.filter(n => n && !n.lu).length;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des notifications admin :', err);
          this.unreadCount = 0;
        }
      });
  }

  onLogout(): void {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }
}