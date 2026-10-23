import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';

export interface ProfilRecruteur {
  id?: number;
  nom: string;
  prenom: string;
  fonction?: string;
  email: string;
  telephone?: string;
  nomEntreprise?: string;
  descriptionEntreprise?: string;
  secteurActivite?: string;
  adresse?: string; 
  siteWeb?: string;
  notificationsCandidatures?: boolean;
  notificationsEmail?: boolean;
  langue?: string;
  fuseauHoraire?: string;
}

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './parametres.html',
  styleUrls: ['./parametres.css']
})
export class Parametres implements OnInit {
  modalProfilOuverte = false;
  modalMotDePasseOuverte = false;

  profil: ProfilRecruteur = {
    nom: '',
    prenom: '',
    fonction: 'Responsable recrutement',
    email: '',
    telephone: '',
    nomEntreprise: '',
    adresse: 'Bamako, Mali',
    siteWeb: '',
    notificationsCandidatures: true,
    notificationsEmail: true,
    langue: 'Français',
    fuseauHoraire: 'GMT+0'
  };

  profilForm: ProfilRecruteur = { ...this.profil };

  passwordData = {
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: ''
  };

  private apiUrl = 'http://localhost:8080/api/v1/recruteur/parametres';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerProfil();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerProfil(): void {
    this.http.get<ProfilRecruteur>(`${this.apiUrl}/profil`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        if (data) {
          this.profil = { ...this.profil, ...data };
          
          if (this.profil.nom && this.profil.prenom) {
            localStorage.setItem('nom', this.profil.nom);
            localStorage.setItem('prenom', this.profil.prenom);
            localStorage.setItem('user_name', `${this.profil.prenom} ${this.profil.nom}`);
          }
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement du profil recruteur :", err);
        
        const fullName = this.authService.getUserName();
        const parts = fullName.split(' ');
        
        this.profil.prenom = parts[0] || 'Utilisateur';
        this.profil.nom = parts.slice(1).join(' ') || 'ODC';
        
        this.cdr.detectChanges();
      }
    });
  }

  get initiales(): string {
    const p = this.profil.prenom ? this.profil.prenom.charAt(0).toUpperCase() : '';
    const n = this.profil.nom ? this.profil.nom.charAt(0).toUpperCase() : '';
    return `${p}${n}` || 'RC';
  }

  get nomComplet(): string {
    return `${this.profil.prenom} ${this.profil.nom}`.trim() || 'Recruteur ODC';
  }

  ouvrirProfil(): void {
    this.profilForm = { ...this.profil };
    this.modalProfilOuverte = true;
  }

  fermerProfil(): void {
    this.modalProfilOuverte = false;
  }

  enregistrerProfil(): void {
    this.http.put(`${this.apiUrl}/profil`, this.profilForm, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: (res) => {
        this.profil = { ...this.profil, ...this.profilForm };
        
        if (this.profil.nom && this.profil.prenom) {
          localStorage.setItem('nom', this.profil.nom);
          localStorage.setItem('prenom', this.profil.prenom);
          localStorage.setItem('user_name', `${this.profil.prenom} ${this.profil.nom}`);
        }

        this.modalProfilOuverte = false;
        alert("Profil mis à jour avec succès !");
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du profil :", err);
        const msg = err.error || "Erreur lors de l'enregistrement du profil.";
        alert(msg);
      }
    });
  }

  enregistrerPreferences(): void {
    // Si tu ajoutes l'endpoint préférences plus tard, tu pourras l'activer ici
    alert("Préférences enregistrées avec succès !");
  }

  ouvrirMotDePasse(): void {
    this.passwordData = { ancienMotDePasse: '', nouveauMotDePasse: '', confirmationMotDePasse: '' };
    this.modalMotDePasseOuverte = true;
  }

  fermerMotDePasse(): void {
    this.modalMotDePasseOuverte = false;
  }

  modifierMotDePasse(): void {
    if (this.passwordData.nouveauMotDePasse !== this.passwordData.confirmationMotDePasse) {
      alert("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }
    if (this.passwordData.nouveauMotDePasse.length < 8) {
      alert("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    this.http.put(`${this.apiUrl}/mot-de-passe`, {
      ancienMotDePasse: this.passwordData.ancienMotDePasse,
      nouveauMotDePasse: this.passwordData.nouveauMotDePasse
    }, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        alert("Mot de passe modifié avec succès !");
        this.modalMotDePasseOuverte = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du changement de mot de passe :", err);
        const msg = err.error || "Ancien mot de passe incorrect.";
        alert(msg);
      }
    });
  }
}