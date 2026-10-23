import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NotificationStateService } from '../../../../core/services/notification-state.service';

export interface RecruteurNotification {
  id: number;
  titre: string;
  message: string;
  type?: string;
  lue: boolean;
  dateCreation: string;
}

@Component({
  selector: 'app-recruteur-notifications',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './recruteur-notifications.html',
  styleUrls: ['./recruteur-notifications.css']
})
export class RecruteurNotifications implements OnInit {
  private apiUrl = 'http://localhost:8080/api/v1/notifications';

  notifications: RecruteurNotification[] = [];
  nombreNonLues: number = 0;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private notificationState: NotificationStateService
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
    this.http.get<RecruteurNotification[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data: RecruteurNotification[]) => {
        this.notifications = data || [];
        this.calculerNonLues();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des notifications recruteur :', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculerNonLues(): void {
    this.nombreNonLues = this.notifications.filter((n: RecruteurNotification) => !n.lue).length;
  }

  marquerCommeLue(item: RecruteurNotification): void {
    if (item.lue) return;

    this.http.patch(`${this.apiUrl}/${item.id}/lire`, {}, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        item.lue = true;
        this.calculerNonLues();
        this.notificationState.chargerCompteur();
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur lors du marquage :', err)
    });
  }

  toutMarquerCommeLu(): void {
    this.notifications.forEach((n: RecruteurNotification) => {
      if (!n.lue) {
        this.marquerCommeLue(n);
      }
    });
  }
}