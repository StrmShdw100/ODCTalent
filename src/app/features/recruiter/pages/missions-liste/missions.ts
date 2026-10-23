import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

   nouvelleMission = {
    titre: '',
    typeContrat: 'CDI',
    lieu: '',
    nombrePostes: 1,
    dateLimite: '',
    competencesRequises: '',
    description: '',
    budget: 0,
    statut: 'DISPONIBLE'
  };

  private apiUrl = 'http://localhost:8080/api/v1/missions';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  ouvrirModal() {
    this.modalOuverte = true;
  }

  fermerModal() {
    this.modalOuverte = false;
  }

  publierMission() {
    this.http.post<MissionResponse>(this.apiUrl, this.nouvelleMission, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          this.modalOuverte = false;
          this.succesOuvert = true;
          this.chargerMissions();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la mission :', err);
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
}