import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModerationService } from '../admin-moderation/moderation.service';

@Component({
  selector: 'app-admin-projet-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-projet-detail.html',
  styleUrls: ['./admin-projet-detail.css']
})
export class AdminProjetDetailComponent implements OnInit {
  projet: any = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moderationService: ModerationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.chargerDetailProjet(+idParam);
    }
  }

  chargerDetailProjet(id: number): void {
    this.moderationService.getProjetById(id).subscribe({
      next: (data) => {
        this.projet = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des détails du projet :", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  changerStatut(nouveauStatut: string): void {
    if (!this.projet) return;
    this.moderationService.changerStatutProjet(this.projet.id, nouveauStatut).subscribe({
      next: () => {
        this.projet.statut = nouveauStatut;
        alert(`Le projet est maintenant passé au statut : ${nouveauStatut}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du changement de statut", err);
        alert("Impossible de modifier le statut.");
      }
    });
  }

  retour(): void {
    this.router.navigate(['/admin/moderation']);
  }
}