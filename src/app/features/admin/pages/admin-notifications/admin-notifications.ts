import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

export interface Notification {
  id: number;
  titre: string;
  message: string;
  dateCreation: string;
  lu: boolean;
}

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-notifications.html',
  styleUrls: ['./admin-notifications.css']
})
export class AdminNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  chargement: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerNotifications();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerNotifications(): void {
    this.http.get<Notification[]>('http://localhost:8080/api/v1/admin/recruteurs/notifications', { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.notifications = data;
          this.chargement = false;
        },
        error: (err) => {
          console.error("Erreur chargement notifications admin :", err);
          this.chargement = false;
        }
      });
  }

  formaterDate(dateString: string): string {
    if (!dateString) return 'Récemment';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}