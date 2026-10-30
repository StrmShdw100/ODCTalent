import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-opportunites',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './opportunites.component.html',
  styleUrls: ['./opportunites.component.css']
})
export class OpportunitesComponent implements OnInit {
  activeTab: 'recrutement' | 'freelance' = 'recrutement';
  searchQuery: string = '';

  missions: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  private apiUrl = 'http://localhost:8080/api/v1/missions';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMissions();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadMissions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.missions = data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Erreur lors du chargement des missions :', err);
        this.errorMessage = "Impossible de récupérer les opportunités depuis le serveur.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredMissions(): any[] {
    return this.missions.filter(mission => {
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
    this.cdr.detectChanges();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/apprenant/opportunites', id]);
  }
}