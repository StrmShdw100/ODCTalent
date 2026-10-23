import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface AdminNotification {
  id: number;
  titre: string;
  message: string;
  type: string;
  lue: boolean;
  dateCreation: string;
}

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotificationsComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api/v1/admin/notifications';

  notifications: AdminNotification[] = [];
  nombreNonLues: number = 0;
  isLoading: boolean = false;

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
    this.isLoading = true;
    this.http.get<AdminNotification[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data: AdminNotification[]) => {
        this.notifications = data;
        this.calculerNonLues();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des notifications :', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculerNonLues(): void {
    this.nombreNonLues = this.notifications.filter((n: AdminNotification) => !n.lue).length;
  }

  marquerCommeLue(item: AdminNotification): void {
    if (item.lue) return;

    this.http.put(`${this.apiUrl}/${item.id}/lire`, {}, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        item.lue = true;
        this.calculerNonLues();
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur :', err)
    });
  }

  toutMarquerCommeLu(): void {
    this.http.put(`${this.apiUrl}/lire-tout`, {}, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        this.notifications.forEach((n: AdminNotification) => n.lue = true);
        this.calculerNonLues();
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur :', err)
    });
  }


  genererTest(): void {
    this.http.post(`${this.apiUrl}/generer-test`, {}, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        this.chargerNotifications(); 
      },
      error: (err: any) => console.error('Erreur lors de la génération :', err)
    });
  }
}