import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-detail-projet-apprenant',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './detail-projet.html',
  styleUrls: ['./detail-projet.css']
})
export class DetailProjetApprenant implements OnInit {
  projetId!: number;
  projet: any = {
    titre: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: ''
  };

  private apiUrl = 'http://localhost:8080/api/v1/projets';

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
        this.projetId = +id;
        this.chargerProjet();
      }
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerProjet(): void {
    this.http.get<any>(`${this.apiUrl}/${this.projetId}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.projet = data || {};
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement projet :", err);
        alert("Impossible de charger le projet.");
        this.router.navigate(['/apprenant/projets']);
      }
    });
  }

  // 💾 Enregistrer les modifications (PUT)
  modifierProjet(): void {
    this.http.put<any>(`${this.apiUrl}/${this.projetId}`, this.projet, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert("Projet mis à jour avec succès !");
        this.router.navigate(['/apprenant/projets']);
      },
      error: (err) => {
        alert("Erreur lors de la modification : " + (err.error?.message || err.message));
      }
    });
  }

  // 🗑️ Supprimer le projet (DELETE)
  supprimerProjet(): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      this.http.delete(`${this.apiUrl}/${this.projetId}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          alert("Projet supprimé.");
          this.router.navigate(['/apprenant/projets']);
        },
        error: (err) => alert("Erreur lors de la suppression.")
      });
    }
  }

  getTechIcon(techno: string): string {
    if (!techno) return '/icones/code.png';
    const t = techno.toLowerCase();
    if (t.includes('angular')) return '/icones/angular.png';
    if (t.includes('react')) return '/icones/react.png';
    if (t.includes('flutter') || t.includes('dart')) return '/icones/flutter.png';
    if (t.includes('java') || t.includes('spring')) return '/icones/java.png';
    return '/icones/code.png';
  }
}