import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidature-detail.html',
  styleUrls: ['./candidature-detail.css']
})
export class CandidatureDetail {
  modalValidationOuverte = false;
  modalRefusOuverte = false;

  ouvrirValidation() { this.modalValidationOuverte = true; }
  fermerValidation() { this.modalValidationOuverte = false; }

  ouvrirRefus() { this.modalRefusOuverte = true; }
  fermerRefus() { this.modalRefusOuverte = false; }
}