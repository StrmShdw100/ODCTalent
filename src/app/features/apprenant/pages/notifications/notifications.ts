import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-apprenant-notifications',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class NotificationsApprenant implements OnInit {
  notifications: Notification[] = [];
  chargement: boolean = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.chargerNotifications();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerNotifications(): void {
    this.chargement = true;
    this.http.get<Notification[]>('http://localhost:8080/api/v1/apprenants/notifications', { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.notifications = data || [];
          this.chargement = false;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error("Erreur lors du chargement des notifications :", err);
          this.chargement = false;
          this.cdr.detectChanges(); 
        }
      });
  }

  marquerCommeLue(id: number): void {
    this.http.patch(`http://localhost:8080/api/v1/notifications/${id}/lire`, {}, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          const notif = this.notifications.find(n => n.id === id);
          if (notif) {
            notif.lu = true;
            this.cdr.detectChanges();          }
        },
        error: (err) => {
          console.error("Erreur marquage notification lue :", err);
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