import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService, MissionResponse, MissionRequest } from './mission.service';

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

  isModalOpen: boolean = false;
  successMessage: string | null = null;

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

  stats = {
    actives: 0,
    nouvelles: 0,
    enAttente: 0,
    recruteursActifs: 86,
    candidatures: 214
  };

  opportunites: Opportunite[] = [];

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.chargerMissions();
  }

  // Charger les missions depuis le backend Spring Boot
  chargerMissions(): void {
    this.missionService.getAllMissions().subscribe({
      next: (data: MissionResponse[]) => {
        this.opportunites = data.map(m => ({
          id: m.id,
          badge: m.titre?.toLowerCase().includes('stage') ? 'STG' : 'JOB',
          title: m.titre,
          location: 'Dakar • Hybride',
          recruiter: m.nomRecruteur && m.prenomRecruteur ? `${m.prenomRecruteur} ${m.nomRecruteur}` : 'Recruteur ODC',
          type: 'Recrutement',
          date: m.datePublication ? new Date(m.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Récemment',
          status: m.statut === 'DISPONIBLE' ? 'Publié' : 'À valider'
        }));

        this.stats.actives = this.opportunites.length;
        this.stats.nouvelles = this.opportunites.filter(o => o.status === 'Publié').length;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des opportunités :", err);
      }
    });
  }

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

  // Soumission d'une nouvelle opportunité via l'API
  submitOpportunite(): void {
    const request: MissionRequest = {
      titre: this.formModel.title,
      description: this.formModel.description,
      competencesRequises: this.formModel.skills,
      statut: this.formModel.publishImmediately ? 'DISPONIBLE' : 'EN_ATTENTE'
    };

    this.missionService.createMission(request).subscribe({
      next: () => {
        this.isModalOpen = false;
        this.successMessage = "L'opportunité est maintenant visible.";
        this.chargerMissions(); // Recharger la liste depuis le backend
        setTimeout(() => {
          this.successMessage = null;
        }, 4000);
      },
      error: (err) => {
        console.error("Erreur lors de la création :", err);
        alert("Impossible de publier cette opportunité. Vérifiez que vous êtes connecté en tant que recruteur.");
      }
    });
  }

  // Supprimer une opportunité
  supprimerOpportunite(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette opportunité ?")) {
      this.missionService.deleteMission(id).subscribe({
        next: () => {
          this.chargerMissions();
        },
        error: (err) => {
          console.error("Erreur lors de la suppression :", err);
        }
      });
    }
  }

  toggleMenu(item: Opportunite, event: Event): void {
    event.stopPropagation();
    this.opportunites.forEach(o => { if (o !== item) o.showMenu = false; });
    item.showMenu = !item.showMenu;
  }
}