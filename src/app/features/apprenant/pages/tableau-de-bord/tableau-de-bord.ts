import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tableau-de-bord-apprenant',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './tableau-de-bord.html',
  styleUrls: ['./tableau-de-bord.css']
})
export class TableauDeBordApprenant implements OnInit {
  nom = localStorage.getItem('user_name') || 'Apprenant';
  actualitesRecentes: any[] = [];
  disponible: boolean = true;
  photoProfil: string | null = null; 

  showGifBanner: boolean = true;
  actuSelectionnee: any | null = null;

  private portfolioUrl = 'http://localhost:8080/api/v1/portfolios/me';
  private actualitesUrl = 'http://localhost:8080/api/v1/actualites';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showGifBanner = false;
      this.cdr.detectChanges();
    }, 1500);

    this.chargerPortfolio();
    this.chargerActualitesRecentes();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.actuSelectionnee && target.classList.contains('overlay-modale-actu')) {
      this.fermerModaleActu();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerPortfolio(): void {
    this.http.get<any>(this.portfolioUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.disponible = data.disponible !== undefined && data.disponible !== null ? data.disponible : true;
        this.photoProfil = data.photoProfil || data.avatar || null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement portfolio :", err);
      }
    });
  }

  basculerDisponibilite(event: MouseEvent): void {
    event.stopPropagation();
    const nouveauStatut = !this.disponible;
    const payload = { disponible: nouveauStatut };

    this.http.put<any>(this.portfolioUrl, payload, { headers: this.getHeaders() }).subscribe({
      next: (updated) => {
        this.disponible = updated.disponible !== undefined ? updated.disponible : nouveauStatut;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur mise à jour disponibilité :", err);
        alert("Impossible de modifier le statut de disponibilité.");
      }
    });
  }

  ouvrirDetailActu(actu: any, event: MouseEvent): void {
    event.stopPropagation();
    this.actuSelectionnee = actu;
    this.cdr.detectChanges();
  }

  fermerModaleActu(): void {
    this.actuSelectionnee = null;
    this.cdr.detectChanges();
  }

  get initiales(): string {
    if (!this.nom) return 'AP';
    const parties = this.nom.trim().split(' ');
    if (parties.length >= 2) {
      return (parties[0].charAt(0) + parties[1].charAt(0)).toUpperCase();
    }
    return this.nom.substring(0, 2).toUpperCase();
  }

  chargerActualitesRecentes(): void {
    this.http.get<any[]>(this.actualitesUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        const publiees = (data || []).filter(a => !a.status || a.status === 'Publié');
        this.actualitesRecentes = publiees.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement actualités :", err);
        this.cdr.detectChanges();
      }
    });
  }
}