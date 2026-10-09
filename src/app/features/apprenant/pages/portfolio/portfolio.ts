import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apprenant-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css']
})
export class PortfolioApprenant {
  langueActive = 'Français';

  changerLangue(langue: string) {
    this.langueActive = langue;
  }
}