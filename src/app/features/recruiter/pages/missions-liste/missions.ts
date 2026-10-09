import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './missions.html',
  styleUrls: ['./missions.css']
})
export class Missions {
  modalOuverte = false;
  succesOuvert = false;

ouvrirModal() {
    this.modalOuverte = true;
  }

fermerModal() {
    this.modalOuverte = false;
  }

publierMission() {
    this.modalOuverte = false;
    this.succesOuvert = true;
  }

fermerSucces() {
    this.succesOuvert = false;
  }
}