import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './candidature-detail.html',
  styleUrls: ['./candidature-detail.css']
})
export class CandidatureDetail implements OnInit {
  candidatureId!: number;
  candidature: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  // États des modales et champs de saisie
  modalValidationOuverte = false;
  modalRefusOuverte = false;
  commentaireInterne: string = 'Profil validé après entretien. Compétences adaptées au poste.';
  motifRefus: string = '';

  private baseUrl = 'http://localhost:8080/api/v1/candidatures';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.candidatureId = Number(idParam);
      this.chargerDetailCandidature();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerDetailCandidature(): void {
    this.isLoading = true;
    // On récupère toutes les candidatures du recruteur ou un endpoint dédié par ID si existant. 
    // Ici on utilise getCandidaturesForRecruteur pour filtrer par ID de candidature.
    this.http.get<any[]>(`${this.baseUrl}/recruteur`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.candidature = (data || []).find(c => c.id === this.candidatureId);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement détail candidature :", err);
        this.errorMessage = "Impossible de récupérer les informations de cette candidature.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ouvrirValidation() { this.modalValidationOuverte = true; }
  fermerValidation() { this.modalValidationOuverte = false; }

  ouvrirRefus() { this.modalRefusOuverte = true; }
  fermerRefus() { this.modalRefusOuverte = false; }

  // Action pour valider la candidature (statut ACCEPTEE)
  validerCandidature(): void {
    this.changerStatut('ACCEPTEE');
  }

  // Action pour refuser la candidature (statut REFUSEE)
  refuserCandidature(): void {
    this.changerStatut('REFUSEE');
  }

  private changerStatut(nouveauStatut: string): void {
    this.http.patch(`${this.baseUrl}/${this.candidatureId}/statut?statut=${nouveauStatut}`, {}, { headers: this.getHeaders() }).subscribe({
      next: (updated: any) => {
        this.candidature.statut = updated.statut;
        this.fermerValidation();
        this.fermerRefus();
        this.cdr.detectChanges();
        alert(`La candidature a été mise à jour avec succès : ${nouveauStatut}`);
      },
      error: (err) => {
        console.error("Erreur modification statut :", err);
        alert("Une erreur est survenue lors de la mise à jour du statut.");
      }
    });
  }

  get initiales(): string {
    if (!this.candidature || !this.candidature.prenomApprenant) return 'CN';
    return (this.candidature.prenomApprenant.charAt(0) + this.candidature.nomApprenant.charAt(0)).toUpperCase();
  }
}