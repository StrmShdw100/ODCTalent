import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Données statistiques initiales (seront remplacées par l'appel API du backend)
  stats = {
    apprenants: 1248,
    recruteurs: 86,
    projetsAModerer: 24,
    opportunitesActives: 37,
    nouvellesOpportunites: 12
  };

  recentActivities = [
    { title: 'Yaya Diarra a soumis un nouveau projet', time: 'Il y a 12 minutes', type: 'project' },
    { title: 'Orange Sénégal a publié une opportunité', time: 'Il y a 1 heure', type: 'opportunity' },
    { title: 'Modou Kane a mis à jour son profil', time: 'Il y a 3 heures', type: 'profile' },
    { title: 'Madou Konte publier un offre de recrutement', time: 'Il y a 3 heures', type: 'job' }
  ];

  constructor() {}

  ngOnInit(): void {
    // Ici, tu pourras injecter ton dashboardService pour appeler ton API Spring Boot :
    // this.dashboardService.getStats().subscribe(data => this.stats = data);
  }
}