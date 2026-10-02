import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Administrateur {
  id: number;
  initials: string;
  name: string;
  roleDescription: string;
  email: string;
  role: string;
  lastAccess: string;
  status: 'Actif' | 'Inactif';
  showMenu?: boolean;
}

@Component({
  selector: 'app-admin-administrateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-administrateurs.html',
  styleUrls: ['./admin-administrateurs.css']
})
export class AdminAdministrateursComponent implements OnInit {
  searchTerm: string = '';
  selectedRole: string = 'Rôle';

  // Gestion de la modale et du succès
  isModalOpen: boolean = false;
  successMessage: string | null = null;

  // Modèle du formulaire d'ajout
  formModel = {
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    role: '',
    tempPassword: '',
    permissions: {
      dashboard: true,
      actualites: true,
      projets: true,
      opportunites: true,
      apprenants: true,
      recruteurs: true
    }
  };

  stats = {
    actifs: 5,
    superAdmins: 1,
    rolesPersonnalises: 4,
    enAttente: 1
  };

  administrateurs: Administrateur[] = [
    { id: 1, initials: 'AM', name: 'Fatoumata Kaloga', roleDescription: 'Administratrice principale', email: 'kalogaf@gmail.com', role: 'Super Administrateur', lastAccess: "Aujourd'hui, 10:24", status: 'Actif' },
    { id: 2, initials: 'OC', name: 'Mamadou Dembele', roleDescription: 'Administrateur', email: 'dembele.23m@gmail.com', role: 'Administrateur', lastAccess: 'Hier, 16:42', status: 'Actif' },
    { id: 3, initials: 'FL', name: 'Aicha Macoura Koné', roleDescription: 'Gestionnaire de contenu', email: 'aichakone.lo@gmail.com', role: 'Gestionnaire des recruteurs', lastAccess: '20 sept. 2026', status: 'Actif' },
    { id: 4, initials: 'NK', name: 'Ousmane Soma', roleDescription: 'Modératrice de projets', email: 'soma21ous@gmail.com', role: 'Modérateur projets', lastAccess: '19 sept. 2026', status: 'Actif' },
    { id: 5, initials: 'FS', name: 'Lamine Cissé', roleDescription: 'Support régional', email: 'laminecisse@gmail.com', role: 'Actualité', lastAccess: '18 sept. 2026', status: 'Inactif' }
  ];

  ngOnInit(): void {}

  openAddModal(): void {
    this.isModalOpen = true;
    this.formModel = {
      prenom: '',
      nom: '',
      telephone: '',
      email: '',
      role: '',
      tempPassword: '',
      permissions: { dashboard: true, actualites: true, projets: true, opportunites: true, apprenants: true, recruteurs: true }
    };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitAdministrateur(): void {
    const newAdmin: Administrateur = {
      id: this.administrateurs.length + 1,
      initials: (this.formModel.prenom.charAt(0) + this.formModel.nom.charAt(0)).toUpperCase() || 'AD',
      name: `${this.formModel.prenom || 'Nouveau'} ${this.formModel.nom || 'Admin'}`,
      roleDescription: 'Gestionnaire',
      email: this.formModel.email || 'admin@odctalent.com',
      role: this.formModel.role || 'Administrateur',
      lastAccess: "À l'instant",
      status: 'Actif'
    };

    this.administrateurs.unshift(newAdmin);
    this.isModalOpen = false;

    // Affichage de l'alerte de succès comme sur la maquette
    this.successMessage = "Administrateur est ajouté avec succès.";
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }

  toggleMenu(item: Administrateur, event: Event): void {
    event.stopPropagation();
    this.administrateurs.forEach(a => { if (a !== item) a.showMenu = false; });
    item.showMenu = !item.showMenu;
  }
}