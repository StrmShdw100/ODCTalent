import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-projets-apprenant',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './projets.html',
  styleUrls: ['./projets.css']
})
export class ProjetsApprenant implements OnInit {
  projets: any[] = [];
  modalOuverte = false;
  
  // 🔍 Gestion de la modale de détails
  modalDetailOuverte = false;
  projetSelectionne: any = null;

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
      error: (err) => {
        console.error("Erreur lors du chargement des projets :", err);
      }
    });
  }

  ouvrirModal(): void {
    this.modalOuverte = true;
  }

  fermerModal(): void {
    this.modalOuverte = false;
    this.nouveauProjet = { titre: '', description: '', technologies: '', imageUrl: '', githubUrl: '', demoUrl: '' };
  }

  // 🔍 Ouvrir la modale de détails
  ouvrirDetail(projet: any): void {
    this.projetSelectionne = projet;
    this.modalDetailOuverte = true;
  }

  // 🔍 Fermer la modale de détails
  fermerDetail(): void {
    this.modalDetailOuverte = false;
    this.projetSelectionne = null;
  }

  creerProjet(): void {
    if (!this.nouveauProjet.titre || !this.nouveauProjet.description) {
      alert("Veuillez remplir le titre et la description du projet.");
      return;
    }

    this.http.post<any>(this.apiUrl, this.nouveauProjet, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.fermerModal();
        this.chargerProjets();
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du projet :", err);
        const errorMsg = err.error?.message || err.message || "Erreur technique";
        alert("Impossible d'ajouter le projet : " + errorMsg);
      }
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
    if (t.includes('vue')) return '/icones/vue.png';
    if (t.includes('node') || t.includes('express')) return '/icones/node.png';
    if (t.includes('python') || t.includes('django')) return '/icones/python.png';
    
    return '/icones/code.png';
  }
}