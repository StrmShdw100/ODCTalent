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
  activeTab: string = 'general';

  generalSettings = {
    platformName: 'ODCTalent',
    language: 'Français',
    timezone: 'GMT+00:00 — Afrique de l\'Ouest',
    dateFormat: 'JJ/MM/AAAA',
    theme: 'Clair',
    adminNotifications: true
  };

  accountSettings = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    role: 'Administrateur principal',
    lastPasswordChange: 'il y a 30 jours'
  };

  notificationSettings = {
    actualitesPubliees: true,
    nouveauxProjets: true,
    nouvellesOpportunites: true,
    nouveauxComptes: false
  };

  securitySettings = {
    twoFactorAuth: true
  };

  permissionsList = [
    { section: 'Tableau de bord', read: true, write: true },
    { section: 'Actualités', read: true, write: true },
    { section: 'Projets', read: true, write: true },
    { section: 'Opportunités', read: true, write: true },
    { section: 'Apprenants', read: true, write: true },
    { section: 'Recruteurs', read: true, write: true },
    { section: 'Administrateurs', read: true, write: true },
    { section: 'Paramètres', read: true, write: true }
  ];

  successMessage: string | null = null;

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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement du profil admin :", err);
        this.cdr.detectChanges();
      }
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  saveChanges(): void {
    if (this.activeTab === 'account') {
      this.parametresService.updateProfil({
        prenom: this.accountSettings.prenom,
        nom: this.accountSettings.nom,
        telephone: this.accountSettings.telephone
      }).subscribe({
        next: () => {
          this.successMessage = "Profil mis à jour avec succès.";
          this.declencherMessageSucces();
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour :", err);
          alert("Impossible d'enregistrer les modifications du compte.");
        }
      });
    } else {
      this.successMessage = "Paramètres enregistrés avec succès.";
      this.declencherMessageSucces();
    }
  }

  private declencherMessageSucces(): void {
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 4000);
  }
}