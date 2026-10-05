import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AdminRecruteur {
  id: number;
  badgeBg: string;
  initials: string;
  companyName: string;
  location: string;
  recruiterName: string;
  email: string;
  sector: string;
  status: 'Actif' | 'Inactif';
  offresCount: number;
  showMenu?: boolean;
}

@Component({
  selector: 'app-admin-recruteurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-recruteurs.html',
  styleUrls: ['./admin-recruteurs.css']
})
export class AdminRecruteursComponent implements OnInit {
  searchTerm: string = '';

  stats = {
    recruteursActifs: 86,
    recruteursActifsSub: '+8 ce mois',
    entreprisesPartenaires: 37,
    entreprisesSub: '+4 nouvelles',
    comptesAVerifier: 5,
    opportunitesPubliees: 231,
    opportunitesSub: '+18 ce mois'
  };

  recruteurs: AdminRecruteur[] = [
    { id: 1, badgeBg: '#FF7900', initials: 'SD', companyName: 'Sonatel Digital', location: 'Dakar', recruiterName: 'Khadija Ba', email: 'khadija.ba@sonatel.sn', sector: 'Télécoms', status: 'Actif', offresCount: 24 },
    { id: 2, badgeBg: '#111111', initials: 'WM', companyName: 'Wave Mobile Money', location: 'Dakar', recruiterName: 'Pierre Sagna', email: 'pierre.sagna@wave.com', sector: 'Finance', status: 'Actif', offresCount: 17 },
    { id: 3, badgeBg: '#d35400', initials: 'B+', companyName: 'Baobab+', location: 'Dakar', recruiterName: 'Marième Thiam', email: 'marieme.thiam@baobabplus.com', sector: 'Énergie', status: 'Inactif', offresCount: 9 },
    { id: 4, badgeBg: '#555555', initials: 'YE', companyName: 'Yobante Express', location: 'Dakar', recruiterName: 'Alioune Diop', email: 'alioune.diop@yobante.com', sector: 'Logistique', status: 'Actif', offresCount: 6 },
    { id: 5, badgeBg: '#e67e22', initials: 'AF', companyName: 'Africatel', location: 'Dakar', recruiterName: 'Fatou Ndiaye', email: 'fatou.ndiaye@africatel.com', sector: 'Services', status: 'Inactif', offresCount: 3 }
  ];

  ngOnInit(): void {}

  toggleMenu(item: AdminRecruteur, event: Event): void {
    event.stopPropagation();
    this.recruteurs.forEach(r => { if (r !== item) r.showMenu = false; });
    item.showMenu = !item.showMenu;
  }
}