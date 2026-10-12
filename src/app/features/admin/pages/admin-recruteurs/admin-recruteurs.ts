import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // 👈 Indispensable pour appeler le backend

export interface AdminRecruteur {
  id: number;
  badgeBg: string;
  initials: string;
  companyName: string;
  location: string;
  recruiterName: string;
  email: string;
  sector: string;
  status: 'Actif' | 'Inactif' | 'En attente';
  offresCount: number;
  showMenu?: boolean;
}

@Component({
  selector: 'app-admin-recruteurs',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-recruteurs.html',
  styleUrls: ['./admin-recruteurs.css']
})
export class AdminRecruteursComponent implements OnInit {
  searchTerm: string = '';

  stats = {
    recruteursActifs: 0,
    recruteursActifsSub: 'En temps réel',
    entreprisesPartenaires: 0,
    entreprisesSub: 'Partenaires',
    comptesAVerifier: 0,
    opportunitesPubliees: 0,
    opportunitesSub: 'Actives'
  };

  recruteurs: AdminRecruteur[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerRecruteurs();
  }

  // 1. Récupérer la liste des utilisateurs depuis ton Backend Admin
  chargerRecruteurs() {
    // Si tu as un service dédié, tu peux l'injecter. Ici on utilise HttpClient directement vers ton endpoint :
    this.http.get<any[]>('http://localhost:8080/api/v1/admin/utilisateurs/en-attente').subscribe({
      next: (data) => {
        this.recruteurs = data
          .filter(u => u.role === 'RECRUTEUR')
          .map((u, index) => ({
            id: u.id,
            badgeBg: '#FF7900',
            initials: (u.prenom?.charAt(0) || '') + (u.nom?.charAt(0) || ''),
            companyName: u.entreprise || 'Entreprise partenaire',
            location: 'Dakar',
            recruiterName: `${u.prenom} ${u.nom}`,
            email: u.email,
            sector: 'Non spécifié',
            status: u.actif ? 'Actif' : 'En attente',
            offresCount: 0
          }));
        
        this.stats.comptesAVerifier = this.recruteurs.filter(r => r.status === 'En attente').length;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des recruteurs en attente :", err);
      }
    });
  }

  autoriserCompte(id: number) {
    this.http.put(`http://localhost:8080/api/v1/admin/utilisateurs/${id}/autoriser`, {}, { responseType: 'text' }).subscribe({
      next: (response) => {
        alert("Compte autorisé avec succès !");
        this.chargerRecruteurs();
      },
      error: (err) => {
        console.error("Erreur lors de l'autorisation :", err);
        alert("Impossible d'autoriser ce compte.");
      }
    });
  }

  toggleMenu(item: AdminRecruteur, event: Event): void {
    event.stopPropagation();
    this.recruteurs.forEach(r => { if (r !== item) r.showMenu = false; });
    item.showMenu = !item.showMenu;
  }
}