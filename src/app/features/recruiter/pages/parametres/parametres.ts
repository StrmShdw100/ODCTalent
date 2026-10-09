import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './parametres.html',
  styleUrls: ['./parametres.css']
})
export class Parametres {
  modalProfilOuverte = false;
  modalMotDePasseOuverte = false;

  ouvrirProfil() { this.modalProfilOuverte = true; }
  fermerProfil() { this.modalProfilOuverte = false; }

  ouvrirMotDePasse() { this.modalMotDePasseOuverte = true; }
  fermerMotDePasse() { this.modalMotDePasseOuverte = false; }
}