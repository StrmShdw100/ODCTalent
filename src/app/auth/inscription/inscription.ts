import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css']
})
export class InscriptionComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  telephone: string = '';
  motDePasse: string = '';
  role: string = 'APPRENANT';
  
  selectedFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  chargement: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  soumettreInscription() {
    this.errorMessage = '';
    this.successMessage = '';
    this.chargement = true;

    // S'il y a un fichier sélectionné, on l'upload d'abord via ton FileController
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post<any>('http://localhost:8080/api/v1/files/upload', formData).subscribe({
        next: (response) => {
          // response.fileUrl contient le lien direct renvoyé par ton FileController
          const photoUrl = response.fileUrl;
          this.envoyerInscriptionFinale(photoUrl);
        },
        error: (err) => {
          console.error("Erreur lors de l'upload du fichier :", err);
          this.errorMessage = "Impossible de téléverser la photo de profil.";
          this.chargement = false;
        }
      });
    } else {
      // Pas de fichier, on envoie directement l'inscription (photoProfil sera null/vide)
      this.envoyerInscriptionFinale('');
    }
  }

  private envoyerInscriptionFinale(photoUrl: string) {
    const payload = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      motDePasse: this.motDePasse,
      role: this.role,
      photoProfil: photoUrl // On associe l'URL générée par ton FileController
    };

    this.http.post('http://localhost:8080/api/v1/auth/register', payload, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.successMessage = "Inscription réussie ! Votre compte est en attente de validation.";
        this.chargement = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        console.error("Erreur lors de l'inscription :", err);
        this.errorMessage = "Une erreur est survenue lors de l'inscription.";
        this.chargement = false;
      }
    });
  }
}