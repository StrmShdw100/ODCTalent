import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-evolution-pro',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './evolution-pro.html',
  styleUrls: ['./evolution-pro.css']
})
export class EvolutionProApprenant implements OnInit {
  historique: any[] = [];
  modalOuverte = false;

  nouvelleEvolution = {
    poste: '',
    entreprise: '',
    statutEmploi: 'CDI',
    localisation: '',
    dateDebut: '',
    dateFin: null as string | null
  };

  private apiUrl = 'http://localhost:8080/api/v1/suivi';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerHistorique();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerHistorique(): void {
    this.http.get<any[]>(`${this.apiUrl}/me`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.historique = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur chargement historique pro :", err)
    });
  }

  // 🚀 Redirection vers la page dédiée de modification
  allerVersDetail(id: number): void {
    this.router.navigate(['/apprenant/evolution-pro', id]);
  }

  ouvrirModal(): void { this.modalOuverte = true; }
  
  fermerModal(): void {
    this.modalOuverte = false;
    this.nouvelleEvolution = { poste: '', entreprise: '', statutEmploi: 'CDI', localisation: '', dateDebut: '', dateFin: null };
  }

  ajouterEvolution(): void {
    if (!this.nouvelleEvolution.poste || !this.nouvelleEvolution.entreprise || !this.nouvelleEvolution.dateDebut) {
      alert("Veuillez remplir les champs obligatoires (Poste, Entreprise, Date de début).");
      return;
    }

    // 🛑 Validation : Date de fin ne doit pas être antérieure à la date de début
    if (this.nouvelleEvolution.dateFin && new Date(this.nouvelleEvolution.dateFin) < new Date(this.nouvelleEvolution.dateDebut)) {
      alert("La date de fin ne peut pas être antérieure à la date de début.");
      return;
    }

    this.http.post<any>(`${this.apiUrl}/me`, this.nouvelleEvolution, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.fermerModal();
        this.chargerHistorique();
        alert("Expérience professionnelle ajoutée avec succès !");
      },
      error: (err) => alert("Erreur lors de l'ajout de l'expérience.")
    });
  }

  getStatutClass(statut: string): string {
    if (!statut) return 'statut-defaut';
    const s = statut.toUpperCase();
    if (s.includes('CDI')) return 'statut-cdi';
    if (s.includes('CDD')) return 'statut-cdd';
    if (s.includes('FREELANCE') || s.includes('ENTREPRENEUR')) return 'statut-freelance';
    if (s.includes('FORMATION')) return 'statut-formation';
    return 'statut-defaut';
  }
}