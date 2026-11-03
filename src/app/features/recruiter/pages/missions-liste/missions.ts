import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

export interface MissionResponse {
  id: number;
  titre: string;
  description: string;
  budget: number;
  competencesRequises: string;
  statut: string;
  datePublication: string;
}

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './missions.html',
  styleUrls: ['./missions.css']
})
export class Missions implements OnInit {
  missions: MissionResponse[] = [];
  modalOuverte = false;
  succesOuvert = false;
  modeEdition = false;
  missionEnEditionId: number | null = null;

  nouvelleMission = {
    titre: '',
    description: '',
    competencesRequises: '',
    budget: 0,
    statut: 'DISPONIBLE'
  };

  private readonly apiUrl = `${environment.apiUrl}/missions`;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;
    if (path === 'missions/create') {
      this.ouvrirModal();
    }
    this.chargerMissions();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerMissions(): void {
    this.http.get<MissionResponse[]>(this.apiUrl, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.missions = data || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des missions :', err);
        }
      });
  }

  ouvrirModal(mission?: MissionResponse) {
    this.modeEdition = !!mission;
    this.missionEnEditionId = mission?.id ?? null;
    this.nouvelleMission = {
      titre: mission?.titre || '',
      description: mission?.description || '',
      competencesRequises: mission?.competencesRequises || '',
      budget: mission?.budget ?? 0,
      statut: mission?.statut || 'DISPONIBLE'
    };
    this.modalOuverte = true;
  }

  fermerModal() {
    this.modalOuverte = false;
    this.modeEdition = false;
    this.missionEnEditionId = null;
    this.nouvelleMission = {
      titre: '',
      description: '',
      competencesRequises: '',
      budget: 0,
      statut: 'DISPONIBLE'
    };
  }

  publierMission() {
    if (!this.nouvelleMission.titre?.trim() || !this.nouvelleMission.description?.trim() || !this.nouvelleMission.competencesRequises?.trim()) {
      alert('Veuillez remplir le titre, la description et les compétences demandées.');
      return;
    }

    const payload = {
      titre: this.nouvelleMission.titre.trim(),
      description: this.nouvelleMission.description.trim(),
      competencesRequises: this.nouvelleMission.competencesRequises.trim(),
      budget: Number(this.nouvelleMission.budget) || 0,
      statut: this.nouvelleMission.statut
    };

    const request$ = this.modeEdition && this.missionEnEditionId
      ? this.http.put<MissionResponse>(`${this.apiUrl}/${this.missionEnEditionId}`, payload, { headers: this.getHeaders() })
      : this.http.post<MissionResponse>(this.apiUrl, payload, { headers: this.getHeaders() });

    request$.subscribe({
      next: () => {
        this.modalOuverte = false;
        this.succesOuvert = true;
        this.fermerModal();
        this.router.navigate(['/recruteur/missions']);
        this.chargerMissions();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde de la mission :', err);
        alert('La mission n’a pas pu être enregistrée. Vérifiez votre session et réessayez.');
      }
    });
  }

  changerStatutMission(mission: MissionResponse): void {
    const nouveauStatut = mission.statut === 'DISPONIBLE' ? 'BROUILLON' : 'DISPONIBLE';
    this.http.put<MissionResponse>(`${this.apiUrl}/${mission.id}`, {
      titre: mission.titre,
      description: mission.description,
      competencesRequises: mission.competencesRequises,
      budget: mission.budget,
      statut: nouveauStatut
    }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.chargerMissions();
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut :', err);
      }
    });
  }

  supprimerMission(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette mission ?')) {
      return;
    }

    this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.chargerMissions();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
      }
    });
  }

  fermerSucces() {
    this.succesOuvert = false;
  }

  get totalMissions(): number {
    return this.missions.length;
  }

  get missionsPubliees(): number {
    return this.missions.filter(m => m.statut === 'PUBLIEE' || m.statut === 'DISPONIBLE').length;
  }

  get brouillons(): number {
    return this.missions.filter(m => m.statut === 'BROUILLON').length;
  }

  get enPause(): number {
    return this.missions.filter(m => m.statut === 'PAUSE' || m.statut === 'EN_PAUSE').length;
  }

  getClasseStatut(statut: string): string {
    switch ((statut || '').toUpperCase()) {
      case 'DISPONIBLE':
      case 'PUBLIEE':
        return 'publiee';
      case 'BROUILLON':
        return 'brouillon';
      case 'PAUSE':
      case 'EN_PAUSE':
        return 'pause';
      default:
        return 'brouillon';
    }
  }

  getLibelleStatut(statut: string): string {
    switch ((statut || '').toUpperCase()) {
      case 'DISPONIBLE':
      case 'PUBLIEE':
        return 'Publiée';
      case 'BROUILLON':
        return 'Brouillon';
      case 'PAUSE':
      case 'EN_PAUSE':
        return 'En pause';
      default:
        return 'Brouillon';
    }
  }
}