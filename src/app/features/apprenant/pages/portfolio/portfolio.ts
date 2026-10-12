import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

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
    photoProfil: ''
  };

  initiales: string = 'MC';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerMonPortfolio();
  }

  chargerMonPortfolio() {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('http://localhost:8080/api/v1/portfolios/me', { headers }).subscribe({
      next: (data) => {
        this.portfolio = data;
        const nom = data.nomApprenant || '';
        const prenom = data.prenomApprenant || '';
        
        if (nom || prenom) {
          this.initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
        } else {
          this.initiales = 'ODC';
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement du portfolio :", err);
      }
    });
  }

  toggleEdition() {
    this.modeEdition = !this.modeEdition;
  }

  sauvegarderPortfolio() {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const payload = {
      bio: this.portfolio.bio,
      titreProfessionnel: this.portfolio.titreProfessionnel,
      githubUrl: this.portfolio.githubUrl,
      linkedinUrl: this.portfolio.linkedinUrl,
      websiteUrl: this.portfolio.websiteUrl,
      competences: this.portfolio.competences,
      photoProfil: this.portfolio.photoProfil
    };

    this.http.put<any>('http://localhost:8080/api/v1/portfolios/me', payload, { headers }).subscribe({
      next: (updatedData) => {
        this.portfolio = updatedData;
        this.modeEdition = false;
        alert("Portfolio mis à jour avec succès !");
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour :", err);
        alert("Impossible de mettre à jour le portfolio.");
      }
    });
  }

  changerLangue(langue: string) {
    this.langueActive = langue;
  }
}