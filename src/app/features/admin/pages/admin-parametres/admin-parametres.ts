import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-parametres.html',
  styleUrl: './admin-parametres.css'
})
export class AdminParametresComponent implements OnInit {
  activeTab: string = 'general';

  // Données - Général
  generalSettings = {
    platformName: 'ODCTalent',
    language: 'Français',
    timezone: 'GMT+00:00 — Afrique de l\'Ouest',
    dateFormat: 'JJ/MM/AAAA',
    theme: 'Clair',
    adminNotifications: true
  };

  // Données - Compte administrateur
  accountSettings = {
    prenom: 'Fatoumata',
    nom: 'Kaloga',
    email: 'orangekalanso@odctalent.org',
    telephone: '+223 70 00 00 00',
    role: 'Administrateur principal',
    lastPasswordChange: 'il y a 30 jours'
  };

  // Données - Notifications
  notificationSettings = {
    actualitesPubliees: true,
    nouveauxProjets: true,
    nouvellesOpportunites: true,
    nouveauxComptes: false
  };

  // Données - Sécurité
  securitySettings = {
    twoFactorAuth: true
  };

  // Données - Permissions
  permissionsList = [
    { section: 'Tableau de bord', read: true, write: false },
    { section: 'Actualités', read: true, write: true },
    { section: 'Projets', read: true, write: true },
    { section: 'Opportunités', read: true, write: true },
    { section: 'Apprenants', read: true, write: true },
    { section: 'Recruteurs', read: true, write: true },
    { section: 'Administrateurs', read: true, write: true },
    { section: 'Paramètres', read: true, write: false }
  ];

  successMessage: string | null = null;

  ngOnInit(): void {}

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  saveChanges(): void {
    this.successMessage = "Modifications enregistrées avec succès.";
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }
}