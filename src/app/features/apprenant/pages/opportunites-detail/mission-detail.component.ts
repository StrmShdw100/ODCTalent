import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MissionResponse } from '../opportunites/mission.model';
import { MissionService } from '../opportunites/mission.service';

@Component({
  selector: 'app-mission-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.css']
})
export class MissionDetailComponent implements OnInit {
  mission: MissionResponse | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isApplied: boolean = false; 

  private candidatureUrl = 'http://localhost:8080/api/v1/candidatures';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private missionService: MissionService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const missionId = Number(this.route.snapshot.paramMap.get('id'));
    if (missionId) {
      this.loadMissionDetails(missionId);
    }
  }

  loadMissionDetails(id: number): void {
    this.isLoading = true;
    this.missionService.getMissionById(id).subscribe({
      next: (data) => {
        this.mission = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Erreur chargement détail mission :', err);
        this.errorMessage = "Impossible de charger les détails de cette opportunité.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  applyToMission(): void {
    if (this.isApplied || !this.mission) return; 

    const payload = {
      missionId: this.mission.id,
      lettreMotivation: "Candidature envoyée depuis l'espace apprenant ODC.",
      tarifPropose: this.mission.budget || 0
    };

    this.http.post<any>(this.candidatureUrl, payload, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.isApplied = true;
        const typeOffre = (this.mission?.budget && this.mission.budget > 0) ? "Freelance & Missions" : "Recrutement & Stages";
        this.successMessage = `🚀 Candidature transmise avec succès ! Offre de type : [${typeOffre}]. Une notification vous a été envoyée.`;
        this.cdr.detectChanges();

        // Redirection vers les opportunités après 3.5 secondes
        setTimeout(() => {
          this.router.navigate(['/apprenant/opportunites']);
        }, 3500);
      },
      error: (err) => {
        console.error("Erreur lors de la postulation :", err);
        this.errorMessage = err.error?.message || "Vous avez déjà postulé à cette mission ou une erreur est survenue.";
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/apprenant/opportunites']);
  }
}