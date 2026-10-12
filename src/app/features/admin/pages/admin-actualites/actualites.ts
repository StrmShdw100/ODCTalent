import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Actualite, ActualiteService } from './actualite.service';

@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualites.html',
  styleUrls: ['./actualites.css']
})
export class ActualitesComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Toutes les catégories';
  selectedStatus: string = 'Tous les statuts';

  isModalOpen: boolean = false;
  successMessage: string | null = null;
  selectedFile: File | null = null;

  formModel = {
    title: '',
    category: '',
    publicationDate: '',
    description: '',
    status: 'Publié' as 'Publié' | 'Brouillon',
    imageUrl: ''
  };

  actualites: Actualite[] = [];

  constructor(private actualiteService: ActualiteService) {}

  ngOnInit(): void {
    this.chargerActualites();
  }

  chargerActualites() {
    this.actualiteService.getActualites().subscribe({
      next: (data) => {
        this.actualites = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des actualités :", err);
      }
    });
  }

  openAddModal(): void {
    this.isModalOpen = true;
    this.formModel = { title: '', category: '', publicationDate: '', description: '', status: 'Publié', imageUrl: '' };
    this.selectedFile = null;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitActualite(): void {
    if (this.selectedFile) {
      // 1. Upload du fichier image d'abord
      this.actualiteService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.formModel.imageUrl = response.fileUrl; // Récupère l'URL renvoyée par le FileController
          this.sauvegarderEnBase();
        },
        error: (err) => {
          console.error("Erreur upload image :", err);
          alert("Impossible de téléverser l'image de couverture.");
        }
      });
    } else {
      this.sauvegarderEnBase();
    }
  }

  private sauvegarderEnBase(): void {
    const nouvelleActualite: Actualite = {
      badge: 'ODC',
      title: this.formModel.title,
      description: this.formModel.description,
      category: this.formModel.category || 'Annonce',
      publicationDate: this.formModel.publicationDate || 'Aujourd\'hui',
      status: this.formModel.status,
      author: 'Admin ODC',
      imageUrl: this.formModel.imageUrl
    };

    this.actualiteService.createActualite(nouvelleActualite).subscribe({
      next: (created) => {
        this.actualites.unshift(created);
        this.isModalOpen = false;
        this.successMessage = "Actualité publiée avec succès. L'opportunité est maintenant visible.";
        setTimeout(() => { this.successMessage = null; }, 4000);
      },
      error: (err) => {
        console.error("Erreur lors de l'enregistrement :", err);
        alert("Erreur lors de la création de l'actualité.");
      }
    });
  }

  supprimerActualite(id?: number) {
    if (!id) return;
    if (confirm("Voulez-vous vraiment supprimer cette actualité ?")) {
      this.actualiteService.deleteActualite(id).subscribe({
        next: () => {
          this.actualites = this.actualites.filter(a => a.id !== id);
        },
        error: (err) => {
          console.error("Erreur lors de la suppression :", err);
        }
      });
    }
  }

  toggleMenu(item: Actualite, event: Event): void {
    event.stopPropagation();
    this.actualites.forEach(a => { if (a !== item) a.showMenu = false; });
    item.showMenu = !item.showMenu;
  }

  get filteredActualites(): Actualite[] {
    return this.actualites.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'Toutes les catégories' || 
        item.category === this.selectedCategory;
      
      const matchesStatus = this.selectedStatus === 'Tous les statuts' || 
        item.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }


}