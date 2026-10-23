import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  isAddModalOpen: boolean = false;
  activeTab: 'unique' | 'import' = 'unique';

  nouveauApprenant = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    promotion: 'P6',
    formation: 'Dev Mobile et web'
  };

  selectedFile: File | null = null;
  promotionImport: string = 'P6';

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
    enEmploi: '0%',
    enRecherche: '0%'
  };

  apprenants: Apprenant[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.chargerApprenants();
    this.chargerStats(); 
  }

  ouvrirModalAjout() {
    this.isAddModalOpen = true;
    this.nouveauApprenant = { nom: '', prenom: '', email: '', telephone: '', promotion: 'P6', formation: 'Dev Mobile et web' };
    this.selectedFile = null;
    this.activeTab = 'unique';
    this.cdr.detectChanges();
  }

  fermerModalAjout() {
    this.isAddModalOpen = false;
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  creerApprenantUnique() {
    if (!this.nouveauApprenant.nom || !this.nouveauApprenant.prenom || !this.nouveauApprenant.email) {
      alert("Veuillez remplir les champs obligatoires (Nom, Prénom, Email).");
      return;
    }

    this.http.post('http://localhost:8080/api/v1/admin/apprenants', this.nouveauApprenant, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert("Apprenant ajouté avec succès !");
        this.fermerModalAjout();
        this.chargerApprenants();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout :", err);
        alert("Erreur lors de la création de l'apprenant.");
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  importerPromotion() {
    if (!this.selectedFile) {
      alert("Veuillez sélectionner un fichier Excel.");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('promotion', this.promotionImport);

    this.http.post('http://localhost:8080/api/v1/admin/apprenants/import', formData, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        alert(res.message || "Importation réussie avec succès !");
        this.fermerModalAjout();
        this.chargerApprenants();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de l'importation :", err);
        alert("Erreur lors de l'importation du fichier Excel.");
      }
    });
  }

  chargerStats() {
    this.http.get<any>('http://localhost:8080/api/v1/admin/apprenants/stats', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.stats = {
          inscrits: data.inscrits,
          suivis: data.suivis,
          enEmploi: data.enEmploi,
          enRecherche: data.enRecherche
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des statistiques :", err);
      }
    });
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

        this.chargerStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des apprenants :", err);
      }
    });
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
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

  autoriserCompte(id: number) {
    this.http.put(`http://localhost:8080/api/v1/admin/utilisateurs/${id}/autoriser`, {}, { 
      headers: this.getHeaders(), 
      responseType: 'text' 
    }).subscribe({
      next: () => {
        alert("Compte apprenant autorisé avec succès !");
        this.chargerApprenants(); 
        this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  selectPromotion(promo: string): void {
    this.selectedPromotion = promo;
    this.isPromotionOpen = false;
    this.cdr.detectChanges();
  }

  toggleFormationDropdown(): void {
    this.isFormationOpen = !this.isFormationOpen;
    this.isPromotionOpen = false;
    this.cdr.detectChanges();
  }

  selectFormation(formation: string): void {
    this.selectedFormation = formation;
    this.isFormationOpen = false;
    this.cdr.detectChanges();
  }

  toggleMenu(item: Apprenant, event: Event): void {
    event.stopPropagation();
    this.apprenants.forEach(a => { if (a !== item) a.showMenu = false; });
    item.showMenu = !item.showMenu;
    this.cdr.detectChanges();
  }
}