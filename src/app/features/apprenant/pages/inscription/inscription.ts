import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css']
})
export class Inscription {
  menuProfilOuvert = false;
  profilSelectionne = 'Apprenant ODC';

  constructor(private router: Router) {}

  basculerMenuProfil() {
    this.menuProfilOuvert = !this.menuProfilOuvert;
  }

  choisirProfil(profil: string) {
    this.profilSelectionne = profil;
    this.menuProfilOuvert = false;
  }

  soumettreInscription() {
    // Redirection vers l'étape des compétences/expériences
    this.router.navigate(['/apprenant/inscription-competences']);
  }
}