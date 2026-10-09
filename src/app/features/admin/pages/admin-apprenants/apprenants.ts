import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Apprenant {
  id: number;
  initials: string;
  name: string;
  location: string;
  email: string;
  formation: string;
  projectsCount: number;
  status: 'Actif' | 'Inactif';
  inscriptionDate: string;
  showMenu?: boolean;
}

@Component({
  selector: 'app-apprenants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apprenants.html',
  styleUrls: ['./apprenants.css']
})
export class ApprenantsComponent implements OnInit {
  searchTerm: string = '';
  selectedPromotion: string = 'Promotion';
  selectedFormation: string = 'Formation';

  isPromotionOpen: boolean = false;
  isFormationOpen: boolean = false;

  promotions: string[] = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P9', 'P10', 'P11', 'P12'];
  formations: string[] = ['Dev Mobile et web', 'AWS', 'Musso tech'];

  stats = {
    inscrits: '1 248',
    suivis: '1 048',
    enEmploi: '72%',
    enRecherche: '21%'
  };

  apprenants: Apprenant[] = [
    { id: 1, initials: 'NS', name: 'Aminata Traoré', location: 'Mali', email: 'ndeye.sarr@odctalent.sn', formation: 'Dev Mobile et web', projectsCount: 5, status: 'Actif', inscriptionDate: '22 nov. 2025' },
    { id: 2, initials: 'MK', name: 'Modou Kane', location: 'Dakar', email: 'modou.kane@odctalent.sn', formation: 'Dev Mobile et web', projectsCount: 1, status: 'Actif', inscriptionDate: '09 mai 2026' },
    { id: 3, initials: 'AD', name: 'Awa Ndiaye', location: 'Dakar', email: 'awa.ndiaye@odctalent.sn', formation: 'AWS', projectsCount: 9, status: 'Actif', inscriptionDate: '18 mars 2026' },
    { id: 4, initials: 'IF', name: 'Ibrahima Fall', location: 'Saint-Louis', email: 'ibrahima.fall@odctalent.sn', formation: 'Dev Mobile et web', projectsCount: 2, status: 'Actif', inscriptionDate: '12 fév. 2026' },
    { id: 5, initials: 'AB', name: 'Aïssatou Barry', location: 'Ziguinchor', email: 'aissatou.barry@odctalent.sn', formation: 'AWS', projectsCount: 7, status: 'Actif', inscriptionDate: '07 jan. 2026' },
    { id: 6, initials: 'CG', name: 'Cheikh Gueye', location: 'Dakar', email: 'cheikh.gueye@odctalent.sn', formation: 'AWS', projectsCount: 3, status: 'Inactif', inscriptionDate: '15 déc. 2025' }
  ];

  ngOnInit(): void {}

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