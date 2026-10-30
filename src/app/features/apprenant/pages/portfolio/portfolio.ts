import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apprenant-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css']
})
export class PortfolioApprenant implements OnInit {
  langueActive = 'Français';
  modeEdition: boolean = false;

  portfolio: any = {
    bio: '',
    titreProfessionnel: 'Développeur Web & Mobile',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    competences: '',
    nomApprenant: '',
    prenomApprenant: '',
    emailApprenant: '',
    photoProfil: '',
    disponible: true
  };

  // 🚀 Objet temporaire pour l'édition (évite la modification en direct avant d'enregistrer)
  editablePortfolio: any = {};

  projetsApprenant: any[] = [];
  initiales: string = 'MC';

  private apiUrl = 'http://localhost:8080/api/v1/portfolios/me';
  private projetsUrl = 'http://localhost:8080/api/v1/projets'; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.chargerMonPortfolio();
    this.chargerProjetsApprenant();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerMonPortfolio() {
    this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.portfolio = data || {};
        if (this.portfolio.disponible === undefined || this.portfolio.disponible === null) {
          this.portfolio.disponible = true;
        }

        const nom = data.nomApprenant || '';
        const prenom = data.prenomApprenant || '';
        
        if (nom || prenom) {
          this.initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
        } else {
          this.initiales = 'ODC';
        }
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Erreur lors du chargement du portfolio :", err);
        this.cdr.detectChanges();
      }
    });
  }

  chargerProjetsApprenant() {
    this.http.get<any[]>(this.projetsUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.projetsApprenant = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des projets :", err);
      }
    });
  }

  allerVersProjet(id: number): void {
    if (id) {
      this.router.navigate(['/apprenant/projets', id]);
    }
  }

  toggleEdition() {
    if (!this.modeEdition) {
      // 🚀 Copie de sécurité pour l'annulation
      this.editablePortfolio = { ...this.portfolio };
    }
    this.modeEdition = !this.modeEdition;
    this.cdr.detectChanges();
  }

  sauvegarderPortfolio() {
    const payload = {
      bio: this.editablePortfolio.bio,
      titreProfessionnel: this.editablePortfolio.titreProfessionnel,
      githubUrl: this.editablePortfolio.githubUrl,
      linkedinUrl: this.editablePortfolio.linkedinUrl,
      websiteUrl: this.editablePortfolio.websiteUrl,
      competences: this.editablePortfolio.competences,
      photoProfil: this.editablePortfolio.photoProfil,
      disponible: this.editablePortfolio.disponible
    };

    this.http.put<any>(this.apiUrl, payload, { headers: this.getHeaders() }).subscribe({
      next: (updatedData) => {
        this.portfolio = updatedData;
        this.modeEdition = false;
        alert("Portfolio mis à jour avec succès !");
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour :", err);
        alert("Impossible de mettre à jour le portfolio.");
        this.cdr.detectChanges();
      }
    });
  }

  changerLangue(langue: string) {
    this.langueActive = langue;
    this.cdr.detectChanges();
  }
}