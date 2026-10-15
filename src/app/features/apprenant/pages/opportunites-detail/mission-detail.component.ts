import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionResponse } from '../opportunites/mission.model';
import { MissionService } from '../opportunites/mission.service';


@Component({
  selector: 'app-mission-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.css']
})
export class MissionDetailComponent implements OnInit {
  mission: MissionResponse | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private missionService: MissionService
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
      },
      error: (err) => {
        console.warn('Erreur chargement détail mission :', err);
        this.errorMessage = "Impossible de charger les détails de cette opportunité.";
        this.isLoading = false;
      }
    });
  }

  applyToMission(): void {
    // Logique de postulation (appel à un service de candidature si disponible)
    this.successMessage = "Votre candidature a été envoyée avec succès !";
    setTimeout(() => {
      this.router.navigate(['/apprenant/opportunites']);
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/apprenant/opportunites']);
  }
}