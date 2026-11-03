import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModerationService, ProjetModeration, ModerationStats } from './moderation.service';

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

  stats: ModerationStats = {
    total: 0,
    aExaminer: 0,
    validesMois: 0,
    refusesMois: 0,
    tempsTraitement: 'Calcul...'
  };

  constructor(
    private moderationService: ModerationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerProjets();
    this.chargerStats();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    let changed = false;
    this.projets.forEach(p => {
      if (p.showMenu) {
        p.showMenu = false;
        changed = true;
      }
    });
    if (changed) {
      this.cdr.detectChanges();
    }
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

  toutValider(): void {
    if (confirm("Voulez-vous vraiment valider tous les projets en attente d'un seul coup ?")) {
      this.moderationService.validerTousLesProjets().subscribe({
        next: () => {
          this.chargerProjets();
          this.chargerStats();
          this.cdr.detectChanges();
          alert("Tous les projets ont été validés avec succès !");
        },
        error: (err) => {
          console.error("Erreur lors de la validation globale :", err);
          alert("Impossible de valider tous les projets.");
        }
      });
    }
  }

  toggleMenu(projet: ProjetModeration, event: Event): void {
    event.stopPropagation(); // Empêche l'événement de remonter au document
    this.projets.forEach(p => { if (p !== projet) p.showMenu = false; });
    projet.showMenu = !projet.showMenu;
    this.cdr.detectChanges(); // 🚀 Force le rendu immédiat
  }

  ouvrirDetail(id: number): void {
    this.router.navigate(['/admin/projets', id]);
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