import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MissionResponse } from './mission.model';
import { MissionService } from './mission.service';

@Component({
  selector: 'app-opportunites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opportunites.component.html',
  styleUrls: ['./opportunites.component.css']
})
export class OpportunitesComponent implements OnInit {
  activeTab: 'recrutement' | 'freelance' = 'recrutement';
  searchQuery: string = '';

  missions: MissionResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private missionService: MissionService
  ) {}

  ngOnInit(): void {
    this.loadMissions();
  }

  loadMissions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.missionService.getAllMissions().subscribe({
      next: (data) => {
        this.missions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('Erreur lors du chargement des missions :', err);
        this.errorMessage = "Impossible de récupérer les opportunités depuis le serveur.";
        this.isLoading = false;
      }
    });
  }

  get filteredMissions(): MissionResponse[] {
    return this.missions.filter(mission => {
      // Logique de séparation entre Recrutement et Freelance (ex: basé sur la présence d'un budget ou autre critère)
      const isFreelance = mission.budget !== null && mission.budget !== undefined && mission.budget > 0;
      const matchesTab = this.activeTab === 'freelance' ? isFreelance : !isFreelance;

      const matchesSearch = this.searchQuery.trim() === '' || 
        mission.titre?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        mission.competencesRequises?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        mission.nomRecruteur?.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }

  switchTab(tab: 'recrutement' | 'freelance'): void {
    this.activeTab = tab;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  viewDetails(id: number): void {
  this.router.navigate(['/apprenant/opportunites', id]);
}
}