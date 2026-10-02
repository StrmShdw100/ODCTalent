import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface TimelineItem {
  date: string;
  title: string;
  isCurrent?: boolean;
}

@Component({
  selector: 'app-apprenant-evolution',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './apprenant-evolution.html',
  styleUrls: ['./apprenant-evolution.css']
})
export class ApprenantEvolutionComponent implements OnInit {
  apprenant = {
    initials: 'AT',
    name: 'Aminata Traoré',
    specialty: 'UI/UX Design',
    promotion: 'Promotion 2026',
    email: 'aminata@odctalent.ml',
    location: 'Bamako, Mali',
    status: 'En emploi'
  };

  currentSituation = {
    poste: 'UI/UX Designer',
    entreprise: 'Entreprise A',
    localisation: 'Bamako',
    dateObtention: '15 sept. 2026',
    typeTravail: 'Emploi salarié'
  };

  timeline: TimelineItem[] = [
    { date: '15 septembre 2026', title: "Obtention d'un emploi — UI/UX Designer", isCurrent: true },
    { date: 'Septembre 2026', title: "Début de l'insertion professionnelle" },
    { date: 'Formation 2026', title: 'Formation UI/UX Design terminée' }
  ];

  ngOnInit(): void {}
}