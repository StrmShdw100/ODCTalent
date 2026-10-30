import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-detail-evolution',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './detail-evolution.html',
  styleUrls: ['./detail-evolution.css']
})
export class DetailEvolutionApprenant implements OnInit {
  evolutionId!: number;
  evolution: any = {
    poste: '',
    entreprise: '',
    statutEmploi: 'CDI',
    localisation: '',
    dateDebut: '',
    dateFin: null
  };

  private apiUrl = 'http://localhost:8080/api/v1/suivi';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.evolutionId = +id;
        this.chargerEvolution();
      }
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerEvolution(): void {
    this.http.get<any[]>(`${this.apiUrl}/me`, { headers: this.getHeaders() }).subscribe({
      next: (liste) => {
        const trouve = liste.find(e => e.id === this.evolutionId);
        if (trouve) {
          this.evolution = trouve;
          this.cdr.detectChanges();
        } else {
          alert("Expérience introuvable.");
          this.router.navigate(['/apprenant/evolution-pro']);
        }
      },
      error: (err) => console.error("Erreur de chargement :", err)
    });
  }

  modifierEvolution(): void {
    if (!this.evolution.poste || !this.evolution.entreprise || !this.evolution.dateDebut) {
      alert("Veuillez remplir les champs obligatoires (Poste, Entreprise, Date de début).");
      return;
    }

    // 🛑 Validation : Date de fin >= Date de début
    if (this.evolution.dateFin && new Date(this.evolution.dateFin) < new Date(this.evolution.dateDebut)) {
      alert("La date de fin ne peut pas être antérieure à la date de début.");
      return;
    }

    this.http.post<any>(`${this.apiUrl}/me`, this.evolution, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert("Expérience mise à jour avec succès !");
        this.router.navigate(['/apprenant/evolution-pro']);
      },
      error: (err) => alert("Erreur lors de la modification.")
    });
  }

  supprimerEvolution(): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette étape professionnelle ?")) {
      this.http.delete(`${this.apiUrl}/${this.evolutionId}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          alert("Expérience supprimée.");
          this.router.navigate(['/apprenant/evolution-pro']);
        },
        error: (err) => alert("Erreur lors de la suppression.")
      });
    }
  }
}