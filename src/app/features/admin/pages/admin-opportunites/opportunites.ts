import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Opportunite {
  id: number;
  badge: string;
  title: string;
  location: string;
  recruiter: string;
  type: string;
  date: string;
  status: 'Publié' | 'Masqué' | 'À valider';
  showMenu?: boolean;
}

@Component({
  selector: 'app-opportunites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opportunites.html',
  styleUrls: ['./opportunites.css']
})
export class OpportunitesComponent implements OnInit {
  searchTerm: string = '';
  selectedType: string = "Type d'opportunité";
  selectedStatus: string = 'Statut';
  selectedRecruiter: string = 'Recruteur';

  // Gestion de la modale et des notifications
  isModalOpen: boolean = false;
  successMessage: string | null = null;

  // Modèle du formulaire d'ajout (correspondant à la maquette)
  formModel = {
    title: '',
    recruiter: '',
    type: 'Recrutement',
    location: '',
    deadline: '',
    description: '',
    skills: '',
    documentUrl: '',
    publishImmediately: true
  };

  // Données statistiques (KPIs)
  stats = {
    actives: 37,
    nouvelles: 12,
    enAttente: 8,
    recruteursActifs: 86,
    candidatures: 214
  };

  // Liste des opportunités mockées
  opportunites: Opportunite[] = [
    { id: 1, badge: 'JOB', title: 'Développeur React confirmé', location: 'Dakar • Hybride', recruiter: 'Sonatel Digital', type: 'Recrutement', date: '17 sept. 2026', status: 'Publié' },
    { id: 2, badge: 'STG', title: 'Stage analyste de données', location: 'Dakar • Présentiel', recruiter: 'Wave Mobile Money', type: 'Recrutement', date: '12 sept. 2026', status: 'Publié' },
    { id: 3, badge: 'MIS', title: 'Mission refonte application mobile', location: 'À distance', recruiter: 'Baobab+', type: 'Mission freelance', date: '15 sept. 2026', status: 'Masqué' },
    { id: 4, badge: 'FOR', title: 'Formation certifiante Cloud', location: 'Dakar • Orange Digital Center', recruiter: 'Sonatel Digital', type: 'Recrutement', date: '08 sept. 2026', status: 'Publié' }
  ];

  ngOnInit(): void {}

  openAddModal(): void {
    this.isModalOpen = true;
    this.formModel = {
      title: '',
      recruiter: '',
      type: 'Recrutement',
      location: '',
      deadline: '',
      description: '',
      skills: '',
      documentUrl: '',
      publishImmediately: true
    };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitOpportunite(): void {
    const newEntry: Opportunite = {
      id: this.opportunites.length + 1,
      badge: 'JOB',
      title: this.formModel.title || 'Nouvelle opportunité',
      location: this.formModel.location || 'Dakar',
      recruiter: this.formModel.recruiter || 'Orange Digital Center',
      type: this.formModel.type,
      date: '2 oct. 2026',
      status: this.formModel.publishImmediately ? 'Publié' : 'À valider'
    };

    this.opportunites.unshift(newEntry);
    this.isModalOpen = false;

    // Affichage de l'alerte de succès comme sur la maquette
    this.successMessage = "L'opportunité est maintenant visible.";
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }

  toggleMenu(item: Opportunite, event: Event): void {
    event.stopPropagation();
    this.opportunites.forEach(o => { if (o !== item) o.showMenu = false; });
    item.showMenu = !item.showMenu;
  }
}