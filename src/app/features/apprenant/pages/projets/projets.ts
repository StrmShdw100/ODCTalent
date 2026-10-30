import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router'; // <-- Importer Router

@Component({
  selector: 'app-projets-apprenant',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './projets.html',
  styleUrls: ['./projets.css']
})
export class ProjetsApprenant implements OnInit {
  projets: any[] = [];
  modalOuverte = false;

  nouveauProjet = {
    titre: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: ''
  };

  private apiUrl = 'http://localhost:8080/api/v1/projets';

  constructor(
    private http: HttpClient,
    private router: Router, // <-- Injecter le Router
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerProjets();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  chargerProjets(): void {
    this.http.get<any[]>(`${this.apiUrl}/me`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.projets = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur chargement projets :", err)
    });
  }

  ouvrirModal(): void { this.modalOuverte = true; }
  fermerModal(): void { 
    this.modalOuverte = false; 
    this.nouveauProjet = { titre: '', description: '', technologies: '', imageUrl: '', githubUrl: '', demoUrl: '' }; 
  }

  // 🚀 Redirige vers la page de détail/modification du projet
  allerVersDetail(id: number): void {
    this.router.navigate(['/apprenant/projets', id]);
  }

  creerProjet(): void {
    if (!this.nouveauProjet.titre || !this.nouveauProjet.description) {
      alert("Veuillez remplir le titre et la description.");
      return;
    }

    this.http.post<any>(this.apiUrl, this.nouveauProjet, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.fermerModal();
        this.chargerProjets();
      },
      error: (err) => alert("Erreur : " + (err.error?.message || err.message))
    });
  }

  getTechClass(techno: string): string {
    if (!techno) return 'tech-default';
    const t = techno.toLowerCase();
    if (t.includes('angular')) return 'tech-angular';
    if (t.includes('spring') || t.includes('java')) return 'tech-java';
    if (t.includes('flutter') || t.includes('dart')) return 'tech-flutter';
    return 'tech-default';
  }

  getTechIcon(techno: string): string {
    if (!techno) return '/icones/code.png';
    const t = techno.toLowerCase();
    if (t.includes('angular')) return '/icones/angular.png';
    if (t.includes('react')) return '/icones/react.png';
    if (t.includes('flutter') || t.includes('dart')) return '/icones/flutter.png';
    if (t.includes('java') || t.includes('spring')) return '/icones/java.png';
    if (t.includes('vue') || t.includes('vuejs')) return '/icones/vue.png';

    return '/icones/code.png';
  }
}