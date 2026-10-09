import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProjetModeration {
  id: number;
  badge: string;
  title: string;
  description: string;
  apprenant: string;
  date: string;
  status: 'En attente' | 'Validé' | 'À corriger';
  type: string;
  showMenu?: boolean;
}

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderation.html',
  styleUrls: ['./moderation.css']
})
export class ModerationComponent implements OnInit {
  searchTerm: string = '';
  selectedStatus: string = 'Tous les statuts';
  selectedCategory: string = 'Toutes catégories';
  selectedSort: string = 'Trier : plus récent';

  stats = {
    aExaminer: 24,
    validesMois: 118,
    refusesMois: 9,
    tempsTraitement: '1h 42 min'
  };

  projets: ProjetModeration[] = [
    { id: 1, badge: 'UI', title: 'ODC Learning', description: 'Plateforme e-learning', apprenant: 'Fatoumata Traoré', date: '21 sept. 2026', status: 'En attente', type: 'Web' },
    { id: 2, badge: 'APP', title: 'Green Market', description: 'Application mobile', apprenant: 'Moussa Diarra', date: '20 sept. 2026', status: 'En attente', type: 'Mobile' },
    { id: 3, badge: 'DATA', title: 'Analyse des talents', description: 'Tableau de bord data', apprenant: 'Aminata Coulibaly', date: '19 sept. 2026', status: 'Validé', type: 'Data' },
    { id: 4, badge: 'WEB', title: 'JobConnect', description: 'Plateforme de recrutement', apprenant: 'Ibrahim Keita', date: '18 sept. 2026', status: 'À corriger', type: 'Web' }
  ];

  ngOnInit(): void {
    // Connexion future avec le service Spring Boot de modération
  }

  toggleMenu(projet: ProjetModeration, event: Event): void {
    event.stopPropagation();
    this.projets.forEach(p => { if (p !== projet) p.showMenu = false; });
    projet.showMenu = !projet.showMenu;
  }
}