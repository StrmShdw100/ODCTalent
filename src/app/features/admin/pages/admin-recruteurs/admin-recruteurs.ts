import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface AdminRecruteur {
  id: number;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  nomEntreprise?: string;
  descriptionEntreprise?: string;
  secteurActivite?: string;
  adresse?: string;
  siteWeb?: string;
  actif: boolean;
  statut?: string;
  photoProfil?: string;
}

@Component({
  selector: 'app-admin-recruteurs',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-recruteurs.html',
  styleUrls: ['./admin-recruteurs.css']
})
export class AdminRecruteursComponent implements OnInit {
  recruteurs: AdminRecruteur[] = [];
  chargement: boolean = true;
  searchTerm: string = '';

  // Gestion Modale
  isModalOpen: boolean = false;
  nouveauRecruteur = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    nomEntreprise: '',
    secteurActivite: '',
    adresse: '',
    siteWeb: '',
    descriptionEntreprise: ''
  };

  stats = {
    recruteursActifs: 0,
    recruteursActifsSub: 'Actifs sur la plateforme',
    entreprisesPartenaires: 0,
    entreprisesSub: 'Entreprises enregistrées',
    comptesAVerifier: 0,
    opportunitesPubliees: 0,
    opportunitesSub: 'Offres postées'
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerRecruteurs();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerRecruteurs(): void {
    this.http.get<AdminRecruteur[]>('http://localhost:8080/api/v1/admin/recruteurs', { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.recruteurs = data;
          this.calculerStats();
          this.chargement = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement recruteurs :', err);
          this.chargement = false;
          this.cdr.detectChanges();
        }
      });
  }

  calculerStats(): void {
    this.stats.entreprisesPartenaires = this.recruteurs.length;
    this.stats.recruteursActifs = this.recruteurs.filter(r => r.actif).length;
    this.stats.comptesAVerifier = this.recruteurs.filter(r => !r.actif).length;
  }

  get recruteursFiltres(): AdminRecruteur[] {
    if (!this.searchTerm) return this.recruteurs;
    return this.recruteurs.filter(r => 
      r.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      r.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (r.nomEntreprise && r.nomEntreprise.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  ouvrirModal(): void {
    this.isModalOpen = true;
    this.nouveauRecruteur = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      nomEntreprise: '',
      secteurActivite: '',
      adresse: '',
      siteWeb: '',
      descriptionEntreprise: ''
    };
    this.cdr.detectChanges();
  }

  fermerModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  creerRecruteur(): void {
    if (!this.nouveauRecruteur.nom || !this.nouveauRecruteur.email || !this.nouveauRecruteur.nomEntreprise) {
      alert("Veuillez remplir les champs obligatoires (Nom, Email, Nom de l'entreprise).");
      return;
    }

    this.http.post('http://localhost:8080/api/v1/admin/recruteurs', this.nouveauRecruteur, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          alert("Recruteur et entreprise ajoutés avec succès !");
          this.fermerModal();
          this.chargerRecruteurs();
        },
        error: (err) => {
          console.error("Erreur création recruteur :", err);
          alert(typeof err.error === 'string' ? err.error : "Erreur lors de la création du recruteur.");
        }
      });
  }

  autoriserRecruteur(id: number): void {
    this.http.put(`http://localhost:8080/api/v1/admin/recruteurs/${id}/autoriser`, {}, { 
      headers: this.getHeaders(), 
      responseType: 'text' 
    }).subscribe({
      next: () => {
        alert("Compte recruteur autorisé avec succès !");
        this.chargerRecruteurs();
      },
      error: (err) => {
        console.error("Erreur lors de l'autorisation :", err);
        alert("Impossible d'autoriser ce recruteur.");
      }
    });
  }
}