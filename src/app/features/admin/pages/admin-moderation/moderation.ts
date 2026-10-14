import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModerationService, ProjetModeration } from './moderation.service';

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

  projets: ProjetModeration[] = [];

  stats = {
    aExaminer: 0,
    validesMois: 0,
    refusesMois: 0,
    tempsTraitement: 'Calcul...'
  };

  constructor(
    private moderationService: ModerationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerProjets();
    this.chargerStats();
  }

  chargerProjets(): void {
    this.moderationService.getProjetsModeration().subscribe({
      next: (data) => {
        this.projets = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des projets à modérer :", err);
        this.cdr.detectChanges();
      }
    });
  }

  chargerStats(): void {
    this.moderationService.getModerationStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des stats de modération :", err);
      }
    });
  }

  changerStatut(projet: ProjetModeration, nouveauStatut: 'Validé' | 'À corriger' | 'En attente'): void {
    this.moderationService.changerStatutProjet(projet.id, nouveauStatut).subscribe({
      next: () => {
        projet.status = nouveauStatut;
        projet.showMenu = false;
        this.chargerStats();
        this.chargerProjets();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du statut :", err);
        alert("Impossible de modifier le statut du projet.");
      }
    });
  }

  toggleMenu(projet: ProjetModeration, event: Event): void {
    event.stopPropagation();
    this.projets.forEach(p => { if (p !== projet) p.showMenu = false; });
    projet.showMenu = !projet.showMenu;
  }

  get filteredProjets(): ProjetModeration[] {
    return this.projets.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.apprenant.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'Tous les statuts' || 
        item.status === this.selectedStatus;
      
      const matchesCategory = this.selectedCategory === 'Toutes catégories' || 
        item.type === this.selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }
}