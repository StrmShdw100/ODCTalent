import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministrateurService, AdministrateurBackend } from './administrateur.service';

export interface AdministrateurViewModel {
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
  enAttenteCount: number = 0;
  isModalOpen: boolean = false;
  successMessage: string | null = null;

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

  administrateurs: AdministrateurViewModel[] = [];

  constructor(
    private adminService: AdministrateurService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
    this.chargerAdministrateurs();
    this.chargerComptesEnAttente();
  }

  chargerAdministrateurs(): void {
    this.adminService.getAllAdministrateurs().subscribe({
      next: (data: AdministrateurBackend[]) => {
        this.administrateurs = data.map(a => {
          const prenom = a.prenom || '';
          const nom = a.nom || '';
          const initials = ((prenom.charAt(0) + nom.charAt(0)) || 'AD').toUpperCase();
          
          return {
            id: a.id,
            initials: initials,
            name: `${prenom} ${nom}`.trim(),
            roleDescription: a.roleAdmin || 'Administrateur',
            email: a.email,
            role: a.roleAdmin || 'Administrateur',
            lastAccess: a.dateInscription ? new Date(a.dateInscription).toLocaleDateString() : 'Récemment',
            status: a.actif ? 'Actif' : 'Inactif'
          };
        });
        this.cdr.detectChanges(); // Force la mise à jour de l'UI
      },
      error: (err) => {
        console.error("Erreur lors du chargement des administrateurs :", err);
        this.cdr.detectChanges();
      }
    });
  }

  

  chargerComptesEnAttente(): void {
    this.adminService.getUtilisateursEnAttente().subscribe({
      next: (data) => {
        this.enAttenteCount = data.length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des comptes en attente :", err);
      }
    });
  }

  // Calcul dynamique des KPIs
  get stats() {
    const actifs = this.administrateurs.filter(a => a.status === 'Actif').length;
    const superAdmins = this.administrateurs.filter(a => a.role.includes('Super')).length;
    const rolesPersonnalises = this.administrateurs.filter(a => !a.role.includes('Super')).length;

    return {
      actifs,
      superAdmins,
      rolesPersonnalises,
      enAttente: this.enAttenteCount
    };
  }

 

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
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  submitAdministrateur(): void {
    this.adminService.creerAdministrateur(this.formModel).subscribe({
      next: () => {
        this.isModalOpen = false;
        this.successMessage = "Administrateur ajouté avec succès.";
        this.chargerAdministrateurs();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        console.error("Erreur lors de la création de l'administrateur :", err);
        alert("Impossible de créer l'administrateur.");
      }
    });
  }

  chargerMissionsOuAdmins(): void {
    this.chargerAdministrateurs();
  }

  toggleStatut(item: AdministrateurViewModel): void {
    this.adminService.toggleStatut(item.id).subscribe({
      next: () => {
        item.status = item.status === 'Actif' ? 'Inactif' : 'Actif';
        item.showMenu = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du changement de statut :", err);
      }
    });
  }

  toggleMenu(item: AdministrateurViewModel, event: Event): void {
    event.stopPropagation();
    this.administrateurs.forEach(a => { if (a !== item) a.showMenu = false; });
    item.showMenu = !item.showMenu;
  }

  get filteredAdministrateurs(): AdministrateurViewModel[] {
    return this.administrateurs.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.selectedRole === 'Rôle' || 
        item.role.toLowerCase() === this.selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }
}