import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-recruiter-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './recruiter-layout.html',
  styleUrls: ['./recruiter-layout.css']
})
export class RecruiterLayout implements OnInit, OnDestroy {
  recruteurName: string = 'Recruteur';
  recruteurRole: string = 'RECRUTEUR';
  logoSrc: string = '/logoODC.png';
  unreadCount: number = 0;
  private routerSub?: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.recupererInfosUtilisateur();
    this.chargerCompteurNotifications();

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.chargerCompteurNotifications();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  recupererInfosUtilisateur(): void {
    const nom = localStorage.getItem('nom') || '';
    const prenom = localStorage.getItem('prenom') || '';
    const userName = localStorage.getItem('user_name') || '';
    const role = localStorage.getItem('role') || localStorage.getItem('user_role') || 'RECRUTEUR';

    if (prenom || nom) {
      this.recruteurName = `${prenom} ${nom}`.trim();
    } else if (userName) {
      this.recruteurName = userName;
    }

    this.recruteurRole = role;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerCompteurNotifications(): void {
    this.http.get<any[]>('http://localhost:8080/api/v1/notifications', { headers: this.getHeaders() })
      .subscribe({
        next: (notifications) => {
          const list = notifications || [];
          this.unreadCount = list.filter(n => n && !n.lue && !n.lu).length;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des notifications recruteur :', err);
          this.unreadCount = 0;
        }
      });
  }

  deconnecter(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}