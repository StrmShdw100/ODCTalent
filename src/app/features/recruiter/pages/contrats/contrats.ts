import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contrats.html',
  styleUrls: ['./contrats.css']
})
export class Contrats {
  modalCreationOuverte = false;
  modalSuccesOuverte = false;

  ouvrirCreation() { this.modalCreationOuverte = true; }
  fermerCreation() { this.modalCreationOuverte = false; }

  creerContrat() {
    this.modalCreationOuverte = false;
    this.modalSuccesOuverte = true;
  }

  fermerSucces() { this.modalSuccesOuverte = false; }
}