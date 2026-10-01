import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Actualite {
  id: number;
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
 class ActualitesComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Toutes les catégories';
  selectedStatus: string = 'Tous les statuts';

  // Données mockées correspondant fidèlement à la maquette
  actualites: Actualite[] = [
    { id: 1, badge: 'ODC', title: 'Cérémonie de graduation 2026', description: 'Célébration de la nouvelle promotion', category: 'Événement', date: '20 sept. 2026', status: 'Publié', author: 'Awa Koné' },
    { id: 2, badge: 'JOB', title: 'Nouvelle offre de recrutement', description: 'Les entreprises recrutent nos talents', category: 'Recrutement', date: '18 sept. 2026', status: 'Publié', author: 'Modibo Fomba' },
    { id: 3, badge: 'FORM', title: 'Canditateur de l\'APEJ', description: 'Les inscriptions sont maintenant ouvertes', category: 'Formation', date: '15 sept. 2026', status: 'Brouillon', author: 'Modibo Fomba' },
    { id: 4, badge: 'ODC', title: 'Orange Digital Center', description: 'Les moments forts de la semaine', category: 'Annonce', date: '12 sept. 2026', status: 'Publié', author: 'Admin' },
    { id: 5, badge: 'ODC', title: 'Offrre de Freelance talent', description: 'Un parcours inspirant après la formation', category: 'Freelance', date: '10 sept. 2026', status: 'Publié', author: 'Adama Sow' }
  ];

  ngOnInit(): void {
    // Ici, tu appelleras ton service Spring Boot pour récupérer la liste réelle :
    // this.actualiteService.getAll().subscribe(data => this.actualites = data);
  }

  toggleMenu(item: Actualite, event: Event): void {
    event.stopPropagation();
    // Ferme les autres menus et bascule celui-ci
    this.actualites.forEach(a => { if (a !== item) a.showMenu = false; });
    item.showMenu = !item.showMenu;
  }

  onAction(action: string, item: Actualite): void {
    console.log(`Action ${action} sur l'actualité :`, item.title);
    item.showMenu = false;
  }
}