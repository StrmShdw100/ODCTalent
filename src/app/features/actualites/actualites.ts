import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Actualite {
  id?: number;
  badge: string;
  title: string;
  description: string;
  category: string;
  date: string;
  status: 'Publié' | 'Brouillon';
  author: string;
  showMenu?: boolean;
}

@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualites.html',
  styleUrls: ['./actualites.css']
})
export class ActualitesComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Toutes les catégories';
  selectedStatus: string = 'Tous les statuts';

  // Gestion de la modale et du succès
  isModalOpen: boolean = false;
  successMessage: string | null = null;

  // Modèle du formulaire d'ajout
  formModel = {
    title: '',
    category: '',
    publicationDate: '',
    description: '',
    status: 'Publié' as 'Publié' | 'Brouillon'
  };

  actualites: Actualite[] = [
    { id: 1, badge: 'ODC', title: 'Cérémonie de graduation 2026', description: 'Célébration de la nouvelle promotion', category: 'Événement', date: '20 sept. 2026', status: 'Publié', author: 'Awa Koné' },
    { id: 2, badge: 'JOB', title: 'Nouvelle offre de recrutement', description: 'Les entreprises recrutent nos talents', category: 'Recrutement', date: '18 sept. 2026', status: 'Publié', author: 'Admin' },
    { id: 3, badge: 'FORM', title: 'Canditateur de l\'APEJ', description: 'Les inscriptions sont maintenant ouvertes', category: 'Formation', date: '15 sept. 2026', status: 'Brouillon', author: 'Modibo Fomba' },
    { id: 4, badge: 'ODC', title: 'Orange Digital Center', description: 'Les moments forts de la semaine', category: 'Annonce', date: '12 sept. 2026', status: 'Publié', author: 'Admin' },
    { id: 5, badge: 'ODC', title: 'Offrre de Freelance talent', description: 'Un parcours inspirant après la formation', category: 'Freelance', date: '10 sept. 2026', status: 'Publié', author: 'Adama Sow' }
  ];

  ngOnInit(): void {}

  openAddModal(): void {
    this.isModalOpen = true;
    this.formModel = { title: '', category: '', publicationDate: '', description: '', status: 'Publié' };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitActualite(): void {
    // Ici, tu appelleras ton service Spring Boot pour enregistrer en base :
    // this.actualiteService.create(this.formModel).subscribe(...)

    // Simulation de l'ajout local et affichage du succès
    const newEntry: Actualite = {
      id: this.actualites.length + 1,
      badge: 'ODC',
      title: this.formModel.title,
      description: this.formModel.description,
      category: this.formModel.category || 'Annonce',
      date: '2 Oct. 2026',
      status: this.formModel.status,
      author: 'Fatoumata Kaloga'
    };

    this.actualites.unshift(newEntry);
    this.isModalOpen = false;

    // Affichage de l'alerte de succès comme sur l'écran
    this.successMessage = "Actualité publiée avec succès. L'opportunité est maintenant visible.";
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }

  toggleMenu(item: Actualite, event: Event): void {
    event.stopPropagation();
    this.actualites.forEach(a => { if (a !== item) a.showMenu = false; });
    item.showMenu = !item.showMenu;
  }
}