import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService, MissionResponse, MissionRequest } from './mission.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Opportunite {
  id: number;
  badge: string;
  title: string;
  location: string;
  recruiter: string;
  type: string;
  date: string;
  status: 'Publié' | 'Masqué' | 'À valider';
  rawStatus: string;
  showMenu?: boolean;
}

export interface AdminRecruteur {
  id: number;
  nom: string;
  prenom?: string;
  email: string;
  nomEntreprise?: string;
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

  // Liste dynamique des recruteurs
  recruteursDisponibles: AdminRecruteur[] = [];
  selectedRecruteurId: number | null = null;

  formModel = {
    title: '',
    recruiterId: null as number | null,
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
    recruteursActifs: 0,
    candidatures: 0
  };

  opportunites: Opportunite[] = [];

  constructor(
    private missionService: MissionService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerMissions();
    this.chargerStatsGlobales();
    this.chargerRecruteursDisponibles();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerRecruteursDisponibles(): void {
    this.http.get<AdminRecruteur[]>('http://localhost:8080/api/v1/admin/recruteurs', { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.recruteursDisponibles = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Erreur lors du chargement des recruteurs :", err);
        }
      });
  }

  chargerStatsGlobales(): void {
    this.missionService.getOpportunitesStats().subscribe({
      next: (data) => {
        this.stats.recruteursActifs = data.recruteursActifs;
        this.stats.candidatures = data.candidatures;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des statistiques globales :", err);
      }
    });
  }

  chargerMissions(): void {
    this.missionService.getAllMissions().subscribe({
      next: (data: MissionResponse[]) => {
        this.opportunites = data.map(m => {
          let mappedStatus: 'Publié' | 'Masqué' | 'À valider' = 'Publié';
          if (m.statut === 'EN_ATTENTE') mappedStatus = 'À valider';
          else if (m.statut === 'MASQUE') mappedStatus = 'Masqué';
          else if (m.statut === 'DISPONIBLE' || m.statut === 'Publié') mappedStatus = 'Publié';

          return {
            id: m.id,
            badge: m.titre?.toLowerCase().includes('stage') ? 'STG' : 'JOB',
            title: m.titre,
            location: 'Dakar • Hybride',
            recruiter: m.nomRecruteur && m.prenomRecruteur 
              ? `${m.prenomRecruteur} ${m.nomRecruteur}` 
              : 'Partenaire ODC',
            type: 'Recrutement',
            date: m.datePublication ? new Date(m.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Récemment',
            status: mappedStatus,
            rawStatus: m.statut
          };
        });

        this.calculerStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des opportunités :", err);
        this.cdr.detectChanges();
      }
    });
  }

  calculerStats(): void {
    this.stats.actives = this.opportunites.filter(o => o.status === 'Publié').length;
    this.stats.nouvelles = this.opportunites.length;
    this.stats.enAttente = this.opportunites.filter(o => o.status === 'À valider').length;
  }

  openAddModal(): void {
    this.isModalOpen = true;
    this.formModel = {
      title: '',
      recruiterId: null,
      type: 'Recrutement',
      location: '',
      deadline: '',
      description: '',
      skills: '',
      documentUrl: '',
      publishImmediately: true
    };
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  submitOpportunite(): void {
    if (!this.formModel.title || !this.formModel.description) {
      alert("Veuillez renseigner le titre et la description de l'opportunité.");
      return;
    }

    const request: MissionRequest = {
      titre: this.formModel.title,
      description: this.formModel.description,
      competencesRequises: this.formModel.skills,
      statut: this.formModel.publishImmediately ? 'DISPONIBLE' : 'EN_ATTENTE'
    };

    this.missionService.createMission(request, this.formModel.recruiterId || undefined).subscribe({
      next: () => {
        this.isModalOpen = false;
        this.successMessage = "L'opportunité a été enregistrée et publiée avec succès.";
        this.chargerMissions();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        console.error("Erreur lors de la création :", err);
        alert("Impossible de publier cette opportunité.");
      }
    });
  }

  changerStatut(item: Opportunite, nouveauStatutApi: string, statutVisuel: 'Publié' | 'Masqué' | 'À valider'): void {
    this.missionService.updateMissionStatus(item.id, nouveauStatutApi).subscribe({
      next: () => {
        item.status = statutVisuel;
        item.rawStatus = nouveauStatutApi;
        item.showMenu = false;
        this.calculerStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de la modification du statut :", err);
      }
    });
  }

  supprimerOpportunite(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette opportunité ?")) {
      this.missionService.deleteMission(id).subscribe({
        next: () => {
          this.opportunites = this.opportunites.filter(o => o.id !== id);
          this.calculerStats();
          this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  get filteredOpportunites(): Opportunite[] {
    return this.opportunites.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.recruiter.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = this.selectedType === "Type d'opportunité" || 
        item.type === this.selectedType;

      const matchesStatus = this.selectedStatus === 'Statut' || 
        item.status === this.selectedStatus;

      const matchesRecruiter = this.selectedRecruiter === 'Recruteur' || 
        item.recruiter === this.selectedRecruiter;

      return matchesSearch && matchesType && matchesStatus && matchesRecruiter;
    });
  }
}