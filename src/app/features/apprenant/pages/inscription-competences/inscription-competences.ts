import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inscription-competences',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inscription-competences.html',
  styleUrls: ['./inscription-competences.css']
})
export class InscriptionCompetences {
  constructor(private router: Router) {}

  finaliserInscription() {
    // Redirection vers le tableau de bord apprenant après validation
    this.router.navigate(['/apprenant/tableau-de-bord']);
  }
}