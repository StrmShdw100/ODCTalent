import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

export interface Apprenant {
  id: number;
  initials: string;
  name: string;
  location: string;
  email: string;
  formation: string;
  promotion: string;
  projectsCount: number;
  status: 'Actif' | 'Inactif' | 'En attente';
  inscriptionDate: string;
  disponibilite?: boolean;
  showMenu?: boolean;
}

@Component({
  selector: 'app-apprenants',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './apprenants.html',
  styleUrls: ['./apprenants.css']
})
export class ApprenantsComponent implements OnInit {
  searchTerm: string = '';
  selectedPromotion: string = 'Toutes les promotions';
  selectedFormation: string = 'Toutes les formations';

  isPromotionOpen: boolean = false;
  isFormationOpen: boolean = false;

  promotions: string[] = ['Toutes les promotions', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P9', 'P10', 'P11', 'P12'];
  formations: string[] = ['Toutes les formations', 'Dev Mobile et web', 'AWS', 'Musso tech'];

  stats = {
    inscrits: '0',
    suivis: '0',
    enEmploi: '72%',
    enRecherche: '21%'
  };

  apprenants: Apprenant[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerApprenants();
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

 chargerApprenants() {
    this.http.get<any[]>('http://localhost:8080/api/v1/admin/apprenants/tous', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.apprenants = data.map(u => ({
          id: u.id,
          initials: ((u.prenom?.charAt(0) || '') + (u.nom?.charAt(0) || '')).toUpperCase(),
          name: `${u.prenom} ${u.nom}`,
          location: u.localisation || u.telephone || 'Mali / Dakar',
          email: u.email,
          formation: u.formation || 'Dev Mobile et web',
          promotion: u.promotion || 'P6',
          projectsCount: u.portfolio?.projets ? u.portfolio.projets.length : 0,
          status: u.actif ? 'Actif' : 'En attente',
          inscriptionDate: u.dateInscription ? new Date(u.dateInscription).toLocaleDateString() : 'Récemment',
          disponibilite: u.disponibilite ?? true 
        }));

        this.stats.inscrits = this.apprenants.length.toString();
        this.stats.suivis = this.apprenants.filter(a => a.status === 'Actif').length.toString();

        const total = this.apprenants.length;
        if (total > 0) {
          const enRechercheCount = this.apprenants.filter(a => a.disponibilite === true).length;
          const enEmploiCount = total - enRechercheCount;

          this.stats.enRecherche = Math.round((enRechercheCount / total) * 100) + '%';
          this.stats.enEmploi = Math.round((enEmploiCount / total) * 100) + '%';
        } else {
          this.stats.enRecherche = '0%';
          this.stats.enEmploi = '0%';
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement des apprenants :", err);
      }
    });
  }

  get filteredApprenants(): Apprenant[] {
    return this.apprenants.filter(item => {
      const matchesSearch = !this.searchTerm ||
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesPromo = this.selectedPromotion === 'Toutes les promotions' || item.promotion === this.selectedPromotion;
      const matchesFormation = this.selectedFormation === 'Toutes les formations' || item.formation === this.selectedFormation;

      return matchesSearch && matchesPromo && matchesFormation;
    });
  }

  // 3. Action d'autoriser un compte apprenant
  autoriserCompte(id: number) {
    this.http.put(`http://localhost:8080/api/v1/admin/utilisateurs/${id}/autoriser`, {}, { 
      headers: this.getHeaders(), 
      responseType: 'text' 
    }).subscribe({
      next: () => {
        alert("Compte apprenant autorisé avec succès !");
        this.chargerApprenants(); // On recharge la liste
      },
      error: (err) => {
        console.error("Erreur lors de l'autorisation :", err);
        alert("Impossible d'autoriser ce compte.");
      }
    });
  }

  togglePromotionDropdown(): void {
    this.isPromotionOpen = !this.isPromotionOpen;
    this.isFormationOpen = false;
  }

  selectPromotion(promo: string): void {
    this.selectedPromotion = promo;
    this.isPromotionOpen = false;
  }

  toggleFormationDropdown(): void {
    this.isFormationOpen = !this.isFormationOpen;
    this.isPromotionOpen = false;
  }

  selectFormation(formation: string): void {
    this.selectedFormation = formation;
    this.isFormationOpen = false;
  }

  toggleMenu(item: Apprenant, event: Event): void {
    event.stopPropagation();
    this.apprenants.forEach(a => { if (a !== item) a.showMenu = false; });
    item.showMenu = !item.showMenu;
  }
}