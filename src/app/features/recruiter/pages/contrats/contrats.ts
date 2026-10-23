import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

export interface Contrat {
  id: number;
  dateCreation: string;
  dateSignature?: string;
  statut: string;
  termesEtConditions: string;
  candidature?: {
    id: number;
    tarifPropose?: number;
    mission?: { titre?: string };
    apprenant?: { nom?: string; prenom?: string; formation?: string };
  };
}

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './contrats.html',
  styleUrls: ['./contrats.css']
})
export class Contrats implements OnInit {
  modalCreationOuverte = false;
  modalSuccesOuverte = false;

  contrats: Contrat[] = [];

  nouveauContrat = {
    candidatureId: null,
    termesEtConditions: ''
  };

  private apiUrl = 'http://localhost:8080/api/v1/contrats';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.chargerContrats();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerContrats(): void {
    this.http.get<Contrat[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.contrats = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement contrats :", err);
      }
    });
  }

  ouvrirCreation() { 
    this.modalCreationOuverte = true; 
  }

  fermerCreation() { 
    this.modalCreationOuverte = false; 
  }

  creerContrat() {
    this.http.post<any>(this.apiUrl, this.nouveauContrat, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.modalCreationOuverte = false;
        this.modalSuccesOuverte = true;
        this.chargerContrats();
        this.nouveauContrat = { candidatureId: null, termesEtConditions: '' };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de la création du contrat :", err);
        const errorMsg = err.error?.message || err.message || "Erreur technique inconnue";
        alert("Impossible de créer le contrat : " + errorMsg);
      }
    });
  }

  fermerSucces() { 
    this.modalSuccesOuverte = false; 
  }
}