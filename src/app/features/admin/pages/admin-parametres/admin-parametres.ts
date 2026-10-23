import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametresService } from './parametres.service';

@Component({
  selector: 'app-admin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-parametres.html',
  styleUrl: './admin-parametres.css'
})
export class AdminParametresComponent implements OnInit {
  activeTab: string = 'account'; // Par défaut sur Mon Compte

  accountSettings = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    roleAdmin: 'Administrateur'
  };

  passwordForm = {
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private parametresService: ParametresService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerProfil();
  }

  chargerProfil(): void {
    this.parametresService.getProfil().subscribe({
      next: (data) => {
        this.accountSettings.prenom = data.prenom || '';
        this.accountSettings.nom = data.nom || '';
        this.accountSettings.email = data.email || '';
        this.accountSettings.telephone = data.telephone || '';
        this.accountSettings.roleAdmin = data.roleAdmin || 'Administrateur';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement du profil admin :", err);
      }
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  saveProfil(): void {
    this.parametresService.updateProfil({
      prenom: this.accountSettings.prenom,
      nom: this.accountSettings.nom,
      telephone: this.accountSettings.telephone
    }).subscribe({
      next: () => {
        this.successMessage = "Profil mis à jour avec succès.";
        this.declencherMessage();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour :", err);
        this.errorMessage = "Impossible d'enregistrer les modifications du profil.";
        this.cdr.detectChanges();
      }
    });
  }

  updatePassword(): void {
    if (!this.passwordForm.ancienMotDePasse || !this.passwordForm.nouveauMotDePasse) {
      this.errorMessage = "Veuillez remplir tous les champs.";
      this.cdr.detectChanges();
      return;
    }

    if (this.passwordForm.nouveauMotDePasse !== this.passwordForm.confirmationMotDePasse) {
      this.errorMessage = "Les nouveaux mots de passe ne correspondent pas.";
      this.cdr.detectChanges();
      return;
    }

    this.parametresService.updatePassword({
      ancienMotDePasse: this.passwordForm.ancienMotDePasse,
      nouveauMotDePasse: this.passwordForm.nouveauMotDePasse
    }).subscribe({
      next: (response) => {
        this.successMessage = "Mot de passe mis à jour avec succès.";
        this.passwordForm = { ancienMotDePasse: '', nouveauMotDePasse: '', confirmationMotDePasse: '' };
        this.declencherMessage();
      },
      error: (err) => {
        console.error("Erreur lors du changement de mot de passe :", err);
        this.errorMessage = typeof err.error === 'string' && err.error 
          ? err.error 
          : "Échec du changement de mot de passe (vérifiez votre ancien mot de passe).";
        this.cdr.detectChanges();
      }
    });
  }

  private declencherMessage(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 4000);
  }
}