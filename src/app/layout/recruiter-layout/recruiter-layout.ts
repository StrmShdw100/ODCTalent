import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-recruiter-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recruiter-layout.html',
  styleUrls: ['./recruiter-layout.css']
})
export class RecruiterLayout {

  constructor(private router: Router) {}

 deconnecter(): void {
    console.log("=== DÉCONNEXION EN COURS ===");
    

    localStorage.clear(); 

    this.router.navigate(['/login']).then((success) => {
      console.log("Navigation vers /login réussie :", success);
    }).catch((err) => {
      console.error("Erreur de navigation vers /login :", err);
    });
  }
}